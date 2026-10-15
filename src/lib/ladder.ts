import { BUCKETS, OFFENSIVE } from './words'

const dictionary = new Set([...BUCKETS.flat(), ...OFFENSIVE])

export const isWord = (word: string) => dictionary.has(word.toLowerCase())

/** Same length, exactly one letter different */
export function oneLetterApart(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) if (a[i]!.toLowerCase() !== b[i]!.toLowerCase()) diff++
  return diff === 1
}

/** Why a rung doesn't fit, or null when it does */
export function rungProblem(word: string, above: string): string | null {
  if (word.length < 4) return null
  if (!isWord(word)) return 'Not in the word list'
  if (!oneLetterApart(word, above)) return 'Change exactly one letter'
  return null
}

/** Every rung a word, each one letter from the next, ending one letter from `to` */
export function ladderSolved(from: string, to: string, rungs: string[]): boolean {
  const chain = [from, ...rungs, to]
  return rungs.every(isWord) && chain.every((w, i) => i === 0 || oneLetterApart(chain[i - 1]!, w))
}
