
import { useThemeStore } from '@/stores/theme'

export default defineNuxtPlugin(() => {
    const store = useThemeStore()
    const themeCookie = useCookie('theme')

    const applyTheme = () => {
        document.documentElement.dataset.theme = store.resolvedTheme
    }

    applyTheme()

    store.$subscribe(() => {
        themeCookie.value = store.theme
        applyTheme()
    })


    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', () => {
        if (store.theme === 'system') {
            applyTheme()
        }
    })
})
