import type {
  CrownworkLevel,
  GameId,
  GridpaintLevel,
  HueLevel,
  LadderLevel,
  Level,
  NumberLevel,
  PathLevel,
  PyramidLevel,
  SunMoonLevel,
} from '@/types'
import crownwork from '@/levels/crownwork.json'
import gridpaint from '@/levels/gridpaint.json'
import hue from '@/levels/hue.json'
import ladder from '@/levels/ladder.json'
import number from '@/levels/number.json'
import path from '@/levels/path.json'
import pyramid from '@/levels/pyramid.json'
import sunmoon from '@/levels/sunmoon.json'

export type GameInfo = {
  id: GameId
  name: string
  /** One line on the game's page */
  blurb: string
  /** Under the board while playing */
  hint: string
  /** Card color class */
  color: string
  /** The free levels, part of the site */
  free: Level[]
}

export const GAMES: GameInfo[] = [
  {
    id: 'crownwork',
    name: 'Crownwork',
    blurb: 'One crown in every row, column and color. Crowns never touch.',
    hint: 'Tap once to mark a cell empty, twice for a crown.',
    color: 'bg-blue',
    free: crownwork as CrownworkLevel[],
  },
  {
    id: 'gridpaint',
    name: 'Gridpaint',
    blurb: 'Fill the grid from the numbers to reveal a picture.',
    hint: 'Each number is a run of filled cells, in order.',
    color: 'bg-red',
    free: gridpaint as GridpaintLevel[],
  },
  {
    id: 'sunmoon',
    name: 'Sun & Moon',
    blurb: 'Half suns, half moons in every line. Never three alike in a row.',
    hint: 'Tap once for a sun, twice for a moon.',
    color: 'bg-yellow',
    free: sunmoon as SunMoonLevel[],
  },
  {
    id: 'path',
    name: 'Path',
    blurb: 'One line through every cell, passing the numbers in order.',
    hint: 'Drag from 1. Drag back to undo.',
    color: 'bg-green',
    free: path as PathLevel[],
  },
  {
    id: 'number',
    name: 'Make the number',
    blurb: 'Reach the target with + − × ÷. Every puzzle takes four steps.',
    hint: 'Tap a number, an operation, then another number.',
    color: 'bg-purple',
    free: number as NumberLevel[],
  },
  {
    id: 'pyramid',
    name: 'Sum pyramid',
    blurb: 'Every block is the sum of the two below it.',
    hint: 'Fill the empty blocks.',
    color: 'bg-orange',
    free: pyramid as PyramidLevel[],
  },
  {
    id: 'hue',
    name: 'Hue line',
    blurb: 'Swap tiles until the colors flow from one end to the other.',
    hint: 'Tap two tiles to swap them. The ends stay put.',
    color: 'bg-teal',
    free: hue as HueLevel[],
  },
  {
    id: 'ladder',
    name: 'Word ladder',
    blurb: 'Climb from one word to another, one letter at a time.',
    hint: 'Each word changes one letter of the word above.',
    color: 'bg-pink',
    free: ladder as LadderLevel[],
  },
]

export const gameInfo = (id: string): GameInfo | undefined => GAMES.find((g) => g.id === id)

/** Size or difficulty, shown on the level's tile */
export function levelLabel(level: Level): string {
  switch (level.game) {
    case 'crownwork':
      return `${level.size}×${level.size}`
    case 'gridpaint':
      return `${level.rows[0]!.length}×${level.rows.length}`
    case 'sunmoon':
      return `${level.givens.length}×${level.givens.length}`
    case 'path':
      return `${level.numbers.length}×${level.numbers.length}`
    case 'number':
      // Every puzzle takes exactly four steps
      return '4 steps'
    case 'pyramid':
      return `${level.rows.length} rows`
    case 'hue':
      return `${level.order.length + 2} tiles`
    case 'ladder':
      return `${level.steps} steps`
  }
}
