<script setup lang="ts">
import type { GameId } from '@/types'
import CrownIcon from './CrownIcon.vue'
import GridIcon from './GridIcon.vue'

defineProps<{ game: GameId | 'codebreak' }>()
</script>

<template>
  <CrownIcon v-if="game === 'crownwork'" :size="30" />
  <GridIcon v-else-if="game === 'gridpaint'" />
  <svg
    v-else
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    stroke="#1B1B1B"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="game === 'sunmoon'">
      <circle cx="10" cy="15" r="6" fill="#fff" />
      <path d="M22 9a6 6 0 1 0 4 10 5 5 0 0 1-4-10z" fill="#1B1B1B" />
    </template>
    <template v-else-if="game === 'path'">
      <polyline points="5,6 5,24 15,24 15,6 25,6 25,24" />
      <circle cx="5" cy="6" r="2.5" fill="#1B1B1B" />
    </template>
    <template v-else-if="game === 'number'">
      <path d="M9 5v10M4 10h10M18 20l7 7M25 20l-7 7M4 23h10" />
    </template>
    <template v-else-if="game === 'pyramid'">
      <rect x="11" y="4" width="8" height="7" fill="#fff" />
      <rect x="6" y="12" width="8" height="7" fill="#fff" />
      <rect x="16" y="12" width="8" height="7" fill="#fff" />
      <rect x="1.5" y="20" width="8" height="7" fill="#fff" />
      <rect x="11" y="20" width="8" height="7" fill="#fff" />
      <rect x="20.5" y="20" width="8" height="7" fill="#fff" />
    </template>
    <template v-else-if="game === 'hue'">
      <rect x="3" y="5" width="8" height="20" fill="#FF6B6B" />
      <rect x="11" y="5" width="8" height="20" fill="#FFD93D" />
      <rect x="19" y="5" width="8" height="20" fill="#6BCB77" />
    </template>
    <template v-else-if="game === 'ladder'">
      <path d="M9 3v24M21 3v24M9 8h12M9 15h12M9 22h12" />
    </template>
    <template v-else-if="game === 'codebreak'">
      <circle cx="9" cy="9" r="4" fill="#FF6B6B" />
      <circle cx="21" cy="9" r="4" fill="#4D96FF" />
      <circle cx="9" cy="21" r="4" fill="#6BCB77" />
      <circle cx="21" cy="21" r="4" fill="#FFD93D" />
    </template>
  </svg>
</template>
