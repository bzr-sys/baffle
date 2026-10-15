<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { bzr } from '@/bazaar'
import { useAuthStore } from '@/stores/auth'
import { useGamesStore } from '@/stores/games'

/** Inner pages show a way back instead of the streak */
defineProps<{ back?: { to: string; label: string } }>()

const auth = useAuthStore()
const games = useGamesStore()
const menuOpen = ref(false)

const initials = () =>
  (auth.me?.name ?? auth.me?.handle ?? '?')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
</script>

<template>
  <header class="flex items-center justify-between gap-3">
    <template v-if="back">
      <RouterLink :to="back.to" class="pill">← {{ back.label }}</RouterLink>
      <RouterLink to="/" class="text-2xl font-extrabold tracking-tight">Baffle</RouterLink>
    </template>
    <template v-else>
      <RouterLink to="/" class="text-[34px] font-extrabold tracking-tight">Baffle</RouterLink>
      <div class="relative flex items-center gap-2">
        <span v-if="games.currentStreak > 0" class="pill bg-yellow">
          {{ games.currentStreak }} day streak
        </span>
        <button
          class="h-11 w-11 rounded-full border-[3px] border-ink bg-white text-sm font-extrabold shadow-hard-sm"
          aria-label="Account"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          {{ initials() }}
        </button>
        <div
          v-if="menuOpen"
          class="card absolute right-0 top-14 z-10 flex w-44 flex-col p-2 text-base font-semibold"
        >
          <RouterLink
            v-if="games.admin"
            to="/admin"
            class="rounded-lg px-3 py-2 hover:bg-ground"
            @click="menuOpen = false"
          >
            Admin
          </RouterLink>
          <button class="rounded-lg px-3 py-2 text-left hover:bg-ground" @click="bzr.logOut()">
            Log out
          </button>
        </div>
      </div>
    </template>
  </header>
</template>
