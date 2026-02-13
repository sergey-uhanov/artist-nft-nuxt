<script lang="ts" setup>
definePageMeta({
  layout: 'personal-account',
  middleware: ['auth', 'role'],
  role: ['CUSTOMER']
})
</script>

<template>
      <h1>orders</h1>

</template>

<style lang="scss">

</style>