<script setup lang="ts">
import {accountMenuRecord} from '~/config/account-menu'
import type {Role} from "~~/generated/prisma/enums";
import SvgIcon from "~/components/common/SvgIcon.vue";
import ThemeSwitcher from "~/components/ui/ThemeSwitcher.vue";

const {t} = useI18n();
const localPath = useLocalePath()

const props = defineProps<{ role: Role }>()
</script>

<template>
  <div class="account-sidebar">
    <nav class="account-nav">
      <ul class="account-nav__list">
        <li v-for="item in accountMenuRecord[props.role]" :key="item.to" class="account-nav__list-item">
          <NuxtLink :to="localPath(item.to)" class="account-nav__item" active-class="account-nav__item_active">
            <svg-icon :name="`account-${item.icon}`" class-name="account-nav__item-icon"/>
            <svg-icon :name="`account-${item.activeIcon}`" class-name="account-nav__item-icon-active"/>
            {{ t(item.label) }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <ThemeSwitcher/>
  </div>
</template>

<style lang="scss">
.account-sidebar {
  display: flex;
  flex-direction: column;
}

.account-nav {
  flex: 1;

  &__list {
    margin-top: 33px;
  }

  &__list-item {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  &__item {
    font-weight: 400;
    font-size: 16px;
    line-height: 1.31;
    color: var(--secondary);
    display: flex;
    column-gap: 16px;


    &-icon-active {
      display: none;
    }

    &_active {
      color: var(--text);

      .account-nav__item-icon {
        display: none;
      }

      .account-nav__item-icon-active {
        color: var(--secondary-green);
        display: block;
      }
    }
  }


}
</style>
