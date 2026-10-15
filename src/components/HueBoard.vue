<script setup lang="ts">
import { computed, ref } from 'vue'
import { hueColor, hueSolved } from '@/lib/hue'

const props = defineProps<{ from: string; to: string; order: number[]; locked?: boolean }>()
const emit = defineEmits<{ solved: [swaps: number] }>()

const count = props.order.length + 2
const middle = ref([...props.order])
const tiles = computed(() => [0, ...middle.value, count - 1])
const picked = ref<number>()
const swaps = ref(0)

/** `at` is a place in the middle, 0-based */
function tap(at: number) {
  if (props.locked) return
  if (picked.value == null) {
    picked.value = at
    return
  }
  if (picked.value !== at) {
    const m = middle.value
    ;[m[picked.value], m[at]] = [m[at]!, m[picked.value]!]
    swaps.value++
  }
  picked.value = undefined
  if (hueSolved(middle.value)) emit('solved', swaps.value)
}
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col gap-3 self-center">
    <div class="flex h-48 overflow-hidden rounded-2xl border-[3px] border-ink shadow-hard">
      <template v-for="(tile, i) in tiles" :key="i">
        <div
          v-if="i === 0 || i === count - 1"
          class="flex flex-1 items-end justify-center pb-2"
          :style="{ background: hueColor(from, to, tile, count) }"
          :aria-label="i === 0 ? 'First tile, fixed' : 'Last tile, fixed'"
        >
          <span class="h-2 w-2 rounded-full bg-ink" aria-hidden="true"></span>
        </div>
        <button
          v-else
          class="flex-1 transition-transform"
          :class="{ 'z-10 -translate-y-2 outline outline-[3px] outline-ink': picked === i - 1 }"
          :style="{ background: hueColor(from, to, tile, count) }"
          :aria-label="`Tile ${i + 1}${picked === i - 1 ? ', picked' : ''}`"
          :aria-pressed="picked === i - 1"
          @click="tap(i - 1)"
        ></button>
      </template>
    </div>
    <p class="text-center text-sm font-extrabold">{{ swaps }} swaps</p>
  </div>
</template>
