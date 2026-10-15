<script setup lang="ts">
/** A sun (yellow disc) or a moon (dark crescent) */
defineProps<{ kind: 'S' | 'M'; size: number }>()
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      v-if="kind === 'S'"
      cx="12"
      cy="12"
      r="8"
      fill="#FFD93D"
      stroke="#1B1B1B"
      stroke-width="2.5"
    />
    <path
      v-else
      d="M15 3.5a9 9 0 1 0 5.5 14A7.5 7.5 0 0 1 15 3.5z"
      fill="#1B1B1B"
      stroke="#1B1B1B"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
</template>
