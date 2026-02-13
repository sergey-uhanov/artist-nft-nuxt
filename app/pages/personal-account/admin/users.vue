<script lang="ts" setup="">
definePageMeta({
  layout: 'personal-account',
  middleware: ['auth', 'role'],
  role: ['ADMIN']
})
</script>

<template>
    <h1>  users</h1>

</template>

<style lang="scss">

</style>