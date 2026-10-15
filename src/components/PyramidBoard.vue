<script setup lang="ts">
import { computed, ref } from 'vue'
import { pyramidConflicts, pyramidSolved, type Pyramid } from '@/lib/pyramid'

const props = defineProps<{ rows: Pyramid; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()

const values = ref<Pyramid>(props.rows.map((row) => [...row]))
const bad = computed(() => pyramidConflicts(values.value))
const width = `${Math.floor(100 / props.rows.length)}%`

function input(r: number, i: number, e: Event) {
  const text = (e.target as HTMLInputElement).value.replace(/\D/g, '')
  values.value[r]![i] = text === '' ? null : Number(text)
  if (pyramidSolved(values.value)) emit('solved')
}
</script>

<template>
  <div class="flex w-full max-w-[380px] flex-col items-center gap-1 self-center">
    <div v-for="(row, r) in rows" :key="r" class="flex w-full justify-center gap-1">
      <template v-for="(given, i) in row" :key="i">
        <div
          v-if="given != null"
          class="flex h-12 items-center justify-center rounded-lg border-2 border-ink bg-locked text-lg font-extrabold"
          :class="{ 'ring-4 ring-inset ring-red': bad.has(`${r},${i}`) }"
          :style="{ width }"
        >
          {{ given }}
        </div>
        <input
          v-else
          class="h-12 rounded-lg border-2 border-ink bg-white text-center text-lg font-extrabold outline-none focus:bg-yellow"
          :class="{ 'ring-4 ring-inset ring-red': bad.has(`${r},${i}`) }"
          :style="{ width }"
          inputmode="numeric"
          maxlength="4"
          :disabled="locked"
          :aria-label="`Row ${r + 1}, block ${i + 1}`"
          :value="values[r]![i] ?? ''"
          @input="input(r, i, $event)"
        />
      </template>
    </div>
  </div>
</template>
