<script setup lang="ts">
import { ref } from 'vue'
import CrownIcon from './CrownIcon.vue'
import CrownworkBoard from './CrownworkBoard.vue'

/** 4×4 practice puzzle with one solution */
const practice = ['AAAB', 'AABB', 'CCDD', 'CCDD']
const board = ref<InstanceType<typeof CrownworkBoard>>()
const solved = ref(false)

function again() {
  solved.value = false
  board.value?.reset()
}
</script>

<template>
  <ol class="flex list-decimal flex-col gap-2 pl-5 text-[15px] font-semibold">
    <li>Put <b>one crown</b> in every <b>row</b>, every <b>column</b> and every <b>color</b>.</li>
    <li>Crowns <b>never touch</b>, not even at the corners.</li>
  </ol>

  <section class="flex flex-col gap-2">
    <h3 class="text-lg font-extrabold">Tap a cell to cycle it</h3>
    <div class="flex items-center gap-2 text-sm font-extrabold" aria-hidden="true">
      <span class="flex h-10 w-10 rounded-lg border-2 border-ink bg-white"></span>
      →
      <span
        class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-white text-lg"
        >×</span
      >
      →
      <span
        class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-white"
      >
        <CrownIcon :size="24" />
      </span>
      →
      <span class="flex h-10 w-10 rounded-lg border-2 border-ink bg-white"></span>
    </div>
    <p class="text-sm font-semibold">
      Once for ×, your note that no crown goes there. Twice for a crown. A third time clears it.
      Crowns that break a rule get a red ring.
    </p>
  </section>

  <section class="flex flex-col gap-1 rounded-2xl bg-ground p-3 text-sm font-semibold">
    <h3 class="font-extrabold">Tips</h3>
    <p>
      After placing a crown, put × on the rest of its row, column and color, and on the 8 cells
      around it.
    </p>
    <p>
      If a color lies entirely in one row, its crown must be in that row. So × the other cells of
      that row. The same works for columns.
    </p>
  </section>

  <section class="flex flex-col items-center gap-2">
    <h3 class="self-start text-lg font-extrabold">Try it</h3>
    <div class="w-[220px]">
      <CrownworkBoard ref="board" :regions="practice" :locked="solved" @solved="solved = true" />
    </div>
    <p v-if="!solved" class="text-center text-sm font-semibold">
      Hint: the bottom two rows hold only green and yellow, so their crowns go there.
    </p>
    <p v-else class="text-center text-sm font-extrabold" aria-live="polite">
      Solved: one crown per row, column and color, none touching.
      <button class="underline" @click="again">Again</button>
    </p>
  </section>
</template>
