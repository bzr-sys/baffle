<script setup lang="ts">
import { computed, ref } from 'vue'
import { CODE_LENGTH, feedback, MAX_TRIES, PEGS } from '@/lib/codebreak'

const props = defineProps<{ code: number[]; date: string; locked?: boolean }>()
const emit = defineEmits<{ done: [guesses: number[][]] }>()

// Guesses survive a reload, so today's code can't be retried from scratch
const key = `baffle:codebreak:${props.date}`
function saved(): number[][] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as number[][]
  } catch {
    return []
  }
}
const guesses = ref<number[][]>(saved())
const current = ref<number[]>([])

const results = computed(() => guesses.value.map((g) => feedback(props.code, g)))
const cracked = computed(() => results.value.some((r) => r.exact === CODE_LENGTH))
const over = computed(() => props.locked || cracked.value || guesses.value.length >= MAX_TRIES)

function add(peg: number) {
  if (over.value || current.value.length >= CODE_LENGTH) return
  current.value = [...current.value, peg]
}

function removeAt(i: number) {
  if (over.value) return
  current.value = current.value.filter((_, k) => k !== i)
}

function check() {
  if (current.value.length < CODE_LENGTH) return
  guesses.value = [...guesses.value, current.value]
  current.value = []
  try {
    localStorage.setItem(key, JSON.stringify(guesses.value))
  } catch {
    // Kept for this visit only
  }
  if (cracked.value || guesses.value.length >= MAX_TRIES) emit('done', guesses.value)
}

const pegName = (p: number) => PEGS[p]!.name
</script>

<template>
  <div class="flex w-full max-w-[360px] flex-col gap-3 self-center">
    <ol class="flex flex-col gap-1.5" aria-label="Guesses">
      <li
        v-for="(g, i) in guesses"
        :key="i"
        class="flex items-center justify-between rounded-2xl border-[3px] border-ink bg-white px-3 py-2"
        :aria-label="`Guess ${i + 1}: ${g.map(pegName).join(', ')}. ${results[i]!.exact} right place, ${results[i]!.near} wrong place.`"
      >
        <span class="flex gap-1.5" aria-hidden="true">
          <span
            v-for="(p, k) in g"
            :key="k"
            class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-sm"
            :style="{ background: PEGS[p]!.color }"
            >{{ PEGS[p]!.shape }}</span
          >
        </span>
        <span class="grid grid-cols-2 gap-1" aria-hidden="true">
          <span
            v-for="k in CODE_LENGTH"
            :key="k"
            class="h-3.5 w-3.5 rounded-full border-2 border-ink"
            :class="
              k <= results[i]!.exact
                ? 'bg-ink'
                : k <= results[i]!.exact + results[i]!.near
                  ? 'bg-white'
                  : 'border-ink/20'
            "
          ></span>
        </span>
      </li>
    </ol>

    <template v-if="!over">
      <div
        class="flex items-center justify-between rounded-2xl border-[3px] border-dashed border-ink bg-white px-3 py-2"
      >
        <span class="flex gap-1.5">
          <button
            v-for="k in CODE_LENGTH"
            :key="k"
            class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink text-sm"
            :style="{
              background: current[k - 1] != null ? PEGS[current[k - 1]!]!.color : '#F1F1F1',
            }"
            :aria-label="
              current[k - 1] != null
                ? `Slot ${k}: ${pegName(current[k - 1]!)}, tap to clear`
                : `Slot ${k}: empty`
            "
            @click="removeAt(k - 1)"
          >
            {{ current[k - 1] != null ? PEGS[current[k - 1]!]!.shape : '' }}
          </button>
        </span>
        <span class="text-sm font-extrabold">{{ guesses.length + 1 }}/{{ MAX_TRIES }}</span>
      </div>
      <div class="grid grid-cols-6 gap-2" role="group" aria-label="Colors">
        <button
          v-for="(peg, p) in PEGS"
          :key="p"
          class="flex aspect-square items-center justify-center rounded-full border-[3px] border-ink text-lg shadow-hard-sm"
          :style="{ background: peg.color }"
          :aria-label="peg.name"
          @click="add(p)"
        >
          {{ peg.shape }}
        </button>
      </div>
      <button class="btn-ink" :disabled="current.length < CODE_LENGTH" @click="check">Check</button>
    </template>
  </div>
</template>
