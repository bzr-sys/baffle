<script setup lang="ts">
import { computed, ref } from 'vue'
import { sunMoonConflicts, sunMoonFromGivens, sunMoonSolved, type SunMoon } from '@/lib/sunmoon'
import SunMoonMark from './SunMoonMark.vue'

const props = defineProps<{ givens: string[]; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

const fixed = sunMoonFromGivens(props.givens)
const grid = ref<SunMoon[][]>(fixed.map((row) => [...row]))
const bad = computed(() => sunMoonConflicts(grid.value))
const next: Record<SunMoon, SunMoon> = { '': 'S', S: 'M', M: '' }

function tap(r: number, c: number) {
  if (props.locked || fixed[r]![c] !== '') return
  grid.value[r]![c] = next[grid.value[r]![c]!]
  if (sunMoonSolved(grid.value)) emit('solved')
}

const label = (r: number, c: number) => {
  const v = grid.value[r]![c]
  const what = v === 'S' ? 'sun' : v === 'M' ? 'moon' : 'empty'
  return `Row ${r + 1}, column ${c + 1}: ${what}${fixed[r]![c] !== '' ? ', given' : ''}`
}
</script>

<template>
  <div
    class="grid w-full max-w-[360px] gap-1 self-center"
    :style="{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }"
  >
    <template v-for="(row, r) in grid" :key="r">
      <button
        v-for="(v, c) in row"
        :key="c"
        class="flex aspect-square items-center justify-center rounded-lg border-2 border-ink"
        :class="[
          fixed[r]![c] !== '' ? 'bg-locked' : 'bg-white',
          { 'ring-4 ring-inset ring-red': bad.has(`${r},${c}`) },
        ]"
        :aria-label="label(r, c)"
        @click="tap(r, c)"
      >
        <SunMoonMark v-if="v !== ''" :kind="v" :size="grid.length > 6 ? 22 : 28" />
      </button>
    </template>
  </div>
</template>
