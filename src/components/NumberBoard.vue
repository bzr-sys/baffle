<script setup lang="ts">
import { ref } from 'vue'
import { applyOp, OPS, type Op } from '@/lib/number'

const props = defineProps<{ numbers: number[]; target: number; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

type Chip = { id: number; value: number }
let nextId = 0
const start = (): Chip[] => props.numbers.map((value) => ({ id: nextId++, value }))

const chips = ref<Chip[]>(start())
/** Chips before each step, for undo */
const history = ref<Chip[][]>([])
const steps = ref<string[]>([])
const first = ref<Chip>()
const op = ref<Op>()
const problem = ref('')

function tapChip(chip: Chip) {
  if (props.locked) return
  problem.value = ''
  if (first.value == null || op.value == null) {
    first.value = first.value?.id === chip.id ? undefined : chip
    return
  }
  if (chip.id === first.value.id) {
    first.value = undefined
    op.value = undefined
    return
  }
  const result = applyOp(first.value.value, op.value, chip.value)
  if (result == null) {
    problem.value = 'Results must be whole numbers above 0.'
    return
  }
  history.value.push(chips.value)
  steps.value.push(`${first.value.value} ${op.value} ${chip.value} = ${result}`)
  const a = first.value.id
  chips.value = chips.value
    .filter((c) => c.id !== a)
    .map((c) => (c.id === chip.id ? { id: nextId++, value: result } : c))
  first.value = undefined
  op.value = undefined
  if (result === props.target) emit('solved')
}

function tapOp(o: Op) {
  if (props.locked || first.value == null) return
  op.value = op.value === o ? undefined : o
}

function undo() {
  const before = history.value.pop()
  if (before == null) return
  chips.value = before
  steps.value.pop()
  first.value = undefined
  op.value = undefined
}

function reset() {
  chips.value = start()
  history.value = []
  steps.value = []
  first.value = undefined
  op.value = undefined
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="card flex flex-col items-center px-8 py-3">
      <span class="text-xs font-extrabold uppercase tracking-wider">Target</span>
      <span class="text-5xl font-extrabold leading-none">{{ target }}</span>
    </div>
    <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Numbers">
      <button
        v-for="chip in chips"
        :key="chip.id"
        class="h-14 min-w-14 rounded-2xl border-[3px] border-ink px-3 text-2xl font-extrabold shadow-hard-sm"
        :class="first?.id === chip.id ? 'bg-yellow' : 'bg-white'"
        :aria-pressed="first?.id === chip.id"
        @click="tapChip(chip)"
      >
        {{ chip.value }}
      </button>
    </div>
    <div class="flex gap-2" role="group" aria-label="Operations">
      <button
        v-for="o in OPS"
        :key="o"
        class="h-12 w-12 rounded-full border-[3px] border-ink text-2xl font-extrabold shadow-hard-sm disabled:opacity-40"
        :class="op === o ? 'bg-ink text-white' : 'bg-white'"
        :disabled="first == null"
        :aria-pressed="op === o"
        @click="tapOp(o)"
      >
        {{ o }}
      </button>
    </div>
    <p v-if="problem" class="text-sm font-extrabold text-red" role="alert">{{ problem }}</p>
    <ol v-if="steps.length" class="flex flex-col items-center gap-0.5 text-base font-bold">
      <li v-for="(s, i) in steps" :key="i">{{ s }}</li>
    </ol>
    <div v-if="!locked" class="flex gap-2">
      <button class="pill" :disabled="steps.length === 0" @click="undo">Undo</button>
      <button class="pill" :disabled="steps.length === 0" @click="reset">Start over</button>
    </div>
  </div>
</template>
