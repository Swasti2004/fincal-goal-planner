// src/components/ProgressHeader.tsx
"use client";
import React from "react";

const STEPS = [
  { n: 1, label: "Choose Your Goal",          pct: 25,  name: "Goal" },
  { n: 2, label: "Investment Details",         pct: 50,  name: "Details" },
  { n: 3, label: "Assumptions & Preferences", pct: 75,  name: "Assumptions" },
  { n: 4, label: "Your Investment Plan",       pct: 100, name: "Your Plan" },
];

interface Props { currentStep: number; }

export default function ProgressHeader({ currentStep }: Props) {
  const meta = STEPS[currentStep - 1];
  return (
    <nav className="progress-header" aria-label="Calculator step progress">
      <div className="ph-meta">
        <span className="ph-label" aria-live="polite" aria-atomic="true">
          Step {currentStep} of 4 &mdash; {meta.label}
        </span>
        <span className="ph-pct" aria-hidden="true">{meta.pct}% complete</span>
      </div>

      {/* WCAG: role=progressbar with aria-valuenow/min/max */}
      <div
        className="ph-track"
        role="progressbar"
        aria-valuenow={meta.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${meta.pct}% complete`}
      >
        <div className="ph-fill" style={{ width: `${meta.pct}%` }} />
      </div>

      {/* WCAG: ol for ordered list of steps */}
      <ol className="ph-steps" aria-label="Steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.n}>
            <li className="ph-dot-wrap">
              <div
                className={`ph-dot${s.n < currentStep ? " done" : s.n === currentStep ? " active" : ""}`}
                aria-current={s.n === currentStep ? "step" : undefined}
                aria-label={`Step ${s.n}: ${s.label}${s.n < currentStep ? " (completed)" : s.n === currentStep ? " (current)" : ""}`}
              >
                {s.n < currentStep ? "✓" : s.n}
              </div>
              <span className="ph-dot-name" aria-hidden="true">{s.name}</span>
            </li>
            {i < STEPS.length - 1 && (
              <li className="ph-line" aria-hidden="true">
                <div className={`ph-line-inner${s.n < currentStep ? " done" : ""}`} />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
