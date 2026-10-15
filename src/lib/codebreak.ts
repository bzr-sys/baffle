export const CODE_LENGTH = 4
export const MAX_TRIES = 8

/** Peg colors. The shapes tell them apart without color. */
export const PEGS = [
  { name: 'Red', color: '#FF6B6B', shape: '●' },
  { name: 'Blue', color: '#4D96FF', shape: '▲' },
  { name: 'Green', color: '#6BCB77', shape: '■' },
  { name: 'Yellow', color: '#FFD93D', shape: '◆' },
  { name: 'Purple', color: '#B983FF', shape: '★' },
  { name: 'Orange', color: '#FF9F45', shape: '✚' },
]

/** `exact`: right color, right place. `near`: right color, wrong place. */
export function feedback(code: number[], guess: number[]): { exact: number; near: number } {
  let exact = 0
  const codeLeft: number[] = []
  const guessLeft: number[] = []
  code.forEach((c, i) => {
    if (guess[i] === c) exact++
    else {
      codeLeft.push(c)
      guessLeft.push(guess[i]!)
    }
  })
  let near = 0
  for (const g of guessLeft) {
    const at = codeLeft.indexOf(g)
    if (at >= 0) {
      near++
      codeLeft.splice(at, 1)
    }
  }
  return { exact, near }
}

/** Feedback as emoji, for sharing without giving the code away */
export const feedbackRow = ({ exact, near }: { exact: number; near: number }) =>
  '🟢'.repeat(exact) + '🟡'.repeat(near) + '⬜'.repeat(CODE_LENGTH - exact - near)
