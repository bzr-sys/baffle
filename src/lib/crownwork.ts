/** Cell marks while playing */
export type Mark = '' | 'x' | 'crown'

/** Region colors, by region letter A, B, … */
export const regionColors = [
  '#FF8C8C',
  '#6FA8FF',
  '#7ED88A',
  '#FFDF5E',
  '#C39BFF',
  '#FFAE63',
  '#6FE0D6',
  '#F79AD3',
]

export const regionColor = (letter: string) => regionColors[letter.charCodeAt(0) - 65]!

/** Crowns breaking a rule: same row, column or region, or touching */
export function conflicts(regions: string[], marks: Mark[][]): Set<string> {
  const crowns: [number, number][] = []
  marks.forEach((row, r) => row.forEach((m, c) => m === 'crown' && crowns.push([r, c])))
  const bad = new Set<string>()
  for (let i = 0; i < crowns.length; i++) {
    for (let j = i + 1; j < crowns.length; j++) {
      const [r1, c1] = crowns[i]!
      const [r2, c2] = crowns[j]!
      if (
        r1 === r2 ||
        c1 === c2 ||
        regions[r1]![c1] === regions[r2]![c2] ||
        (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1)
      ) {
        bad.add(`${r1},${c1}`)
        bad.add(`${r2},${c2}`)
      }
    }
  }
  return bad
}

/** One crown per row, column and region, none touching */
export function solved(regions: string[], marks: Mark[][]): boolean {
  const count = marks.flat().filter((m) => m === 'crown').length
  return count === regions.length && conflicts(regions, marks).size === 0
}

export const emptyMarks = (size: number): Mark[][] =>
  Array.from({ length: size }, () => Array<Mark>(size).fill(''))
