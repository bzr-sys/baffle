<script setup lang="ts">
/** A solved Gridpaint picture, small */
defineProps<{ rows: string[]; color: string }>()
</script>

<template>
  <div
    class="grid h-[55px] w-[55px] gap-px"
    :style="{ gridTemplateColumns: `repeat(${rows[0]!.length}, minmax(0, 1fr))` }"
    aria-hidden="true"
  >
    <template v-for="(row, r) in rows" :key="r">
      <div
        v-for="(cell, c) in row"
        :key="c"
        class="rounded-[2px]"
        :style="{ background: cell === '#' ? color : '#F1F1F1' }"
      ></div>
    </template>
  </div>
</template>
