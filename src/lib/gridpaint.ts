/** Cell marks while playing */
export type Paint = '' | 'fill' | 'x'

/** Lengths of the filled runs in a line */
export function runs(line: boolean[]): number[] {
  const out: number[] = []
  let run = 0
  for (const filled of line) {
    if (filled) run++
    else if (run > 0) {
      out.push(run)
      run = 0
    }
  }
  if (run > 0) out.push(run)
  return out
}

export function clues(rows: string[]) {
  const grid = rows.map((r) => [...r].map((ch) => ch === '#'))
  return {
    rows: grid.map(runs),
    cols: grid[0]!.map((_, c) => runs(grid.map((r) => r[c]!))),
  }
}

/** Every row and column matches its clue */
export function solved(rows: string[], paint: Paint[][]): boolean {
  const target = clues(rows)
  const filled = paint.map((r) => r.map((p) => p === 'fill'))
  const same = (a: number[], b: number[]) => a.join(',') === b.join(',')
  return (
    filled.every((r, i) => same(runs(r), target.rows[i]!)) &&
    filled[0]!.every((_, c) => same(runs(filled.map((r) => r[c]!)), target.cols[c]!))
  )
}

export const emptyPaint = (h: number, w: number): Paint[][] =>
  Array.from({ length: h }, () => Array<Paint>(w).fill(''))
