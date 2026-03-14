// src/components/steps/Step4Results.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
  CalcInputs, CalcResult, SCENARIOS, ScenarioKey,
  calculateScenarios, buildYearlyBreakdown,
  calcRequiredSIP, inflateGoal,
} from "@/lib/finance";
import { formatINR, formatINRShort } from "@/lib/formatters";
import { DISCLAIMER } from "@/lib/goals";

interface Props {
  goalEmoji: string;
  goalName: string;
  inputs: CalcInputs;
  result: CalcResult;
  onStartOver: () => void;
}

export default function Step4Results({
  goalEmoji, goalName, inputs, result, onStartOver,
}: Props) {
  const [activeScen, setActiveScen] = useState<ScenarioKey>("conservative");
  const [activeMs,   setActiveMs]   = useState<number | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const chartRef     = useRef<HTMLCanvasElement>(null);
  const chartInst    = useRef<any>(null);

  const scenarios  = calculateScenarios(inputs);
  const scenResult = scenarios[activeScen];

  // ── milestone years ──────────────────────────────────────────────────────
  const msYears = Array.from(
    new Set([3, 5, 10, 15, 20].filter((y) => y < inputs.years).concat([inputs.years]))
  );

  // ── get a yearly breakdown point ─────────────────────────────────────────
  const getPoint = (yr: number) => {
    const bd = buildYearlyBreakdown(
      result.requiredMonthlySIP,
      inputs.annualReturn,
      Math.min(yr, inputs.years),
      inputs.annualStepUp
    );
    return bd[bd.length - 1] ?? null;
  };

  // ── load Chart.js from CDN then draw ─────────────────────────────────────
  useEffect(() => {
    // if already loaded (layout CDN script already ran), just draw
    if (typeof window !== "undefined" && (window as any).Chart) {
      setChartReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.async = true;
    script.onload  = () => setChartReady(true);
    script.onerror = () => console.error("Chart.js CDN failed to load");
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  // ── draw / redraw chart whenever ready or inputs change ──────────────────
  useEffect(() => {
    if (!chartReady || !chartRef.current) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;

    const yr = activeMs ?? inputs.years;
    const bd = buildYearlyBreakdown(
      result.requiredMonthlySIP,
      inputs.annualReturn,
      Math.min(yr, inputs.years),
      inputs.annualStepUp
    );

    if (chartInst.current) {
      chartInst.current.destroy();
      chartInst.current = null;
    }

    chartInst.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: bd.map((p) => `Yr ${p.year}`),
        datasets: [
          {
            label: "Corpus",
            data: bd.map((p) => p.corpus),
            borderColor: "#224c87",
            backgroundColor: "rgba(34,76,135,0.07)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Invested",
            data: bd.map((p) => p.invested),
            borderColor: "#da3832",
            backgroundColor: "rgba(218,56,50,0.04)",
            fill: true,
            tension: 0,
            pointRadius: 0,
            borderWidth: 1.5,
            borderDash: [4, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c: any) => " " + formatINRShort(c.raw) },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 9, family: "Montserrat, Arial" },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
            },
          },
          y: {
            grid: { color: "#f0f4fa" },
            ticks: {
              font: { size: 9, family: "Montserrat, Arial" },
              callback: (v: any) => formatINRShort(v),
            },
          },
        },
      },
    });
  }, [chartReady, activeMs, inputs, result]);

  // cleanup on unmount
  useEffect(() => {
    return () => { chartInst.current?.destroy(); };
  }, []);

  // ── PDF download ──────────────────────────────────────────────────────────
  // jsPDF only supports Latin-1 with the default helvetica font.
  // Strip all emoji and replace Rs symbol so nothing renders as boxes.
  const pdfSafe = (s: string) =>
    s.replace(/[^\x00-\x7E\u00A0-\u00FF]/g, "")   // keep Latin-1 only
     .replace(/₹/g, "Rs.")                          // Rs. instead of ₹
     .trim();

  const handlePDF = async () => {
    try {
      const mod = await import("jspdf");
      const jsPDF = mod.jsPDF ?? (mod as any).default?.jsPDF ?? (mod as any).default;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw  = doc.internal.pageSize.getWidth();

      // ── Header ──────────────────────────────────────────────────────────────
      doc.setFillColor(34, 76, 135);
      doc.rect(0, 0, pw, 36, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(17); doc.setFont("helvetica", "bold");
      doc.text("FINCAL - Goal-Based Investment Calculator", 14, 13);
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.text("HDFC Mutual Fund | Investor Education Tool", 14, 20);
      doc.text(
        "Generated: " + new Date().toLocaleDateString("en-IN", {
          day: "2-digit", month: "long", year: "numeric",
        }),
        14, 27
      );

      // ── Goal hero card ───────────────────────────────────────────────────────
      doc.setFillColor(232, 240, 251);
      doc.roundedRect(14, 42, pw - 28, 22, 3, 3, "F");
      doc.setTextColor(34, 76, 135);
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text(pdfSafe(goalName) + " - Goal Plan", 20, 52);
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 110);
      doc.text(
        "Monthly SIP: " + pdfSafe(formatINR(result.requiredMonthlySIP)) +
        "   |   Duration: " + inputs.years + " years" +
        "   |   Target: " + pdfSafe(formatINR(result.inflatedGoalValue)),
        20, 61
      );

      // ── Key Metrics ──────────────────────────────────────────────────────────
      let y = 74;
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(34, 76, 135);
      doc.text("Key Metrics", 14, y); y += 6;

      const metrics: [string, string][] = [
        ["Inflated Goal Value",  pdfSafe(formatINR(result.inflatedGoalValue))],
        ["Total You Invest",     pdfSafe(formatINR(result.totalAmountInvested))],
        ["Estimated Gains",      pdfSafe(formatINR(result.estimatedGains))],
        ["After-Tax Corpus",     pdfSafe(formatINR(result.afterTaxCorpus))],
        ["Wealth Multiple",      result.wealthMultiple.toFixed(1) + "x"],
      ];
      metrics.forEach(([k, v]) => {
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        doc.text(k, 18, y);
        doc.setFont("helvetica", "bold"); doc.setTextColor(34, 76, 135);
        doc.text(v, pw - 14, y, { align: "right" });
        y += 6;
      });

      // ── Assumptions ──────────────────────────────────────────────────────────
      y += 4;
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(34, 76, 135);
      doc.text("Assumptions Used", 14, y); y += 6;

      const assumptions: [string, string][] = [
        ["Goal",            pdfSafe(goalName)],
        ["Current Cost",    pdfSafe(formatINR(inputs.currentCost))],
        ["Years to Goal",   inputs.years + " year" + (inputs.years > 1 ? "s" : "")],
        ["Expected Return", (inputs.annualReturn * 100).toFixed(1) + "% p.a."],
        ["Inflation Rate",  (inputs.inflationRate * 100).toFixed(1) + "% p.a."],
        ["SIP Step-up",     (inputs.annualStepUp * 100).toFixed(0) + "%"],
        ["LTCG Tax",        (inputs.taxRate * 100).toFixed(0) + "%"],
        ["Formula",         "SIP = FV x r / (((1+r)^n - 1) x (1+r))"],
        ["Compounding",     "Monthly (beginning of month)"],
      ];
      assumptions.forEach(([k, v]) => {
        doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 80);
        doc.text(k, 18, y);
        doc.setFont("helvetica", "bold"); doc.setTextColor(50, 50, 80);
        doc.text(v, pw - 14, y, { align: "right" });
        y += 5.5;
      });

      // ── Disclaimer box ───────────────────────────────────────────────────────
      y += 4;
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(14, y, pw - 28, 30, 2, 2, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(146, 64, 14);
      doc.text("DISCLAIMER", 18, y + 7);
      doc.setFont("helvetica", "normal"); doc.setTextColor(120, 53, 15);
      const discLines = doc.splitTextToSize(pdfSafe(DISCLAIMER), pw - 36);
      doc.text(discLines, 18, y + 14);

      // ── Footer ───────────────────────────────────────────────────────────────
      doc.setFontSize(7); doc.setTextColor(150, 150, 160);
      doc.text(
        "Built by Team ThreadHeads | Technex 2026 | IIT BHU | HDFC Mutual Fund Investor Education",
        14, 290
      );

      doc.save("FinCal_" + goalName.replace(/[^a-zA-Z0-9]/g, "_") + "_Plan.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    }
  };

  // ── early return insight ──────────────────────────────────────────────────
  const sipNow   = result.requiredMonthlySIP;
  const sipEarly = calcRequiredSIP(
    inflateGoal(inputs.currentCost, inputs.inflationRate, inputs.years + 5),
    inputs.annualReturn,
    inputs.years + 5
  );
  const savingPct = Math.max(0, Math.round((1 - sipEarly / sipNow) * 100));

  // ── active milestone point ────────────────────────────────────────────────
  const msPt = activeMs ? getPoint(activeMs) : null;

  return (
    <div>
      <p className="breadcrumb">
        Goal › Details › Assumptions › <strong>Your Investment Plan</strong>
      </p>
      <h1 className="page-title">Your Investment Plan</h1>

      {/* ── HERO ── */}
      <div className="result-hero">
        <div className="rh-goal-row">
          <span className="rh-goal-icon" aria-hidden="true">{goalEmoji}</span>
          <div>
            <div className="rh-goal-label">Your Goal</div>
            <div className="rh-goal-name">{goalName}</div>
          </div>
        </div>
        <div className="rh-divider" aria-hidden="true" />
        <div className="rh-sip-label">Estimated Monthly SIP Needed</div>
        <div className="rh-sip" aria-live="polite">{formatINR(result.requiredMonthlySIP)}</div>
        <div className="rh-sip-sub">
          Invest every month for {inputs.years} year{inputs.years > 1 ? "s" : ""} to achieve your {goalName} goal
        </div>
        <div className="rh-cards">
          {([
            ["Target Amount",   formatINRShort(result.inflatedGoalValue)],
            ["Time Horizon",    `${inputs.years} Year${inputs.years > 1 ? "s" : ""}`],
            ["Expected Return", `${(inputs.annualReturn * 100).toFixed(1)}% p.a.`],
            ["Inflation Used",  `${(inputs.inflationRate * 100).toFixed(1)}% p.a.`],
          ] as [string, string][]).map(([label, val]) => (
            <div key={label} className="rh-card">
              <div className="rh-card-label">{label}</div>
              <div className="rh-card-val">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AFFORDABILITY WARNING ── */}
      {result.requiredMonthlySIP > 100_000 && (
        <div className="afford-note" role="alert">
          ⚠️ This plan requires {formatINR(result.requiredMonthlySIP)}/month. If that feels high,
          try increasing your time horizon or adjusting your goal cost.
        </div>
      )}

      {/* ── SCENARIO COMPARISON ── */}
      <div className="chart-panel">
        <p className="chart-title">Scenario Comparison</p>
        <p className="chart-subtitle">
          How different return assumptions affect your required SIP.
        </p>
        <div className="scen-row" role="group" aria-label="Scenario selection">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.key}
              className={`scen-btn${activeScen === sc.key ? " active" : ""}`}
              onClick={() => setActiveScen(sc.key)}
              aria-pressed={activeScen === sc.key}
            >
              {sc.label} ({(sc.ret * 100).toFixed(0)}%)
            </button>
          ))}
        </div>
        <div className="scen-detail" aria-live="polite">
          <strong>{SCENARIOS.find((s) => s.key === activeScen)?.label}:</strong>{" "}
          {SCENARIOS.find((s) => s.key === activeScen)?.desc}
        </div>
        <div className="scen-nums">
          <div className="scen-num">
            <div>Monthly SIP</div>
            <div style={{ color: "var(--blue)" }}>{formatINR(scenResult.requiredMonthlySIP)}</div>
          </div>
          <div className="scen-num">
            <div>Final Corpus</div>
            <div style={{ color: "var(--red)" }}>{formatINRShort(scenResult.inflatedGoalValue)}</div>
          </div>
          <div className="scen-num">
            <div>Total Invested</div>
            <div>{formatINRShort(scenResult.totalAmountInvested)}</div>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-lbl">Inflated goal value</div>
          <div className="stat-val blue">{formatINR(result.inflatedGoalValue)}</div>
        </div>
        <div className="stat">
          <div className="stat-lbl">Total you invest</div>
          <div className="stat-val">{formatINR(result.totalAmountInvested)}</div>
        </div>
        <div className="stat">
          <div className="stat-lbl">Estimated gains</div>
          <div className="stat-val red">{formatINR(result.estimatedGains)}</div>
        </div>
        <div className="stat">
          <div className="stat-lbl">After-tax corpus</div>
          <div className="stat-val blue">{formatINR(result.afterTaxCorpus)}</div>
        </div>
      </div>

      {/* ── WEALTH BARS ── */}
      <div className="bar-section">
        <p className="bar-title">Where your wealth comes from</p>
        <div className="bar-row">
          <div className="bar-meta">
            <span>Your investment</span><span>{result.investedPct}%</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ background: "var(--blue)", width: `${result.investedPct}%` }}
            />
          </div>
        </div>
        <div className="bar-row">
          <div className="bar-meta">
            <span>Market gains (power of compounding)</span>
            <span>{result.gainsPct}%</span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ background: "var(--red)", width: `${result.gainsPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="chart-panel">
        <p className="chart-title">Corpus Growth Over Time</p>

        {/* milestone buttons */}
        <div className="ms-row" role="group" aria-label="View milestone data">
          {msYears.map((yr) => (
            <button
              key={yr}
              className={`ms-btn${activeMs === yr ? " active" : ""}`}
              onClick={() => setActiveMs(activeMs === yr ? null : yr)}
              aria-pressed={activeMs === yr}
            >
              {yr} yr
            </button>
          ))}
        </div>

        {/* milestone data snapshot */}
        {msPt && (
          <div className="ms-display" aria-live="polite">
            <div className="ms-display-title">Year {activeMs} snapshot</div>
            <div className="ms-display-row">
              {([
                ["Invested", formatINR(msPt.invested)],
                ["Corpus",   formatINR(msPt.corpus)],
                ["Gains",    formatINR(msPt.corpus - msPt.invested)],
              ] as [string, string][]).map(([lbl, val]) => (
                <div key={lbl} className="ms-stat">
                  <div>{lbl}</div><div>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chart-legend" aria-hidden="true">
          <span className="leg-item">
            <span className="leg-line" style={{ background: "var(--blue)" }} />Corpus
          </span>
          <span className="leg-item">
            <span className="leg-line" style={{ background: "var(--red)" }} />Invested
          </span>
        </div>

        <div className="chart-wrap">
          {!chartReady && (
            <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", paddingTop: 80 }}>
              Loading chart…
            </p>
          )}
          <canvas
            ref={chartRef}
            style={{ display: chartReady ? "block" : "none" }}
            aria-label="Corpus growth chart"
          />
        </div>
      </div>

      {/* ── INSIGHT ── */}
      <div className="insight-box">
        <p className="insight-title">Financial Insight</p>
        <p className="insight-text">
          Starting 5 years earlier would reduce your monthly SIP by ~{savingPct}% — from{" "}
          {formatINR(sipNow)} to {formatINR(sipEarly)}. Time in the market is your greatest wealth
          multiplier. Even a 1-year delay has a meaningful cost.
        </p>
      </div>

      {/* ── ASSUMPTIONS ── */}
      <div className="assump-box">
        <p className="assump-title">Assumptions Used in This Calculation</p>
        <table className="assump-table">
          <tbody>
            {([
              ["Goal",             `${goalEmoji} ${goalName}`],
              ["Current cost",     formatINR(inputs.currentCost)],
              ["Years to goal",    `${inputs.years} year${inputs.years > 1 ? "s" : ""}`],
              ["Expected return",  `${(inputs.annualReturn * 100).toFixed(1)}% p.a.`],
              ["Inflation rate",   `${(inputs.inflationRate * 100).toFixed(1)}% p.a.`],
              ["SIP step-up",      `${(inputs.annualStepUp * 100).toFixed(0)}%`],
              ["LTCG tax",         `${(inputs.taxRate * 100).toFixed(0)}%`],
              ["Formula",          "FV × r ÷ [((1+r)ⁿ−1)×(1+r)]"],
              ["Compounding",      "Monthly"],
              ["SIP type",         "Monthly, beginning of month"],
            ] as [string, string][]).map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mandatory disclaimer — verbatim as per HDFC FinCal hackathon compliance requirement */}
        <p className="disclaimer" role="note" aria-label="Mandatory investment disclaimer">
          <strong>Disclaimer: </strong>{DISCLAIMER}
        </p>
      </div>

      {/* ── DOWNLOAD ── */}
      <div className="dl-panel">
        <p className="dl-title">Your Plan Summary</p>
        <div className="dl-summary">
          <strong>{goalEmoji} {goalName}</strong><br />
          Monthly SIP: <strong>{formatINR(result.requiredMonthlySIP)}</strong> · Duration:{" "}
          <strong>{inputs.years} years</strong><br />
          Target (inflation-adjusted): <strong>{formatINR(result.inflatedGoalValue)}</strong><br />
          Total invested: <strong>{formatINR(result.totalAmountInvested)}</strong> · Gains:{" "}
          <strong>{formatINR(result.estimatedGains)}</strong>
        </div>
        <div className="dl-btns">
          <button className="btn btn-primary" onClick={handlePDF}>
            ⬇ Download Plan (PDF)
          </button>
          <button className="btn btn-secondary" onClick={onStartOver}>
            ↺ Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
