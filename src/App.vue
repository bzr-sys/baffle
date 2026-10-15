<script setup lang="ts">
import { RouterView } from 'vue-router'
import { bzr } from '@/bazaar'
import { useAuthStore } from '@/stores/auth'
import { useGamesStore } from '@/stores/games'
import BaseLogin from './components/BaseLogin.vue'

const auth = useAuthStore()
const games = useGamesStore()

async function load() {
  await auth.loadState()
  if (auth.authenticated) await games.load()
}
void load()

bzr.onLogin(load)
</script>

<template>
  <div
    class="mx-auto flex min-h-screen w-full max-w-[480px] flex-col gap-4 px-3 pb-5 pt-[18px] min-[360px]:px-[18px]"
  >
    <div v-if="!auth.loaded || (auth.authenticated && games.status === 'loading')" class="m-auto">
      <span class="pill">Loading…</span>
    </div>
    <BaseLogin v-else-if="!auth.authenticated" />
    <RouterView v-else />
  </div>
</template>
