<script setup lang="ts">
import { computed, ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import CodebreakBoard from '@/components/CodebreakBoard.vue'
import HowToPlay from '@/components/HowToPlay.vue'
import SolvedCard from '@/components/SolvedCard.vue'
import { useGamesStore } from '@/stores/games'
import { useTimer } from '@/composables/timer'
import { CODE_LENGTH, feedback, feedbackRow, MAX_TRIES } from '@/lib/codebreak'
import { formatTime, longDate } from '@/lib/daily'

const games = useGamesStore()
const { seconds, stop, restart } = useTimer()
const daily = games.daily
const title = `Codebreak #${daily.number}`
const result = ref(daily.solve)
if (result.value) stop()

async function onDone(guesses: number[][]) {
  stop()
  const rows = guesses.map((g) => feedbackRow(feedback(daily.code, g)))
  const failed = feedback(daily.code, guesses[guesses.length - 1]!).exact !== CODE_LENGTH
  const solve = {
    id: `daily-${daily.date}`,
    game: 'daily' as const,
    n: daily.number,
    seconds: seconds.value,
    date: daily.date,
    tries: guesses.length,
    failed,
    rows,
  }
  result.value = { ...solve, solvedAt: new Date().toISOString() }
  await games.recordSolve(solve)
}

const share = computed(() => {
  const r = result.value
  if (r == null) return ''
  const score = r.failed ? `X/${MAX_TRIES}` : `${r.tries}/${MAX_TRIES}`
  return [`Baffle · ${title} · ${score}`, ...(r.rows ?? [])].join('\n')
})
</script>

<template>
  <AppHeader :back="{ to: '/', label: 'Games' }" />
  <section class="flex items-end justify-between gap-2">
    <div>
      <div class="text-[13px] font-extrabold uppercase tracking-wider">{{ longDate() }}</div>
      <h1 class="text-3xl font-extrabold leading-none">{{ title }}</h1>
    </div>
    <div class="flex shrink-0 gap-2">
      <HowToPlay game="codebreak" auto compact @close="(first) => first && !result && restart()" />
      <span class="pill" aria-label="Time">{{ formatTime(seconds) }}</span>
    </div>
  </section>

  <CodebreakBoard :code="daily.code" :date="daily.date" :locked="result != null" @done="onDone" />

  <SolvedCard
    v-if="result"
    :title="result.failed ? 'Not cracked today' : `${title} cracked`"
    :detail="
      result.failed
        ? 'Out of guesses. A new code tomorrow.'
        : `${result.tries} of ${MAX_TRIES} guesses, ${formatTime(result.seconds)}`
    "
    :failed="result.failed"
    :share="share"
  />
</template>
