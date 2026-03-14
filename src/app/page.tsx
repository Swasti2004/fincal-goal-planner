"use client";
// src/app/page.tsx
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressHeader from "@/components/ProgressHeader";
import Step1Goal from "@/components/steps/Step1Goal";
import Step2Details from "@/components/steps/Step2Details";
import Step3Assumptions from "@/components/steps/Step3Assumptions";
import Step4Results from "@/components/steps/Step4Results";
import { calculate, CalcInputs } from "@/lib/finance";

// ── Default state ────────────────────────────────────────────────────────────
const DEFAULT_INPUTS: CalcInputs = {
  currentCost:  5_000_000,
  years:        10,
  annualReturn: 0.12,
  inflationRate: 0.06,
  annualStepUp: 0,
  taxRate:      0,
};

interface GoalState {
  id:          string;
  emoji:       string;
  name:        string;
  customName:  string;
  customEmoji: string;
}

const DEFAULT_GOAL: GoalState = {
  id: "", emoji: "", name: "", customName: "", customEmoji: "⭐",
};

export default function Home() {
  const [step,   setStep]   = useState(1);
  const [goal,   setGoal]   = useState<GoalState>(DEFAULT_GOAL);
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_INPUTS);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goTo = useCallback((n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Goal handlers ────────────────────────────────────────────────────────────
  const handleGoalSelect = useCallback((id: string, emoji: string, name: string) => {
    setGoal(prev => ({ ...prev, id, emoji, name }));
  }, []);

  const handleCustomName = useCallback((name: string) => {
    setGoal(prev => ({
      ...prev,
      customName: name,
      name: name || "My Goal",
      emoji: prev.customEmoji,
    }));
  }, []);

  const handleCustomEmoji = useCallback((emoji: string) => {
    setGoal(prev => ({ ...prev, customEmoji: emoji, emoji }));
  }, []);

  // ── Input handlers ───────────────────────────────────────────────────────────
  const set = useCallback(
    <K extends keyof CalcInputs>(key: K) =>
      (value: CalcInputs[K]) => setInputs(prev => ({ ...prev, [key]: value })),
    []
  );

  // ── Start over ───────────────────────────────────────────────────────────────
  const handleStartOver = useCallback(() => {
    setGoal(DEFAULT_GOAL);
    setInputs(DEFAULT_INPUTS);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Computed result (only needed on step 4) ──────────────────────────────────
  const result = step === 4 ? calculate(inputs) : null;

  // ── Resolve display name / emoji ─────────────────────────────────────────────
  const displayEmoji = goal.id === "custom" ? goal.customEmoji : goal.emoji;
  const displayName  = goal.id === "custom" ? (goal.customName || "My Goal") : goal.name;

  return (
    <>
      <Navbar />
      <ProgressHeader currentStep={step} />

      <main id="main-content">
        <div className="page-content">

          {step === 1 && (
            <Step1Goal
              selectedGoalId={goal.id}
              customName={goal.customName}
              customEmoji={goal.customEmoji}
              onSelect={handleGoalSelect}
              onCustomNameChange={handleCustomName}
              onCustomEmojiChange={handleCustomEmoji}
              onNext={() => goTo(2)}
            />
          )}

          {step === 2 && (
            <Step2Details
              currentCost={inputs.currentCost}
              years={inputs.years}
              annualReturn={inputs.annualReturn}
              inflationRate={inputs.inflationRate}
              onCostChange={set("currentCost")}
              onYearsChange={set("years")}
              onBack={() => goTo(1)}
              onNext={() => goTo(3)}
            />
          )}

          {step === 3 && (
            <Step3Assumptions
              annualReturn={inputs.annualReturn}
              inflationRate={inputs.inflationRate}
              annualStepUp={inputs.annualStepUp}
              taxRate={inputs.taxRate}
              onReturnChange={set("annualReturn")}
              onInflationChange={set("inflationRate")}
              onStepUpChange={set("annualStepUp")}
              onTaxChange={set("taxRate")}
              onBack={() => goTo(2)}
              onNext={() => goTo(4)}
            />
          )}

          {step === 4 && result && (
            <Step4Results
              goalEmoji={displayEmoji}
              goalName={displayName}
              inputs={inputs}
              result={result}
              onStartOver={handleStartOver}
            />
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
