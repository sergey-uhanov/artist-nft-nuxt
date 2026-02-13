<script lang="ts" setup="">
import BaseSelect from "~/components/ui/BaseSelect.vue";

const {locales, setLocale, locale} = useI18n()
const languages = locales.value.map((lang) => lang.code)
type Language = typeof languages[number]

const activeLang = ref<Language>(locale.value)


function onLangChange() {
  setLocale(activeLang.value)
}

</script>

<template>
  <BaseSelect
      v-model="activeLang"
      :items="languages"
      variant="outlined"
      @change="onLangChange"
  />

</template>

<style lang="scss">

</style>