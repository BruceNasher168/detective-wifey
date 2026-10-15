/** Remaining strikes are persisted using the existing suspicionStrikes field. */
export function applyStrike(remaining: number): number {
  return Math.max(0, remaining - 1);
}
