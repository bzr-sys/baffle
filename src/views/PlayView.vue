<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import CrownworkBoard from '@/components/CrownworkBoard.vue'
import GridpaintPlay from '@/components/GridpaintPlay.vue'
import HowToPlay from '@/components/HowToPlay.vue'
import HueBoard from '@/components/HueBoard.vue'
import LadderBoard from '@/components/LadderBoard.vue'
import MiniPicture from '@/components/MiniPicture.vue'
import NumberBoard from '@/components/NumberBoard.vue'
import PackCard from '@/components/PackCard.vue'
import PathBoard from '@/components/PathBoard.vue'
import PyramidBoard from '@/components/PyramidBoard.vue'
import SolvedCard from '@/components/SolvedCard.vue'
import SunMoonBoard from '@/components/SunMoonBoard.vue'
import { gameInfo } from '@/games'
import { useGamesStore } from '@/stores/games'
import { useTimer } from '@/composables/timer'
import { formatTime } from '@/lib/daily'

const route = useRoute()
const games = useGamesStore()
const { seconds, stop, restart } = useTimer()

const game = computed(() => gameInfo(String(route.params.game)))
const level = computed(() =>
  game.value ? games.level(game.value.id, Number(route.params.n)) : undefined,
)
const title = computed(() => `${game.value?.name} #${level.value?.n}`)
/** Levels play in order */
const open = computed(
  () => game.value != null && games.unlocked(game.value.id, Number(route.params.n)),
)
/** The first level still to solve, for a level opened too early */
const firstUnsolved = computed(() => {
  const g = game.value
  return g ? games.levels(g.id).find((l) => !games.isSolved(g.id, l.n))?.n : undefined
})
const next = computed(() =>
  game.value && level.value ? games.level(game.value.id, level.value.n + 1) : undefined,
)
const done = ref(false)
/** Fastest earlier win on this level, to beat */
const best = computed(() =>
  game.value && level.value ? games.bestTime(game.value.id, level.value.n) : undefined,
)
/** `best` as it was before this win */
const bestBefore = ref<number>()

watch(level, () => {
  done.value = false
  restart()
})

async function onSolved() {
  bestBefore.value = best.value
  done.value = true
  stop()
  if (level.value == null) return
  await games.recordSolve({
    id: `${level.value.game}-${level.value.n}`,
    game: level.value.game,
    n: level.value.n,
    seconds: seconds.value,
  })
}

const solvedTitle = computed(() =>
  level.value?.game === 'gridpaint' ? `${level.value.name} painted` : `${title.value} solved`,
)
const detail = computed(() => {
  const time = `Solved in ${formatTime(seconds.value)}`
  if (bestBefore.value == null) return time
  return seconds.value < bestBefore.value
    ? `${time}. New best, was ${formatTime(bestBefore.value)}!`
    : `${time}. Best is ${formatTime(bestBefore.value)}.`
})
const share = computed(() => `Baffle · ${title.value} · solved in ${formatTime(seconds.value)}`)
</script>

<template>
  <AppHeader :back="{ to: `/play/${game?.id}`, label: game?.name ?? 'Games' }" />
  <section v-if="game && level && !open" class="card flex flex-col gap-3 p-4">
    <h1 class="text-2xl font-extrabold">{{ title }} is locked</h1>
    <p class="font-semibold">Puzzles open in order. Solve #{{ level.n - 1 }} first.</p>
    <RouterLink v-if="firstUnsolved" :to="`/play/${game.id}/${firstUnsolved}`" class="btn-ink">
      Play #{{ firstUnsolved }}
    </RouterLink>
  </section>
  <template v-else-if="game && level">
    <section class="flex items-end justify-between gap-2">
      <div class="flex flex-col gap-1.5">
        <h1 class="text-3xl font-extrabold leading-none">
          {{ done && level.game === 'gridpaint' ? level.name : title }}
        </h1>
        <span v-if="best != null && !done" class="text-sm font-extrabold" aria-label="Best time">
          Best {{ formatTime(best) }}. Beat it!
        </span>
      </div>
      <div class="flex shrink-0 gap-2">
        <HowToPlay :game="game.id" auto compact @close="(first) => first && !done && restart()" />
        <span class="pill" aria-label="Time">{{ formatTime(seconds) }}</span>
      </div>
    </section>

    <div :key="`${level.game}-${level.n}`" class="flex flex-col gap-4">
      <CrownworkBoard
        v-if="level.game === 'crownwork'"
        :regions="level.regions"
        :locked="done"
        @solved="onSolved"
      />
      <GridpaintPlay
        v-else-if="level.game === 'gridpaint'"
        :rows="level.rows"
        :locked="done"
        @solved="onSolved"
      />
      <SunMoonBoard
        v-else-if="level.game === 'sunmoon'"
        :givens="level.givens"
        :locked="done"
        @solved="onSolved"
      />
      <PathBoard
        v-else-if="level.game === 'path'"
        :numbers="level.numbers"
        :locked="done"
        @solved="onSolved"
      />
      <NumberBoard
        v-else-if="level.game === 'number'"
        :numbers="level.numbers"
        :target="level.target"
        :locked="done"
        @solved="onSolved"
      />
      <PyramidBoard
        v-else-if="level.game === 'pyramid'"
        :rows="level.rows"
        :locked="done"
        @solved="onSolved"
      />
      <HueBoard
        v-else-if="level.game === 'hue'"
        :from="level.from"
        :to="level.to"
        :order="level.order"
        :locked="done"
        @solved="onSolved"
      />
      <LadderBoard
        v-else-if="level.game === 'ladder'"
        :from="level.from"
        :to="level.to"
        :steps="level.steps"
        :locked="done"
        @solved="onSolved"
      />
    </div>

    <p v-if="!done" class="text-center text-sm font-semibold">{{ game.hint }}</p>
    <template v-else>
      <div v-if="level.game === 'gridpaint'" class="card flex items-center gap-4 self-center p-3">
        <MiniPicture :rows="level.rows" color="#FF6B6B" />
        <span class="text-xl font-extrabold">{{ level.name }}</span>
      </div>
      <SolvedCard :title="solvedTitle" :detail="detail" :share="share" />
      <RouterLink v-if="next" :to="`/play/${game.id}/${next.n}`" class="btn-ink">
        Next: #{{ next.n }}
      </RouterLink>
      <PackCard v-else />
    </template>
  </template>
  <p v-else class="card p-4 font-semibold">This puzzle is in the pack or doesn't exist.</p>
</template>
