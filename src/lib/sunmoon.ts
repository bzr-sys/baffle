/** Cell marks while playing */
export type SunMoon = '' | 'S' | 'M'

/** Cells breaking a rule: three alike side by side, or too many of one kind in a line */
export function sunMoonConflicts(grid: SunMoon[][]): Set<string> {
  const n = grid.length
  const bad = new Set<string>()
  const lines: [number, number][][] = []
  for (let i = 0; i < n; i++) {
    lines.push([...Array(n).keys()].map((j) => [i, j]))
    lines.push([...Array(n).keys()].map((j) => [j, i]))
  }
  for (const line of lines) {
    const at = ([r, c]: [number, number]) => grid[r]![c]!
    for (let k = 0; k + 2 < n; k++) {
      const three = line.slice(k, k + 3)
      const v = at(three[0]!)
      if (v !== '' && three.every((cell) => at(cell) === v)) {
        three.forEach(([r, c]) => bad.add(`${r},${c}`))
      }
    }
    for (const kind of ['S', 'M'] as const) {
      const cells = line.filter((cell) => at(cell) === kind)
      if (cells.length > n / 2) cells.forEach(([r, c]) => bad.add(`${r},${c}`))
    }
  }
  return bad
}

export function sunMoonSolved(grid: SunMoon[][]): boolean {
  return grid.every((row) => row.every((v) => v !== '')) && sunMoonConflicts(grid).size === 0
}

export const sunMoonFromGivens = (givens: string[]): SunMoon[][] =>
  givens.map((row) => [...row].map((ch) => (ch === '.' ? '' : (ch as SunMoon))))
