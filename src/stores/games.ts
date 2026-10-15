import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { bzr } from '@/bazaar'
import type { GameDoc, GameId, Level, PackDoc, PackLevel, Solve } from '@/types'
import { GAMES } from '@/games'
import { isAppAdmin, loadPack, solves } from '@/lib/data'
import { dailyNumber, dayOfYear, streak, today } from '@/lib/daily'
import schedule from '@/levels/codebreak.json'

export const useGamesStore = defineStore('games', () => {
  const status = ref<'loading' | 'ready'>('loading')
  /** The pack product, once published */
  const pack = ref<PackDoc | null>(null)
  const packCounts = ref<GameDoc[]>([])
  /** Pack levels this player can read: all of them once bought */
  const packLevels = ref<PackLevel[]>([])
  const solveList = ref<Solve[]>([])
  const admin = ref(false)

  async function loadPackData() {
    try {
      const data = await loadPack()
      pack.value = data.pack
      packCounts.value = data.games
      packLevels.value = data.levels
    } catch {
      // Nothing published yet: the free levels still play
    }
  }

  async function load() {
    await loadPackData()
    solveList.value = await solves().getAll()
    admin.value = await isAppAdmin()
    status.value = 'ready'
  }

  const ownsPack = computed(() => packLevels.value.length > 0)
  const packCount = (game: GameId) => packCounts.value.find((g) => g.id === game)?.packCount ?? 0
  /** Labels of a game's pack levels, readable before buying */
  const packLabels = (game: GameId) => packCounts.value.find((g) => g.id === game)?.labels ?? []
  const packTotal = computed(() => packCounts.value.reduce((sum, g) => sum + g.packCount, 0))

  /** Every level of a game the player can open, free ones first */
  function levels(game: GameId): Level[] {
    const free = GAMES.find((g) => g.id === game)?.free ?? []
    const paid = packLevels.value.filter((l) => l.game === game)
    return [...free, ...paid].sort((a, b) => a.n - b.n)
  }

  function level(game: GameId, n: number): Level | undefined {
    return levels(game).find((l) => l.n === n)
  }

  /** Buy the pack in Bazaar's popup; its levels become readable */
  function buyPack() {
    if (pack.value == null) return
    bzr.monetization.purchases.openPopup({ productId: pack.value.productId }, () => {
      void loadPackData()
    })
  }

  const solved = computed(() => new Map(solveList.value.map((s) => [s.id, s])))
  const isSolved = (game: GameId, n: number) => solved.value.has(`${game}-${n}`)
  /** Levels play in order: each one opens once the one before is solved */
  const unlocked = (game: GameId, n: number) => n === 1 || isSolved(game, n - 1)
  const streakDays = computed(
    () =>
      new Set(solveList.value.filter((s) => s.game === 'daily' && !s.failed).map((s) => s.date!)),
  )
  const currentStreak = computed(() => streak(streakDays.value))

  /** Today's Codebreak, from the yearly schedule */
  const daily = computed(() => ({
    number: dailyNumber(),
    date: today(),
    code: schedule[dayOfYear()]!,
    solve: solved.value.get(`daily-${today()}`),
  }))

  /** Fastest time on a won puzzle, in seconds */
  const bestTime = (game: GameId, n: number) => solved.value.get(`${game}-${n}`)?.seconds

  /** Record a win. A replay only counts when it beats the best time. */
  async function recordSolve(solve: Omit<Solve, 'solvedAt'>) {
    const previous = solved.value.get(solve.id)
    if (previous) {
      if (solve.seconds >= previous.seconds) return
      solveList.value = solveList.value.map((s) =>
        s.id === solve.id ? { ...s, seconds: solve.seconds } : s,
      )
      await solves().updateOne(solve.id, { seconds: solve.seconds })
      return
    }
    const doc = { ...solve, solvedAt: new Date().toISOString() }
    // Count it at once, so the next level opens without waiting for the save
    solveList.value = [...solveList.value, doc]
    await solves().insertOne(doc)
  }

  return {
    status,
    pack,
    admin,
    load,
    loadPackData,
    ownsPack,
    packCount,
    packLabels,
    packTotal,
    levels,
    level,
    buyPack,
    solved,
    isSolved,
    bestTime,
    unlocked,
    currentStreak,
    daily,
    recordSolve,
  }
})
