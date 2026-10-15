<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gameInfo } from '@/games'
import type { GameId } from '@/types'
import CrownworkRules from './CrownworkRules.vue'
import GameRules from './GameRules.vue'
import GridpaintRules from './GridpaintRules.vue'

/**
 * "How to play" button and dialog. With `auto`, it opens on the player's first visit.
 * `compact`: a "?" on narrow phones, for crowded headers.
 */
const props = defineProps<{ game: GameId | 'codebreak'; auto?: boolean; compact?: boolean }>()
/** `first`: closed after opening on its own, so nothing was played yet */
const emit = defineEmits<{ close: [first: boolean] }>()

const title = props.game === 'codebreak' ? 'Codebreak' : gameInfo(props.game)!.name
const key = `baffle:howto:${props.game}`
const dialog = ref<HTMLDialogElement>()
const isOpen = ref(false)
let first = false

function seen(): boolean {
  try {
    return localStorage.getItem(key) != null
  } catch {
    return false
  }
}

function open() {
  isOpen.value = true
  dialog.value?.showModal()
}

function close() {
  // Hide the content now; the dialog's close event comes a moment later
  isOpen.value = false
  dialog.value?.close()
}

/** Also runs on Escape */
function onClose() {
  isOpen.value = false
  emit('close', first)
  first = false
}

onMounted(() => {
  if (props.auto && !seen()) {
    try {
      localStorage.setItem(key, '1')
    } catch {
      // Opens again next visit
    }
    first = true
    open()
  }
})
</script>

<template>
  <button class="pill" aria-label="How to play" @click="open">
    <span :class="{ 'max-[399px]:hidden': compact }">How to play</span>
    <span v-if="compact" class="min-[400px]:hidden" aria-hidden="true">?</span>
  </button>
  <dialog
    ref="dialog"
    class="card m-auto max-h-[calc(100dvh-32px)] w-[min(440px,calc(100vw-32px))] overflow-y-auto p-0 text-ink backdrop:bg-ink/50"
    :aria-label="`How to play ${title}`"
    @close="onClose"
  >
    <div v-if="isOpen" class="flex flex-col gap-4 p-5">
      <h2 class="text-[26px] font-extrabold leading-none">How to play {{ title }}</h2>
      <CrownworkRules v-if="game === 'crownwork'" />
      <GridpaintRules v-else-if="game === 'gridpaint'" />
      <GameRules v-else :game="game" />
      <button class="btn-ink" @click="close">Got it, let's play</button>
    </div>
  </dialog>
</template>
