// finance.ts — HDFC FinCal hackathon spec, industry-standard SIP math

export interface CalcInputs {
  currentCost: number;
  years: number;
  annualReturn: number;
  inflationRate: number;
  annualStepUp: number;
  taxRate: number;
}

export interface CalcResult {
  inflatedGoalValue: number;
  requiredMonthlySIP: number;
  totalAmountInvested: number;
  estimatedGains: number;
  afterTaxCorpus: number;
  wealthMultiple: number;
  yearlyBreakdown: YearlyPoint[];
  investedPct: number;
  gainsPct: number;
}

export interface YearlyPoint {
  year: number;
  invested: number;
  corpus: number;
}

export type ScenarioKey = "conservative" | "balanced" | "aggressive";

export interface Scenario {
  key: ScenarioKey;
  label: string;
  ret: number;
  desc: string;
}

export const SCENARIOS: Scenario[] = [
  { key: "conservative", label: "Conservative", ret: 0.08, desc: "8% annual return — lower risk, more stable" },
  { key: "balanced",     label: "Balanced",     ret: 0.12, desc: "12% annual return — moderate risk, typical equity" },
  { key: "aggressive",  label: "Aggressive",   ret: 0.15, desc: "15% annual return — higher risk, long-term equity" },
];

// Step 1: FV = PV × (1 + inflation)^years
export function inflateGoal(presentCost: number, inflationRate: number, years: number): number {
  return presentCost * Math.pow(1 + inflationRate, years);
}

// Step 2: SIP = FV × r ÷ [((1+r)^n − 1) × (1+r)]
export function calcRequiredSIP(futureValue: number, annualReturn: number, years: number): number {
  const r = annualReturn / 12;
  const n = years * 12;
  if (r === 0) return futureValue / n;
  return (futureValue * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
}

export function calcRequiredStepUpSIP(
  futureValue: number, annualReturn: number, years: number, annualStepUp: number
): number {
  let lo = 1, hi = futureValue, mid = 0;
  for (let i = 0; i < 80; i++) {
    mid = (lo + hi) / 2;
    simulateStepUpCorpus(mid, annualReturn / 12, years, annualStepUp) < futureValue
      ? (lo = mid) : (hi = mid);
  }
  return mid;
}

export function simulateStepUpCorpus(
  baseSIP: number, monthlyRate: number, years: number, annualStepUp: number
): number {
  let corpus = 0, sip = baseSIP;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) corpus = (corpus + sip) * (1 + monthlyRate);
    sip *= (1 + annualStepUp);
  }
  return corpus;
}

export function calcStepUpTotalInvested(baseSIP: number, years: number, annualStepUp: number): number {
  let total = 0, sip = baseSIP;
  for (let y = 0; y < years; y++) { total += sip * 12; sip *= (1 + annualStepUp); }
  return total;
}

export function buildYearlyBreakdown(
  baseSIP: number, annualReturn: number, years: number, annualStepUp: number
): YearlyPoint[] {
  const r = annualReturn / 12;
  if (annualStepUp === 0) {
    return Array.from({ length: years }, (_, i) => {
      const n = (i + 1) * 12;
      return {
        year: i + 1,
        invested: Math.round(baseSIP * n),
        corpus: Math.round(baseSIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)),
      };
    });
  }
  let corpus = 0, sip = baseSIP, totalInvested = 0;
  return Array.from({ length: years }, (_, i) => {
    for (let m = 0; m < 12; m++) corpus = (corpus + sip) * (1 + r);
    totalInvested += sip * 12;
    sip *= (1 + annualStepUp);
    return { year: i + 1, invested: Math.round(totalInvested), corpus: Math.round(corpus) };
  });
}

export function calculate(inputs: CalcInputs): CalcResult {
  const { currentCost, years, annualReturn, inflationRate, annualStepUp, taxRate } = inputs;
  const inflatedGoalValue = inflateGoal(currentCost, inflationRate, years);
  const requiredMonthlySIP = annualStepUp === 0
    ? calcRequiredSIP(inflatedGoalValue, annualReturn, years)
    : calcRequiredStepUpSIP(inflatedGoalValue, annualReturn, years, annualStepUp);
  const totalAmountInvested = annualStepUp === 0
    ? requiredMonthlySIP * years * 12
    : calcStepUpTotalInvested(requiredMonthlySIP, years, annualStepUp);
  const estimatedGains = inflatedGoalValue - totalAmountInvested;
  const taxOnGains = Math.max(0, estimatedGains * taxRate);
  const afterTaxCorpus = inflatedGoalValue - taxOnGains;
  const wealthMultiple = totalAmountInvested > 0 ? inflatedGoalValue / totalAmountInvested : 1;
  const yearlyBreakdown = buildYearlyBreakdown(requiredMonthlySIP, annualReturn, years, annualStepUp);
  const investedPct = Math.round((totalAmountInvested / inflatedGoalValue) * 100);
  return {
    inflatedGoalValue, requiredMonthlySIP, totalAmountInvested,
    estimatedGains, afterTaxCorpus, wealthMultiple, yearlyBreakdown,
    investedPct, gainsPct: 100 - investedPct,
  };
}

export function calculateScenarios(inputs: CalcInputs) {
  return {
    conservative: calculate({ ...inputs, annualReturn: 0.08 }),
    balanced:     calculate({ ...inputs, annualReturn: 0.12 }),
    aggressive:   calculate({ ...inputs, annualReturn: 0.15 }),
  };
}
