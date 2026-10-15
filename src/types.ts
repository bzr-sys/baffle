export type GameId =
  'crownwork' | 'gridpaint' | 'sunmoon' | 'path' | 'number' | 'pyramid' | 'hue' | 'ladder'

type Base = { n: number }

/** One letter per cell, one letter per color region */
export type CrownworkLevel = Base & { game: 'crownwork'; size: number; regions: string[] }
/** `#` is filled */
export type GridpaintLevel = Base & { game: 'gridpaint'; name: string; rows: string[] }
/** `S` sun, `M` moon, `.` for the player to fill */
export type SunMoonLevel = Base & { game: 'sunmoon'; givens: string[] }
/** Number per cell, 0 for none. The path runs from 1 to the highest number. */
export type PathLevel = Base & { game: 'path'; numbers: number[][] }
export type NumberLevel = Base & { game: 'number'; numbers: number[]; target: number }
/** Top row first. `null` is a block for the player to fill. */
export type PyramidLevel = Base & { game: 'pyramid'; rows: (number | null)[][] }
/** The middle tiles, shuffled, by their place in the gradient (ends are fixed) */
export type HueLevel = Base & { game: 'hue'; from: string; to: string; order: number[] }
/** `steps`: moves from `from` to `to`, one letter each; the player adds `steps - 1` words */
export type LadderLevel = Base & { game: 'ladder'; from: string; to: string; steps: number }

export type Level =
  | CrownworkLevel
  | GridpaintLevel
  | SunMoonLevel
  | PathLevel
  | NumberLevel
  | PyramidLevel
  | HueLevel
  | LadderLevel

/** A pack level in the app DB, readable once the pack is bought */
export type PackLevel = Level & { id: string; products: string[] }

/** A game's pack: how many levels, and each one's label (size or difficulty). Everyone can read it. */
export type GameDoc = { id: GameId; packCount: number; labels: string[] }

/** The pack product. Everyone can read it. */
/** The pack product. `sellerId`: the org selling it, if not the publishing admin */
export type PackDoc = { id: 'pack'; productId: string; priceCents: number; sellerId?: string }

/** A finished puzzle, in the player's own DB */
export type Solve = {
  id: string
  game: GameId | 'daily'
  n: number
  seconds: number
  solvedAt: string
  /** Daily only: YYYY-MM-DD */
  date?: string
  /** Daily only: guesses used, and whether the code stayed uncracked */
  tries?: number
  failed?: boolean
  /** Daily only: feedback per guess, for sharing */
  rows?: string[]
}
