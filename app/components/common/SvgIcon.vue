<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  width: { type: [Number, String], default: 24 },
  height: { type: [Number, String], default: 24 },
  class: { type: String, default: '' }
})
</script>

<template>
  <svg :width="width" :height="height"  aria-hidden="true" fill="currentColor">
    <use :href="`#icon-${props.name}`" />
  </svg>
</template>
