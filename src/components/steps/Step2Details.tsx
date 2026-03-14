"use client";
import SliderInput from "@/components/ui/SliderInput";
import { formatINR } from "@/lib/formatters";
import { calcRequiredSIP, inflateGoal } from "@/lib/finance";

interface Props {
  currentCost: number; years: number;
  annualReturn: number; inflationRate: number;
  onCostChange: (v: number) => void; onYearsChange: (v: number) => void;
  onBack: () => void; onNext: () => void;
}

export default function Step2Details({ currentCost, years, annualReturn, inflationRate, onCostChange, onYearsChange, onBack, onNext }: Props) {
  const costError =
    currentCost < 50000   ? "Minimum goal value is Rs.50,000." :
    currentCost > 20000000 ? "Maximum allowed is Rs.2 Crore." : "";
  const yearsWarn = years < 3 ? "A very short horizon may require an extremely high SIP." : "";
  const sipNow   = calcRequiredSIP(inflateGoal(currentCost, inflationRate, years),       annualReturn, years);
  const sipEarly = calcRequiredSIP(inflateGoal(currentCost, inflationRate, years + 5),   annualReturn, years + 5);
  const savingPct = sipNow > 0 ? Math.round((1 - sipEarly / sipNow) * 100) : 40;

  return (
    <div>
      <p className="breadcrumb">Goal › <strong>Investment Details</strong></p>
      <h1 className="page-title">Investment Details</h1>
      <p className="page-sub">Define the core parameters for your financial goal.</p>

      <div className="card">
        <p className="card-title">How much does your goal cost today?</p>
        <SliderInput id="cost" label="Current cost of goal"
          hint="How much would this goal cost if you paid for it today?"
          value={currentCost} min={50000} max={20000000} step={50000}
          displayValue={formatINR(currentCost)} numberLabel="Enter exact amount"
          ticks={[{ label: "Rs.50K" }, { label: "Rs.5L" }, { label: "Rs.50L" }, { label: "Rs.2Cr" }]}
          onChange={onCostChange} error={costError}
          eduNote={`Inflation impact: Rs.50L today could cost Rs.89.5L in 10 years at 6% inflation.`} />
      </div>

      <div className="card">
        <p className="card-title">When do you need this money?</p>
        <SliderInput id="years" label="Years until you need the money"
          hint="Number of years from today until you need to achieve this goal."
          value={years} min={1} max={40} step={1}
          displayValue={`${years} year${years > 1 ? "s" : ""}`} numberLabel="Enter years"
          ticks={[{ label: "1 yr" }, { label: "10 yr" }, { label: "20 yr" }, { label: "40 yr" }]}
          onChange={onYearsChange} warning={yearsWarn}
          eduNote={`Starting 5 years earlier could reduce your monthly SIP by ~${savingPct}%.`} />
      </div>

      <div className="nav-btns">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!!costError}>Next Step →</button>
      </div>
    </div>
  );
}
