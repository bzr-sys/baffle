<script setup lang="ts">
import { PEGS } from '@/lib/codebreak'
import SunMoonMark from './SunMoonMark.vue'

/** How to play the games without their own practice puzzle */
defineProps<{ game: 'sunmoon' | 'path' | 'number' | 'pyramid' | 'hue' | 'ladder' | 'codebreak' }>()

const list = 'flex list-decimal flex-col gap-2 pl-5 text-[15px] font-semibold'
const tips = 'flex flex-col gap-1 rounded-2xl bg-ground p-3 text-sm font-semibold'
</script>

<template>
  <template v-if="game === 'sunmoon'">
    <ol :class="list">
      <li>Fill every cell with a <b>sun</b> or a <b>moon</b>.</li>
      <li>Each row and each column has <b>as many suns as moons</b>.</li>
      <li><b>Never three alike</b> side by side, across or down.</li>
    </ol>
    <div class="flex items-center gap-1" aria-hidden="true">
      <span
        v-for="(k, i) in ['S', 'S', 'M', 'S', 'M', 'M'] as const"
        :key="i"
        class="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-white"
      >
        <SunMoonMark :kind="k" :size="24" />
      </span>
    </div>
    <p class="text-sm font-semibold">A finished row: three of each, never three alike in a row.</p>
    <section :class="tips">
      <h3 class="font-extrabold">Tips</h3>
      <p>Tap once for a sun, twice for a moon, a third time to clear. Gray cells are given.</p>
      <p>Two suns side by side? The cells on both ends must be moons.</p>
      <p>A line that has its share of suns is moons everywhere else.</p>
    </section>
  </template>

  <template v-else-if="game === 'path'">
    <ol :class="list">
      <li>Draw <b>one line</b> through <b>every cell</b>, starting at 1.</li>
      <li>Pass the numbers <b>in order</b>: 1, 2, 3 and so on. The highest number is the end.</li>
      <li>Move up, down, left or right, never diagonally, and never through a cell twice.</li>
    </ol>
    <section :class="tips">
      <h3 class="font-extrabold">Tips</h3>
      <p>Drag from the end of your line. Drag back, or tap a cell on the line, to undo.</p>
      <p>Corners and edges have few ways in and out: route the line through them early.</p>
    </section>
  </template>

  <template v-else-if="game === 'number'">
    <ol :class="list">
      <li>Reach the <b>target</b> by combining the numbers with + − × ÷.</li>
      <li>Each number is used <b>once</b>. A result replaces the two numbers it came from.</li>
      <li>Results must be <b>whole numbers above 0</b>. You don't have to use every number.</li>
    </ol>
    <p class="rounded-2xl bg-white p-3 text-center text-base font-bold" aria-hidden="true">
      Target 728 with 2 5 7 10 25 75<br />5 − 2 = 3 · 25 − 3 = 22 · 75 × 10 = 750 · 750 − 22 = 728
    </p>
    <section :class="tips">
      <h3 class="font-extrabold">Tips</h3>
      <p>Tap a number, an operation, then another number. Undo steps back.</p>
      <p>Every puzzle needs four steps. Get close with a multiplication, then fix the rest.</p>
    </section>
  </template>

  <template v-else-if="game === 'pyramid'">
    <ol :class="list">
      <li>Each block is the <b>sum of the two blocks below it</b>.</li>
      <li>Fill in the empty blocks. Gray blocks are given.</li>
    </ol>
    <div class="flex flex-col items-center gap-1 text-base font-extrabold" aria-hidden="true">
      <span
        class="flex h-10 w-14 items-center justify-center rounded-lg border-2 border-ink bg-locked"
        >12</span
      >
      <span class="flex gap-1">
        <span
          class="flex h-10 w-14 items-center justify-center rounded-lg border-2 border-ink bg-locked"
          >5</span
        >
        <span
          class="flex h-10 w-14 items-center justify-center rounded-lg border-2 border-ink bg-yellow"
          >7</span
        >
      </span>
    </div>
    <p class="text-center text-sm font-semibold">12 above 5 means the other block is 7.</p>
    <section :class="tips">
      <h3 class="font-extrabold">Tip</h3>
      <p>
        Look for any three blocks in a little triangle with two known. The third follows, adding up
        or taking away.
      </p>
    </section>
  </template>

  <template v-else-if="game === 'hue'">
    <ol :class="list">
      <li>The tiles make a <b>smooth color gradient</b> from one end to the other.</li>
      <li>
        They're shuffled. <b>Swap</b> tiles until every color sits between its closest neighbors.
      </li>
      <li>The two end tiles, marked with a dot, never move.</li>
    </ol>
    <div class="flex h-12 overflow-hidden rounded-xl border-2 border-ink" aria-hidden="true">
      <span
        v-for="i in 8"
        :key="i"
        class="flex-1"
        :style="{ background: `color-mix(in oklab, #4D96FF ${((i - 1) / 7) * 100}%, #FF6B6B)` }"
      ></span>
    </div>
    <section :class="tips">
      <h3 class="font-extrabold">Tips</h3>
      <p>Tap a tile, then the tile to swap it with.</p>
      <p>Work inward from the ends: find the tile closest to each end color first.</p>
    </section>
  </template>

  <template v-else-if="game === 'ladder'">
    <ol :class="list">
      <li>Get from the <b>top word</b> to the <b>bottom word</b>.</li>
      <li>Each word changes <b>exactly one letter</b> of the word above it.</li>
      <li>Every step must be a real word. The number of steps is fixed.</li>
    </ol>
    <p
      class="rounded-2xl bg-white p-3 text-center text-lg font-extrabold tracking-widest"
      aria-hidden="true"
    >
      COLD → CORD → WORD → WARD → WARM
    </p>
    <section :class="tips">
      <h3 class="font-extrabold">Tip</h3>
      <p>Compare the two end words: which letters have to change, and in which order works?</p>
    </section>
  </template>

  <template v-else-if="game === 'codebreak'">
    <ol :class="list">
      <li>Today's hidden code is <b>4 colors</b>. Colors can repeat.</li>
      <li>You have <b>8 guesses</b>. After each, the dots tell you how close you are.</li>
      <li>
        <b>Filled dot</b>: a right color in the right place. <b>Hollow dot</b>: a right color in the
        wrong place. The dots don't say which pegs they mean.
      </li>
    </ol>
    <div
      class="flex items-center justify-between rounded-2xl border-[3px] border-ink bg-white px-3 py-2"
      aria-hidden="true"
    >
      <span class="flex gap-1.5">
        <span
          v-for="p in [0, 1, 2, 3]"
          :key="p"
          class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink text-xs"
          :style="{ background: PEGS[p]!.color }"
          >{{ PEGS[p]!.shape }}</span
        >
      </span>
      <span class="grid grid-cols-2 gap-1">
        <span class="h-3.5 w-3.5 rounded-full border-2 border-ink bg-ink"></span>
        <span class="h-3.5 w-3.5 rounded-full border-2 border-ink bg-white"></span>
        <span class="h-3.5 w-3.5 rounded-full border-2 border-ink/20"></span>
        <span class="h-3.5 w-3.5 rounded-full border-2 border-ink/20"></span>
      </span>
    </div>
    <p class="text-sm font-semibold">
      One color is right and in place, one is right but elsewhere.
    </p>
    <section :class="tips">
      <h3 class="font-extrabold">Tips</h3>
      <p>Tap colors to fill the slots, tap a slot to clear it. Each color has its own shape too.</p>
      <p>One new puzzle a day, the same for everyone. Solve it to keep your streak.</p>
    </section>
  </template>
</template>
