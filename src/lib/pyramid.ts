/** Top row first; row r has r + 1 blocks */
export type Pyramid = (number | null)[][]

/** Blocks whose value isn't the sum of the two below */
export function pyramidConflicts(values: Pyramid): Set<string> {
  const bad = new Set<string>()
  for (let r = 0; r + 1 < values.length; r++) {
    values[r]!.forEach((top, i) => {
      const left = values[r + 1]![i]
      const right = values[r + 1]![i + 1]
      if (top == null || left == null || right == null) return
      if (top !== left + right) {
        bad.add(`${r},${i}`)
        bad.add(`${r + 1},${i}`)
        bad.add(`${r + 1},${i + 1}`)
      }
    })
  }
  return bad
}

export function pyramidSolved(values: Pyramid): boolean {
  return values.every((row) => row.every((v) => v != null)) && pyramidConflicts(values).size === 0
}
