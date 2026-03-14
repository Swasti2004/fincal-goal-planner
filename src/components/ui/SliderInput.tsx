"use client";

interface Tick { label: string; }
interface Props {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  numberLabel: string;
  ticks?: Tick[];
  onChange: (v: number) => void;
  error?: string;
  warning?: string;
  eduNote?: string;
}

export default function SliderInput({
  id, label, hint, value, min, max, step,
  displayValue, numberLabel, ticks, onChange, error, warning, eduNote,
}: Props) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="sl-group">
      <div className="sl-top">
        <label htmlFor={`${id}-range`} className="sl-label">{label}</label>
        <span className="sl-val" aria-live="polite">{displayValue}</span>
      </div>
      {hint && <p className="sl-hint">{hint}</p>}
      <input type="range" id={`${id}-range`} min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value)))}
        aria-label={label} aria-valuetext={displayValue} />
      {ticks && (
        <div className="sl-ticks" aria-hidden="true">
          {ticks.map((t) => <span key={t.label} className="sl-tick">{t.label}</span>)}
        </div>
      )}
      <div className="sl-num-row">
        <label htmlFor={`${id}-num`} className="sl-num-lbl">{numberLabel}</label>
        <input type="number" id={`${id}-num`} className="sl-ni"
          value={value} min={min} max={max} step={step}
          onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(clamp(v)); }}
          aria-label={`${label} exact value`} />
      </div>
      {error   && <p className="sl-error" role="alert">{error}</p>}
      {warning && <p className="sl-warn"  role="alert">{warning}</p>}
      {eduNote && <div className="sl-edu"><p>{eduNote}</p></div>}
    </div>
  );
}
