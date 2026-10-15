<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { bzr } from '@/bazaar'
import AppHeader from '@/components/AppHeader.vue'
import { GAMES } from '@/games'
import { PACK_GROUP, parseLevels, publish } from '@/lib/data'
import { useGamesStore } from '@/stores/games'
import type { GameId, Level } from '@/types'

const games = useGamesStore()
const status = ref<{ canMonetize: boolean; paymentsEnabled: boolean }>()
const sales = ref<number>()
const files = ref<Partial<Record<GameId, Level[]>>>({})
const errors = ref<Partial<Record<GameId, string>>>({})
const log = ref<string[]>([])
const busy = ref(false)
const ready = computed(() => status.value?.canMonetize && status.value.paymentsEnabled)

async function refresh() {
  status.value = await bzr.monetization.status()
  if (games.pack) sales.value = (await bzr.monetization.sales.list({ group: PACK_GROUP })).length
}
onMounted(refresh)

async function pick(game: GameId, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  const levels = file ? parseLevels(game, await file.text()) : null
  if (levels) files.value[game] = levels
  else delete files.value[game]
  errors.value[game] = file && levels == null ? `Not a ${game} pack file` : undefined
}

async function run() {
  busy.value = true
  log.value = []
  try {
    await publish(files.value, (line) => log.value.push(line))
    await games.loadPackData()
    await refresh()
  } catch (e) {
    log.value.push(`Failed: ${e instanceof Error ? e.message : String(e)}`)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AppHeader :back="{ to: '/', label: 'Games' }" />
  <h1 class="text-[34px] font-extrabold leading-none">Admin</h1>

  <p v-if="!games.admin" class="card p-4 font-semibold">Only Baffle's team can open this page.</p>
  <template v-else>
    <section v-if="status" class="card flex flex-col gap-2 p-4">
      <button
        v-if="!ready"
        class="btn-ink"
        @click="bzr.monetization.openPopup(() => void refresh())"
      >
        Set up monetization
      </button>
      <p v-else class="font-extrabold">
        Payments enabled<template v-if="sales != null">
          · {{ sales }} {{ sales === 1 ? 'pack' : 'packs' }} sold</template
        >
      </p>
    </section>

    <section class="card flex flex-col gap-3 p-4">
      <h2 class="text-xl font-extrabold">Publish</h2>
      <label
        v-for="game in GAMES"
        :key="game.id"
        class="flex flex-col gap-1 text-sm font-extrabold"
      >
        <span>
          {{ game.name }}
          <span v-if="files[game.id]" class="font-semibold"
            >· {{ files[game.id]!.length }} levels</span
          >
          <span v-else-if="games.packCount(game.id)" class="font-semibold">
            · {{ games.packCount(game.id) }} published
          </span>
        </span>
        <input
          type="file"
          accept=".json,application/json"
          class="font-semibold"
          :aria-label="`${game.name} pack file`"
          @change="pick(game.id, $event)"
        />
        <span v-if="errors[game.id]" class="text-red" role="alert">{{ errors[game.id] }}</span>
      </label>
      <button class="btn-ink" :disabled="busy || Object.keys(files).length === 0" @click="run">
        {{ busy ? 'Publishing…' : 'Publish' }}
      </button>
      <ul v-if="log.length" class="flex flex-col gap-1 text-sm font-semibold" aria-live="polite">
        <li v-for="(line, i) in log" :key="i">{{ line }}</li>
      </ul>
    </section>
  </template>
</template>
