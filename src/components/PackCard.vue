<script setup lang="ts">
import { computed } from 'vue'
import { GAMES } from '@/games'
import { useGamesStore } from '@/stores/games'

/** Offer for the pack, until it's bought */
const games = useGamesStore()
const price = computed(() => `$${((games.pack?.priceCents ?? 0) / 100).toFixed(0)}`)
</script>

<template>
  <section
    v-if="games.pack && !games.ownsPack && games.packTotal > 0"
    class="card flex flex-col gap-2.5 bg-yellow p-4"
  >
    <div class="flex flex-col gap-0.5">
      <span class="text-[22px] font-extrabold">Unlock {{ games.packTotal }} more puzzles</span>
      <span class="text-sm font-semibold">
        Every puzzle in all {{ GAMES.length }} games. Pay once, keep forever.
      </span>
    </div>
    <button class="btn-ink h-[54px] text-[19px]" @click="games.buyPack()">
      Get the pack · {{ price }}
    </button>
    <div class="text-center text-xs font-semibold">Checkout by Bazaar.</div>
  </section>
</template>
