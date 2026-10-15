/** Color of tile `i` of `count`, from `from` to `to` */
export function hueColor(from: string, to: string, i: number, count: number): string {
  const pct = Math.round((i / (count - 1)) * 100)
  return `color-mix(in oklab, ${to} ${pct}%, ${from})`
}

/** Every middle tile in its place */
export const hueSolved = (order: number[]) => order.every((v, i) => v === i + 1)
