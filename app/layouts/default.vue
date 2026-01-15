<script setup lang="ts">

 import Header from "~/components/layouts/Header.vue";

const session = useUserSession()
const localePath = useLocalePath()
const {locales, setLocale} = useI18n()

async function logout() {
  await session.clear()
  await navigateTo(localePath('/auth/login'), {replace: true})
}
</script>

<template>
 <Header/>

  <slot/>
</template>

<style >

</style>