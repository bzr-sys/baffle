<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { canExtend, pathSolved, startCell, type Cell } from '@/lib/path'

const props = defineProps<{ numbers: number[][]; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

const n = props.numbers.length
const path = ref<Cell[]>([startCell(props.numbers)])
const onPath = computed(() => new Set(path.value.map(([r, c]) => `${r},${c}`)))
let dragging = false

/** Extend to `cell`, or step back when it's on the path already */
function visit(cell: Cell) {
  if (props.locked) return
  const at = path.value.findIndex(([r, c]) => r === cell[0] && c === cell[1])
  if (at >= 0) path.value = path.value.slice(0, at + 1)
  else if (canExtend(props.numbers, path.value, cell)) path.value = [...path.value, cell]
}

function start(e: PointerEvent, r: number, c: number) {
  if (props.locked) return
  e.preventDefault()
  dragging = true
  visit([r, c])
}

function move(e: PointerEvent) {
  if (!dragging) return
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  const r = el?.dataset.r
  const c = el?.dataset.c
  if (r == null || c == null) return
  const cell: Cell = [Number(r), Number(c)]
  const before = path.value[path.value.length - 2]
  // Dragging back onto the previous cell undoes the last step
  if (before && before[0] === cell[0] && before[1] === cell[1]) path.value = path.value.slice(0, -1)
  else visit(cell)
}

function end() {
  if (!dragging) return
  dragging = false
  if (pathSolved(props.numbers, path.value)) emit('solved')
}
window.addEventListener('pointerup', end)
onBeforeUnmount(() => window.removeEventListener('pointerup', end))

/** Keyboard: Enter on a cell steps to it */
function key(r: number, c: number) {
  visit([r, c])
  if (pathSolved(props.numbers, path.value)) emit('solved')
}

const points = computed(() => path.value.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(' '))
const label = (r: number, c: number) => {
  const k = props.numbers[r]![c]
  return `Row ${r + 1}, column ${c + 1}${k ? `, number ${k}` : ''}${onPath.value.has(`${r},${c}`) ? ', on the path' : ''}`
}
</script>

<template>
  <div
    class="relative w-full max-w-[360px] select-none self-center"
    :style="{ touchAction: 'none' }"
    @pointermove="move"
  >
    <div
      class="grid overflow-hidden rounded-xl border-[3px] border-ink"
      :style="{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }"
    >
      <template v-for="(row, r) in numbers" :key="r">
        <button
          v-for="(k, c) in row"
          :key="c"
          :data-r="r"
          :data-c="c"
          class="aspect-square border border-ink/40"
          :class="onPath.has(`${r},${c}`) ? 'bg-green' : 'bg-white'"
          :aria-label="label(r, c)"
          @pointerdown="start($event, r, c)"
          @keydown.enter.prevent="key(r, c)"
          @keydown.space.prevent="key(r, c)"
        ></button>
      </template>
    </div>
    <svg
      class="pointer-events-none absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)]"
      :viewBox="`0 0 ${n} ${n}`"
      aria-hidden="true"
    >
      <polyline
        :points="points"
        fill="none"
        stroke="#1B1B1B"
        stroke-width="0.16"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <template v-for="(row, r) in numbers" :key="r">
        <template v-for="(k, c) in row" :key="c">
          <g v-if="k">
            <circle :cx="c + 0.5" :cy="r + 0.5" r="0.3" fill="#1B1B1B" />
            <text
              :x="c + 0.5"
              :y="r + 0.5"
              fill="#fff"
              font-size="0.34"
              font-weight="800"
              text-anchor="middle"
              dominant-baseline="central"
            >
              {{ k }}
            </text>
          </g>
        </template>
      </template>
    </svg>
  </div>
</template>
