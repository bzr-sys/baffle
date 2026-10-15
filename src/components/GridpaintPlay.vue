<script setup lang="ts">
import { ref } from 'vue'
import GridpaintBoard from './GridpaintBoard.vue'
import PaintModeToggle from './PaintModeToggle.vue'

/** Gridpaint board with its Fill / Mark empty switch */
defineProps<{ rows: string[]; locked?: boolean }>()
const emit = defineEmits<{ solved: [] }>()
const mode = ref<'fill' | 'x'>('fill')
</script>

<template>
  <GridpaintBoard :rows="rows" :mode="mode" :locked="locked" @solved="emit('solved')" />
  <PaintModeToggle v-if="!locked" v-model="mode" />
</template>
