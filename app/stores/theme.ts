
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        theme: 'system' as Theme
    }),

    getters: {
        resolvedTheme: (state): 'light' | 'dark' => {
            if (state.theme !== 'system') return state.theme

            if (process.client) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light'
            }

            // SSR fallback
            return 'dark'
        }
    },

    actions: {
        setTheme(value: Theme) {
            this.theme = value
        }
    }
})
