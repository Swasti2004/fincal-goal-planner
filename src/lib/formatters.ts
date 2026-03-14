export function formatINR(n: number): string {
  if (n >= 10_000_000) return `Rs.${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `Rs.${(n / 100_000).toFixed(2)}L`;
  return `Rs.${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatINRShort(n: number): string {
  if (n >= 10_000_000) return `Rs.${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `Rs.${(n / 100_000).toFixed(1)}L`;
  return `Rs.${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
