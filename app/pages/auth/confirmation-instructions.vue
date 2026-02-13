<script lang="ts" setup>
const {t} = useI18n()
</script>

<template>
<h1 class="confirm-page">{{t('confirmation-instructions')}}</h1>

</template>

<style lang="scss">
.confirm-page{
  font-size: 32px;
  text-align: center;
  margin-top: 30px;
  color: var(--secondary);
}
</style>