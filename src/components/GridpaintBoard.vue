<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { clues, emptyPaint, solved, type Paint } from '@/lib/gridpaint'

const props = defineProps<{ rows: string[]; locked?: boolean; mode: 'fill' | 'x' }>()
const emit = defineEmits<{ solved: [] }>()

const h = computed(() => props.rows.length)
const w = computed(() => props.rows[0]!.length)
const hints = computed(() => clues(props.rows))

const paint = ref<Paint[][]>(emptyPaint(h.value, w.value))
watch(
  () => props.rows,
  () => (paint.value = emptyPaint(h.value, w.value)),
)

/** While dragging, every cell touched gets the same value */
let dragValue: Paint | null = null

function apply(r: number, c: number) {
  if (dragValue == null || props.locked) return
  if (paint.value[r]![c] === dragValue) return
  paint.value[r]![c] = dragValue
}

function start(e: PointerEvent, r: number, c: number) {
  if (props.locked) return
  e.preventDefault()
  const target: Paint = props.mode
  dragValue = paint.value[r]![c] === target ? '' : target
  apply(r, c)
}

function move(e: PointerEvent) {
  if (dragValue == null) return
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  const r = el?.dataset.r
  const c = el?.dataset.c
  if (r != null && c != null) apply(Number(r), Number(c))
}

function end() {
  if (dragValue == null) return
  dragValue = null
  if (solved(props.rows, paint.value)) emit('solved')
}

window.addEventListener('pointerup', end)
onBeforeUnmount(() => window.removeEventListener('pointerup', end))

/** Keyboard: Enter or Space paints like a tap */
function key(r: number, c: number) {
  if (props.locked) return
  dragValue = paint.value[r]![c] === props.mode ? '' : props.mode
  apply(r, c)
  end()
}

const label = (r: number, c: number) =>
  `Row ${r + 1}, column ${c + 1}: ${paint.value[r]![c] === 'fill' ? 'filled' : paint.value[r]![c] === 'x' ? 'marked empty' : 'empty'}`

/** Thicker lines every 5 cells */
const edge = (i: number, n: number) => (i % 5 === 4 && i !== n - 1 ? '3px' : '1px')
</script>

<template>
  <div
    class="grid w-full max-w-[400px] select-none self-center"
    :style="{
      gridTemplateColumns: `auto repeat(${w}, minmax(0, 1fr))`,
      touchAction: 'none',
    }"
    @pointermove="move"
  >
    <div></div>
    <div
      v-for="(clue, c) in hints.cols"
      :key="'col' + c"
      class="flex flex-col items-center justify-end pb-1 font-extrabold leading-tight"
      :class="w > 10 ? 'text-[10px]' : 'text-xs'"
    >
      <span v-for="(n, i) in clue.length ? clue : [0]" :key="i">{{ n }}</span>
    </div>
    <template v-for="(row, r) in paint" :key="r">
      <div
        class="flex items-center justify-end pr-1.5 font-extrabold"
        :class="w > 10 ? 'gap-0.5 text-[10px]' : 'gap-1 text-xs'"
      >
        <span v-for="(n, i) in hints.rows[r]!.length ? hints.rows[r] : [0]" :key="i">{{ n }}</span>
      </div>
      <button
        v-for="(cell, c) in row"
        :key="c"
        :data-r="r"
        :data-c="c"
        class="flex aspect-square items-center justify-center border-ink text-xs font-extrabold"
        :class="cell === 'fill' ? 'bg-ink' : 'bg-white'"
        :style="{
          borderTopWidth: r === 0 ? '3px' : '0',
          borderLeftWidth: c === 0 ? '3px' : '0',
          borderRightWidth: c === w - 1 ? '3px' : edge(c, w),
          borderBottomWidth: r === h - 1 ? '3px' : edge(r, h),
        }"
        :aria-label="label(r, c)"
        @pointerdown="start($event, r, c)"
        @keydown.enter.prevent="key(r, c)"
        @keydown.space.prevent="key(r, c)"
      >
        <span v-if="cell === 'x'" aria-hidden="true">×</span>
      </button>
    </template>
  </div>
</template>
