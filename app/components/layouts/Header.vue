<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const session = useUserSession()
const localePath = useLocalePath()
const {locales, setLocale} = useI18n()


const themeStore = useThemeStore()

function toggle() {
  themeStore.setTheme(
      themeStore.theme === 'light' ? 'dark' : 'light'
  )
}

async function logout() {
  await session.clear()
  await navigateTo(localePath('/auth/login'), {replace: true})
}
</script>

<template>
  <nav
      class="flex items-center justify-between px-6 h-16 bg-neutral-900 text-white border-b border-neutral-800"
  >

    <NuxtLink :to="localePath('index')" class="text-lg font-semibold tracking-wide">
      OAuth app Nuxt
    </NuxtLink>

    <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="$switchLocalePath('ru')">Русский</NuxtLink>
    <NuxtLink :to="$switchLocalePath('ua')">Erhfbycrbq</NuxtLink>
    <button @click="toggle">
      {{ themeStore.theme }}
    </button>

    <h1>{{ $t('welcome') }}</h1>
    <AuthState v-slot="{ loggedIn }">
      <div class="flex items-center gap-4">
        <button
            v-if="loggedIn"
            @click="logout"
            class="px-4 py-2 text-sm font-medium rounded-md
                 bg-red-600 hover:bg-red-500
                 transition-colors duration-200"
        >
          Logout
        </button>

        <div class="" v-else>
          <NuxtLink

              :to="localePath('/auth/login')"
              class="px-4 py-2 mr-10 text-sm font-medium rounded-md
                 bg-indigo-600 hover:bg-indigo-500
                 transition-colors duration-200 "
          >
            Login
          </NuxtLink>

          <NuxtLink

              :to="localePath('/auth/register')"
              class="px-4 py-2 text-sm font-medium rounded-md
                 bg-indigo-600 hover:bg-indigo-500
                 transition-colors duration-200"
          >
            Registr
          </NuxtLink>
        </div>
      </div>
    </AuthState>
  </nav>
</template>

<style scoped>
</style>