<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CrownIcon from './CrownIcon.vue'
import { conflicts, emptyMarks, regionColor, solved, type Mark } from '@/lib/crownwork'

const props = defineProps<{ regions: string[]; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

const marks = ref<Mark[][]>(emptyMarks(props.regions.length))
watch(
  () => props.regions,
  (regions) => (marks.value = emptyMarks(regions.length)),
)

const bad = computed(() => conflicts(props.regions, marks.value))
const next: Record<Mark, Mark> = { '': 'x', x: 'crown', crown: '' }

function tap(r: number, c: number) {
  if (props.locked) return
  marks.value[r]![c] = next[marks.value[r]![c]!]
  if (solved(props.regions, marks.value)) emit('solved')
}

function label(r: number, c: number) {
  const mark = marks.value[r]![c]
  const state = mark === 'crown' ? 'crown' : mark === 'x' ? 'marked empty' : 'empty'
  return `Row ${r + 1}, column ${c + 1}, color ${props.regions[r]![c]}: ${state}`
}

function reset() {
  marks.value = emptyMarks(props.regions.length)
}
defineExpose({ reset })
</script>

<template>
  <div
    class="grid w-full max-w-[360px] gap-1 self-center"
    :style="{ gridTemplateColumns: `repeat(${regions.length}, minmax(0, 1fr))` }"
  >
    <template v-for="(row, r) in regions" :key="r">
      <button
        v-for="(letter, c) in row"
        :key="c"
        class="relative flex aspect-square items-center justify-center rounded-lg border-2 border-ink"
        :class="{ 'ring-4 ring-inset ring-red': bad.has(`${r},${c}`) }"
        :style="{ background: regionColor(letter) }"
        :aria-label="label(r, c)"
        @click="tap(r, c)"
      >
        <CrownIcon v-if="marks[r]![c] === 'crown'" :size="regions.length > 6 ? 22 : 28" />
        <span v-else-if="marks[r]![c] === 'x'" class="text-lg font-extrabold leading-none">×</span>
      </button>
    </template>
  </div>
</template>
