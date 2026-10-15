<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import GameIcon from '@/components/GameIcon.vue'
import PackCard from '@/components/PackCard.vue'
import { GAMES, levelLabel } from '@/games'
import { useGamesStore } from '@/stores/games'
import { longDate } from '@/lib/daily'

const games = useGamesStore()

/** Smallest to largest size (or difficulty), e.g. "5×5 to 8×8" */
function range(id: (typeof GAMES)[number]['id']) {
  const labels = [...games.levels(id).map(levelLabel), ...games.packLabels(id)]
  const distinct = [...new Set(labels)]
  if (distinct.length < 2) return distinct[0]
  const [lo, hi] = [distinct[0]!, distinct[distinct.length - 1]!]
  // "5 rows" and "6 rows" read as "5 to 6 rows"
  const unit = lo.split(' ')[1]
  return unit && hi.endsWith(` ${unit}`) ? `${lo.split(' ')[0]} to ${hi}` : `${lo} to ${hi}`
}

function cardLine(id: (typeof GAMES)[number]['id']) {
  const total = games.levels(id).length
  const locked = games.ownsPack ? 0 : games.packCount(id)
  return locked > 0 ? `${total} free · ${locked} in the pack` : `${total} puzzles`
}
</script>

<template>
  <AppHeader />

  <section class="card flex flex-col gap-2.5 p-4">
    <div class="flex items-center justify-between">
      <span class="text-[13px] font-extrabold uppercase tracking-wider">
        Today · {{ longDate() }}
      </span>
      <span class="tag bg-green">Free</span>
    </div>
    <div class="flex items-center gap-3">
      <GameIcon game="codebreak" />
      <h1 class="text-3xl font-extrabold leading-none">Codebreak #{{ games.daily.number }}</h1>
    </div>
    <p class="text-[15px] font-semibold">Crack today's 4-color code in 8 guesses.</p>
    <div v-if="games.daily.solve" class="mt-1.5 text-center text-lg font-extrabold">
      {{
        games.daily.solve.failed
          ? 'Not cracked today. Back tomorrow.'
          : `Cracked in ${games.daily.solve.tries}/8. Back tomorrow.`
      }}
    </div>
    <RouterLink v-else to="/daily" class="btn-ink mt-1.5">Play today's code</RouterLink>
  </section>

  <PackCard />

  <div class="grid grid-cols-2 gap-3.5">
    <RouterLink
      v-for="game in GAMES"
      :key="game.id"
      :to="`/play/${game.id}`"
      class="flex min-h-[130px] flex-col gap-1.5 rounded-[18px] border-[3px] border-ink p-3.5 shadow-hard"
      :class="game.color"
    >
      <GameIcon :game="game.id" />
      <span class="text-lg font-extrabold leading-tight min-[360px]:text-xl">{{ game.name }}</span>
      <span class="text-[13px] font-extrabold">{{ range(game.id) }}</span>
      <span class="text-[13px] font-semibold">{{ cardLine(game.id) }}</span>
    </RouterLink>
  </div>

  <footer class="mt-auto text-center text-[13px] font-semibold leading-snug">
    Your progress lives in your Bazaar account. Built on
    <a href="https://bzr.dev/" class="underline">Bazaar</a>.
  </footer>
</template>
