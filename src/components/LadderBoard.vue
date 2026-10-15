<script setup lang="ts">
import { ref } from 'vue'
import { ladderSolved, oneLetterApart, rungProblem } from '@/lib/ladder'

const props = defineProps<{ from: string; to: string; steps: number; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

const rungs = ref<string[]>(Array(props.steps - 1).fill(''))

function input(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const word = el.value
    .replace(/[^a-z]/gi, '')
    .toLowerCase()
    .slice(0, 4)
  el.value = word.toUpperCase()
  rungs.value[i] = word
  if (ladderSolved(props.from, props.to, rungs.value)) emit('solved')
}

/** Problem with rung `i`, checked against the rung above (and the end word for the last) */
function problem(i: number): string | null {
  const above = i === 0 ? props.from : rungs.value[i - 1]!
  const own = rungProblem(rungs.value[i]!, above)
  if (own) return own
  const last = i === rungs.value.length - 1
  if (last && rungs.value[i]!.length === 4 && !oneLetterApart(rungs.value[i]!, props.to)) {
    return `Must be one letter from ${props.to.toUpperCase()}`
  }
  return null
}

const word =
  'h-14 w-full rounded-2xl border-[3px] border-ink text-center text-3xl font-extrabold uppercase tracking-[0.4em]'
</script>

<template>
  <div class="flex w-full max-w-[300px] flex-col gap-2 self-center">
    <div :class="word" class="flex items-center justify-center bg-locked">{{ from }}</div>
    <div v-for="(rung, i) in rungs" :key="i" class="flex flex-col gap-0.5">
      <input
        :class="[word, problem(i) ? 'bg-red/30' : 'bg-white']"
        class="outline-none focus:bg-yellow"
        autocapitalize="characters"
        autocomplete="off"
        spellcheck="false"
        maxlength="4"
        :disabled="locked"
        :aria-label="`Word ${i + 1} of ${rungs.length}`"
        :aria-invalid="problem(i) != null"
        :value="rung.toUpperCase()"
        @input="input(i, $event)"
      />
      <span v-if="problem(i)" class="text-center text-xs font-extrabold" role="alert">
        {{ problem(i) }}
      </span>
    </div>
    <div :class="word" class="flex items-center justify-center bg-locked">{{ to }}</div>
  </div>
</template>
