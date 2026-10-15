<script setup lang="ts">
import { bzr } from '@/bazaar'
import { GAMES } from '@/games'
import GameIcon from './GameIcon.vue'
</script>

<template>
  <header class="text-[34px] font-extrabold tracking-tight">Baffle</header>
  <main class="flex flex-1 flex-col justify-center gap-6">
    <h1 class="text-5xl font-extrabold leading-[1.02] tracking-tight">
      Small puzzles. Big satisfaction.
    </h1>
    <p class="text-lg font-semibold">
      A new Codebreak every day, free. {{ GAMES.length }} puzzle games to try, with more in the
      pack.
    </p>
    <div class="grid grid-cols-4 gap-2.5 self-center" aria-hidden="true">
      <span
        v-for="game in GAMES"
        :key="game.id"
        class="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-ink shadow-hard-sm"
        :class="game.color"
      >
        <GameIcon :game="game.id" />
      </span>
    </div>
    <button class="btn-ink h-14 text-xl" @click="bzr.login()">Play with Bazaar</button>
  </main>
  <footer class="text-center text-sm font-semibold">
    Your progress lives in your Bazaar account. Built on
    <a href="https://bzr.dev/" class="underline">Bazaar</a>.
  </footer>
</template>
