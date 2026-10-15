<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import CrownIcon from '@/components/CrownIcon.vue'
import HowToPlay from '@/components/HowToPlay.vue'
import LockIcon from '@/components/LockIcon.vue'
import MiniPicture from '@/components/MiniPicture.vue'
import PackCard from '@/components/PackCard.vue'
import { gameInfo, levelLabel } from '@/games'
import { useGamesStore } from '@/stores/games'
import { formatTime } from '@/lib/daily'
import type { Level } from '@/types'

const route = useRoute()
const games = useGamesStore()
const game = computed(() => gameInfo(String(route.params.game)))

type Tile = {
  n: number
  label: string
  level?: Level
  /** `solved`, `next` to play, `waiting` on the level before, or `pack` (not bought) */
  state: 'solved' | 'next' | 'waiting' | 'pack'
  /** Best time, once solved */
  best?: string
}

const tiles = computed((): Tile[] => {
  const g = game.value
  if (g == null) return []
  const open = games.levels(g.id)
  const packLabels = games.packLabels(g.id)
  const count = Math.max(g.free.length + packLabels.length, open.length)
  return Array.from({ length: count }, (_, i): Tile => {
    const n = i + 1
    const level = open.find((l) => l.n === n)
    const label = level ? levelLabel(level) : (packLabels[n - g.free.length - 1] ?? '')
    if (level == null) return { n, label, state: 'pack' }
    const best = games.bestTime(g.id, n)
    if (best != null) return { n, label, level, state: 'solved', best: formatTime(best) }
    return { n, label, level, state: games.unlocked(g.id, n) ? 'next' : 'waiting' }
  })
})

/** Solved Gridpaint pictures cycle through these */
const FILLS = ['#FF6B6B', '#4D96FF', '#6BCB77', '#B983FF', '#FF9F45']

const box =
  'flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl border-[3px] border-ink shadow-hard-sm'
</script>

<template>
  <AppHeader :back="{ to: '/', label: 'Games' }" />
  <template v-if="game">
    <section class="flex flex-col gap-1.5">
      <h1 class="text-[34px] font-extrabold leading-none">{{ game.name }}</h1>
      <p class="text-[15px] font-semibold">{{ game.blurb }}</p>
      <div><HowToPlay :game="game.id" /></div>
    </section>

    <PackCard />

    <div class="grid grid-cols-4 gap-2.5">
      <template v-for="tile in tiles" :key="tile.n">
        <RouterLink
          v-if="tile.state === 'solved' || tile.state === 'next'"
          :to="`/play/${game.id}/${tile.n}`"
          :class="[
            box,
            tile.state === 'next'
              ? 'bg-white ring-4 ring-ink/80'
              : tile.level?.game === 'gridpaint'
                ? 'bg-white'
                : game.color,
          ]"
          :aria-label="`${game.name} ${tile.n}, ${tile.label}${tile.state === 'solved' ? `, solved, best ${tile.best}` : ', play next'}`"
        >
          <!-- Solved: the number and best time; Gridpaint shows the picture in color on white,
            Crownwork a crown -->
          <template v-if="tile.state === 'solved'">
            <MiniPicture
              v-if="tile.level?.game === 'gridpaint'"
              :rows="tile.level.rows"
              :color="FILLS[(tile.n - 1) % FILLS.length]!"
              class="!h-10 !w-10"
            />
            <CrownIcon v-else-if="game.id === 'crownwork'" :size="18" />
            <span class="text-lg font-extrabold leading-none">{{ tile.n }}</span>
            <span class="text-[11px] font-extrabold leading-none">{{ tile.best }}</span>
          </template>
          <template v-else>
            <span class="text-xl font-extrabold leading-none">{{ tile.n }}</span>
            <span class="text-[11px] font-extrabold leading-none">{{ tile.label }}</span>
          </template>
        </RouterLink>
        <div
          v-else
          :class="[box, tile.state === 'pack' ? 'bg-locked' : 'bg-white opacity-60']"
          :aria-label="
            tile.state === 'pack'
              ? `${game.name} ${tile.n}, ${tile.label}, in the pack`
              : `${game.name} ${tile.n}, ${tile.label}, solve ${tile.n - 1} first`
          "
        >
          <LockIcon :size="20" />
          <span class="text-[11px] font-extrabold leading-none">{{ tile.label }}</span>
        </div>
      </template>
    </div>
  </template>
  <p v-else class="card p-4 font-semibold">This game doesn't exist.</p>
</template>
