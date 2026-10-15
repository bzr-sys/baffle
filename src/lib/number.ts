export type Op = '+' | '−' | '×' | '÷'
export const OPS: Op[] = ['+', '−', '×', '÷']

/** Result of `a op b`, or null when it isn't a whole number above 0 */
export function applyOp(a: number, op: Op, b: number): number | null {
  if (op === '+') return a + b
  if (op === '×') return a * b
  if (op === '−') return a > b ? a - b : null
  return b > 0 && a % b === 0 ? a / b : null
}
