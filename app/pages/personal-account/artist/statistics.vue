<script lang="ts" setup>
definePageMeta({
  layout: 'personal-account',
  middleware: ['auth', 'role'],
  role: ['ARTIST']
})
</script>

<template>
  <h1>Artist statistics</h1>

</template>

<style lang="scss">

</style>