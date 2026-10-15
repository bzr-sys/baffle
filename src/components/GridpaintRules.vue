<script setup lang="ts">
import { ref } from 'vue'
import GridpaintBoard from './GridpaintBoard.vue'
import PaintModeToggle from './PaintModeToggle.vue'

/** 5×5 practice picture that logic alone solves */
const practice = ['#####', '#...#', '#.#.#', '#...#', '#####']
const mode = ref<'fill' | 'x'>('fill')
const solved = ref(false)
const attempt = ref(0)

function again() {
  solved.value = false
  attempt.value++
}
</script>

<template>
  <ol class="flex list-decimal flex-col gap-2 pl-5 text-[15px] font-semibold">
    <li>Fill cells to reveal a hidden picture.</li>
    <li>
      The numbers next to a row are its <b>runs of filled cells</b>, in order, with at least one
      empty cell between runs. The numbers above a column work the same, top to bottom.
    </li>
    <li>A <b>0</b> means the whole line stays empty.</li>
  </ol>

  <section class="flex flex-col gap-2">
    <h3 class="text-lg font-extrabold">Reading a clue</h3>
    <div class="flex items-center gap-2" aria-hidden="true">
      <span class="w-10 text-right text-sm font-extrabold">3 1</span>
      <div class="flex gap-1">
        <span
          v-for="(cell, i) in '###.#'"
          :key="i"
          class="h-8 w-8 rounded-md border-2 border-ink"
          :class="cell === '#' ? 'bg-ink' : 'bg-white'"
        ></span>
      </div>
    </div>
    <p class="text-sm font-semibold">
      “3 1” in a row of 5: three filled, a gap, one filled. Here it fits only one way.
    </p>
  </section>

  <section class="flex flex-col gap-2">
    <h3 class="text-lg font-extrabold">Painting</h3>
    <p class="text-sm font-semibold">
      <b>Fill</b>: tap a cell, or drag across several. <b>Mark empty</b>: put × on cells you know
      stay empty. It's only a note for you. Tap a cell again to clear it.
    </p>
  </section>

  <section class="flex flex-col gap-1 rounded-2xl bg-ground p-3 text-sm font-semibold">
    <h3 class="font-extrabold">Tips</h3>
    <p>Start with the big numbers. A 5 in a row of 5 fills it all.</p>
    <p>A 4 in a row of 5 covers the middle 3 cells, wherever it starts.</p>
    <p>Each cell you settle tells you something about its column, and the other way round.</p>
  </section>

  <section class="flex flex-col items-center gap-2">
    <h3 class="self-start text-lg font-extrabold">Try it</h3>
    <div :key="attempt" class="flex w-[240px] flex-col">
      <GridpaintBoard :rows="practice" :mode="mode" :locked="solved" @solved="solved = true" />
    </div>
    <PaintModeToggle v-if="!solved" v-model="mode" />
    <p v-else class="text-center text-sm font-extrabold" aria-live="polite">
      Solved: every row and column matches its numbers.
      <button class="underline" @click="again">Again</button>
    </p>
  </section>
</template>
