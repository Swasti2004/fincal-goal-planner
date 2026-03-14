"use client";
import { useState } from "react";
import SliderInput from "@/components/ui/SliderInput";

interface Props {
  annualReturn: number; inflationRate: number;
  annualStepUp: number; taxRate: number;
  onReturnChange: (v: number) => void; onInflationChange: (v: number) => void;
  onStepUpChange: (v: number) => void; onTaxChange: (v: number) => void;
  onBack: () => void; onNext: () => void;
}

export default function Step3Assumptions({ annualReturn, inflationRate, annualStepUp, taxRate, onReturnChange, onInflationChange, onStepUpChange, onTaxChange, onBack, onNext }: Props) {
  const [advOpen, setAdvOpen] = useState(false);
  const retWarn  = annualReturn > 0.15 ? "Returns above 15% are highly optimistic. Most diversified equity funds average 10-14% over long periods." : "";
  const stepWarn = annualStepUp > 0.15 ? "A step-up above 15% p.a. may be difficult to sustain long-term." : "";

  return (
    <div>
      <p className="breadcrumb">Goal › Details › <strong>Assumptions</strong></p>
      <h1 className="page-title">Assumptions & Preferences</h1>
      <p className="page-sub">All values are <strong>editable</strong> — illustrative only, not a guarantee of future returns.</p>

      <div className="card">
        <p className="card-title">Return assumption</p>
        <SliderInput id="ret" label="Expected annual return"
          hint="The annual rate of return you expect from your investments."
          value={annualReturn * 100} min={4} max={20} step={0.5}
          displayValue={`${(annualReturn * 100).toFixed(1)}%`} numberLabel="Enter %"
          ticks={[{ label: "4%" }, { label: "12%" }, { label: "20%" }]}
          onChange={(v) => onReturnChange(v / 100)} warning={retWarn}
          eduNote="Real return = Return minus Inflation. 12% return with 6% inflation gives ~6% real growth." />
      </div>

      <div className="card">
        <p className="card-title">Inflation assumption</p>
        <SliderInput id="infl" label="Annual inflation rate (goal-specific)"
          hint="How much your goal cost may increase each year. Education and medical can be higher than CPI."
          value={inflationRate * 100} min={1} max={15} step={0.5}
          displayValue={`${(inflationRate * 100).toFixed(1)}%`} numberLabel="Enter %"
          ticks={[{ label: "1%" }, { label: "6% (CPI)" }, { label: "15%" }]}
          onChange={(v) => onInflationChange(v / 100)} />

        <button className="adv-toggle" onClick={() => setAdvOpen(!advOpen)}
          aria-expanded={advOpen} aria-controls="adv-opts">
          <span className="adv-label">Advanced: Step-up SIP & Tax</span>
          <span className={`adv-arrow${advOpen ? " open" : ""}`} aria-hidden="true">▼</span>
        </button>

        {advOpen && (
          <div id="adv-opts" className="adv-body">
            <SliderInput id="step" label="Annual SIP step-up"
              hint="Increase your SIP each year as your income grows. A step-up means a much lower starting SIP."
              value={annualStepUp * 100} min={0} max={25} step={1}
              displayValue={`${(annualStepUp * 100).toFixed(0)}%`} numberLabel="Enter %"
              onChange={(v) => onStepUpChange(v / 100)} warning={stepWarn} />
            <SliderInput id="tax" label="LTCG tax on gains"
              hint="Long-term capital gains tax on returns. Actual tax treatment depends on fund type and holding period."
              value={taxRate * 100} min={0} max={30} step={1}
              displayValue={`${(taxRate * 100).toFixed(0)}%`} numberLabel="Enter %"
              onChange={(v) => onTaxChange(v / 100)} />
          </div>
        )}
      </div>

      <div className="nav-btns">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>See My Plan →</button>
      </div>
    </div>
  );
}
