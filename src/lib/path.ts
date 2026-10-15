/** Row, column */
export type Cell = [number, number]

const same = (a: Cell, b: Cell) => a[0] === b[0] && a[1] === b[1]
export const adjacent = (a: Cell, b: Cell) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1

/** The number the path must reach next */
export function nextNumber(numbers: number[][], path: Cell[]): number {
  return Math.max(0, ...path.map(([r, c]) => numbers[r]![c]!)) + 1
}

/** Whether `cell` can be the path's next step */
export function canExtend(numbers: number[][], path: Cell[], cell: Cell): boolean {
  const last = path[path.length - 1]
  if (last == null || !adjacent(last, cell) || path.some((p) => same(p, cell))) return false
  const k = numbers[cell[0]]![cell[1]]!
  return k === 0 || k === nextNumber(numbers, path)
}

export const startCell = (numbers: number[][]): Cell => {
  const r = numbers.findIndex((row) => row.includes(1))
  return [r, numbers[r]!.indexOf(1)]
}

/** Every cell once, numbers in order, ending on the highest */
export function pathSolved(numbers: number[][], path: Cell[]): boolean {
  const n = numbers.length
  const highest = Math.max(...numbers.flat())
  if (path.length !== n * n) return false
  const last = path[path.length - 1]!
  return nextNumber(numbers, path) === highest + 1 && numbers[last[0]]![last[1]] === highest
}
