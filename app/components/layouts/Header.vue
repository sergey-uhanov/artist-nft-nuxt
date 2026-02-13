<script setup lang="ts">
import SvgIcon from "~/components/common/SvgIcon.vue";
import LanguagesSwitcher from "~/components/ui/LanguagesSwitcher.vue";
import BaseButton from "~/components/ui/BaseButton.vue";
import {ref} from 'vue'
import BurgerButton from "~/components/layouts/ui/BurgerButton.vue";
import {accountMenuRecord} from "~/config/account-menu";

const {loggedIn, fetch, session} = useUserSession()
const localePath = useLocalePath()
const isMenuOpen = ref(false)
fetch()


const urlFirstTubRole = () : string =>{
  if(!session.value?.user) return ''
  const role = session.value.user.role
  return  accountMenuRecord[role][0]!.to
}

</script>

<template>
  <header :class="header.header">
    <div :class="[ header.container,'container']">
      <AuthState>
        <SvgIcon name="logo" width="161" height="46" :class="header.mainLogo"/>
        <div :class="header.burgerWrapper">
          <BurgerButton v-model:is-open="isMenuOpen"/>
        </div>
        <nav :class="header.navDesktop">
          <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/')">
            Main page
          </NuxtLink>
          <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/catalog/nft')">Nft</NuxtLink>
          <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/catalog/picture')">Picture</NuxtLink>
        </nav>

        <LanguagesSwitcher :class="header.langSwitcher"/>

        <div v-if="loggedIn" :class="header.accountWrapper">
            <NuxtLink :class="header.account" :to="localePath(urlFirstTubRole())">
            <NuxtImg v-if="session!.user!.img" :src="session!.user!.img" :class="header.userPicture"/>

            <SvgIcon v-else name="user-circle" width="34" height="34" :class="header.userIcon"/>
          </NuxtLink>
        </div>

        <div v-else :class="header.auth">
          <NuxtLink :to="localePath('/auth/login')">
            <BaseButton variant="secondary">
              Authorization
            </BaseButton>
          </NuxtLink>
        </div>
      </AuthState>

      <Teleport to="#teleports">
        <div @click="isMenuOpen = false" :class="[header.overlay, isMenuOpen ? header.overlayOpen: null]">
          <nav @click.stop :class="[header.navMobile, isMenuOpen ? header.navMobileOpen: null]">
            <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/')">
              Main page
            </NuxtLink>
            <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/1')">Nft</NuxtLink>
            <NuxtLink :active-class="header.activeLink" :class="header.navItem" :to="localePath('/2')">Picture
            </NuxtLink>
          </nav>
        </div>
      </Teleport>
    </div>
  </header>
</template>

<style lang="scss" module="header">

.header {
  padding: 10px 0;
}

.container {
  display: flex;
  align-items: center;
}

.mainLogo {
  margin-right: 20px;
  position: relative;
  z-index: 20;
}

.navDesktop {
  display: flex;
  color: var(--secondary);
  width: 100%;
  gap: 16px;

  @include media-breakpoint-down-equal(sm) {
    display: none;
  }
}

.overlay {
  position: fixed;
  background-color: var(--overlay);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.overlayOpen {
  opacity: 1;
  z-index: 10;
}

.navMobile {
  position: absolute;
  padding: 70px 40px 10px 50px;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 1;
  transform: rotate(90deg);
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: bottom;
  z-index: 11;

  @include media-breakpoint-up-equal(sm) {
    display: none;
  }
}

.navMobileOpen {
  opacity: 1;
  transform: rotate(0);
}

.navItem {
  padding: 5px 10px;
  border-radius: 5px;
}


.activeLink {
  background: var(--background-secondary-button);
}

.userPicture {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
}

.langSwitcher {
  margin-right: 20px;
}

.accountWrapper {
  padding: 5px 10px;
  background: rgba(71, 88, 133, 0.47);
  border-radius: 15px;
}

.account {
  display: grid;
  grid-template-columns:34px;
  gap: 16px;
}

.userIcon {
  color: var(--color-text);
}

.burgerWrapper {
  flex: 1;
  @include media-breakpoint-up-equal(sm) {
    display: none;
  }
}

</style>
