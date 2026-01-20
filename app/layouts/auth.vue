<script lang="ts" setup>
import BaseSelect from "~/components/ui/BaseSelect.vue";
import ThemeSwitcher from "~/components/ui/ThemeSwitcher.vue";

const {locales, setLocale, locale} = useI18n()
const languages = locales.value.map((lang) => lang.code)
type Language = typeof languages[number]

const activeLang = ref<Language>(locale.value)


function onLangChange() {
  setLocale(activeLang.value)
}
</script>

<template>
<div>
  <header class="header-auth">
    <BaseSelect
        v-model="activeLang"
        :items="languages"
        variant="outlined"
        @change="onLangChange"
    />
    <div class="switcher-wrapper">
      <ThemeSwitcher/>
    </div>
  </header>

  <slot/>
</div>

</template>

<style lang="scss">
.header-auth{
  display: flex;
  justify-content: space-between;
  width: calc(100% - 30px);
  padding: 20px;
}


.switcher-wrapper {
  width: 30px;
}

</style>