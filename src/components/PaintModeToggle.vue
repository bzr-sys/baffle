<script setup lang="ts">
/** Whether a Gridpaint tap fills a cell or marks it empty */
const mode = defineModel<'fill' | 'x'>({ required: true })
</script>

<template>
  <div class="flex gap-2 self-center" role="group" aria-label="Paint mode">
    <button
      class="btn-outline h-11 text-base"
      :class="{ 'bg-ink text-white': mode === 'fill' }"
      :aria-pressed="mode === 'fill'"
      @click="mode = 'fill'"
    >
      Fill
    </button>
    <button
      class="btn-outline h-11 text-base"
      :class="{ 'bg-ink text-white': mode === 'x' }"
      :aria-pressed="mode === 'x'"
      @click="mode = 'x'"
    >
      Mark empty
    </button>
  </div>
</template>
