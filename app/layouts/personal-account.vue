<script setup lang="ts">
import SvgIcon from "~/components/common/SvgIcon.vue";
import AccountSidebar from "~/components/layouts/AccountSidebar.vue";
import type {Role} from "~~/generated/prisma/enums";

const session = useUserSession()
const localePath = useLocalePath()
const {t} = useI18n()
const role = session.user.value?.role as Role
const userName = session.user.value?.name

async function logout() {
  await session.clear()
  await navigateTo(localePath('/auth/login'), {replace: true})
}
</script>

<template>
  <div class="personal-account">
    <header class="personal-account-header">
      <div class="personal-account-header__container">
        <NuxtLink :to="localePath('/')" class="personal-account-link__logo">
          <SvgIcon name="logo" width="161" height="46" class="personal-account-link__login-icon"/>
        </NuxtLink>
{{userName}}
        <div class="personal-account-header__logout" @click="logout">
          <svg-icon name="log-out" class="personal-account-link__logout-icon"/>
          {{ t('logout') }}
        </div>
      </div>
    </header>

    <div class="account-body">
      <div class="account-body__container">
        <AccountSidebar :role="role" class="account-body__sidebar"/>
        <main class="account-body__main">
          <slot/>
        </main>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
.personal-account-header {


  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  &__logout {
    display: flex;
    align-items: center;
    column-gap: 14px;
    font-family: var(--second-family), sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.35;
    color: var(--secondary);
    margin-right: 27px;
    cursor: pointer;
  }
}

.account-body {

  &__container {
    display: flex;
  }

  &__sidebar {
    min-width: 245px;
  }

  &__main {
    background: var(--frames);
    flex: 1;
    border-radius: 32px;
    height: calc(100vh - 64px);
  }
}
</style>