<script setup lang="ts">
withDefaults(defineProps<{ size?: number; fill?: string }>(), { size: 24, fill: '#FFFFFF' })
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :fill="fill"
    stroke="#1B1B1B"
    stroke-width="2"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 18h18l-1.6-10-5 4L12 5l-2.4 7-5-4z" />
  </svg>
</template>
