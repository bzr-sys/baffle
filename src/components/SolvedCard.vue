<script setup lang="ts">
import { ref } from 'vue'

/** Shown when a puzzle is done. `share` is the text players can post. */
const props = defineProps<{ title: string; detail: string; share: string; failed?: boolean }>()
const copied = ref(false)

async function copy() {
  const text = `${props.share}\n${window.location.origin}${import.meta.env.BASE_URL}`
  if (navigator.share) {
    await navigator.share({ text }).catch(() => undefined)
    return
  }
  await navigator.clipboard.writeText(text)
  copied.value = true
}
</script>

<template>
  <section
    class="card flex flex-col gap-3 p-4"
    :class="failed ? 'bg-locked' : 'bg-green'"
    aria-live="polite"
  >
    <div class="text-2xl font-extrabold">{{ title }}</div>
    <div class="text-base font-semibold">{{ detail }}</div>
    <button class="btn-ink" @click="copy">{{ copied ? 'Copied' : 'Share result' }}</button>
  </section>
</template>
