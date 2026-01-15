
import { useThemeStore } from '@/stores/theme'

export default defineNuxtPlugin((nuxtApp) => {
    const store = useThemeStore()
    const themeCookie = useCookie<'light' | 'dark' | 'system'>('theme')

    if (themeCookie.value) {
        store.setTheme(themeCookie.value)
    }

    useHead({
        htmlAttrs: {
            'data-theme': store.theme === 'system'
                ? 'light'
                : store.theme
        }
    })
})
