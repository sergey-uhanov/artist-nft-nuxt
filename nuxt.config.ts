import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import * as path from "node:path";

export default defineNuxtConfig({
    app: {
        pageTransition: {
            name: 'page',
            mode: 'out-in'
        }
    },
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/eslint', 'nuxt-auth-utils', '@nuxtjs/i18n', '@pinia/nuxt',],
    css: ['~/assets/scss/main.scss'],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "@/assets/scss/abstracts/variables" as *;
            @use "@/assets/scss/abstracts/mixins" as *;
          `
                }
            }
        },
        plugins: [
            createSvgIconsPlugin({
                iconDirs: [path.resolve(process.cwd(), 'app/assets/icons')],
                symbolId: 'icon-[name]',
                svgoOptions: true
            })
        ]
    },
    vue: {
        compilerOptions: {
            comments: true,
        },
    },
    runtimeConfig: {
        oauth: {
            github: {
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
            },
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        },
        session: {
            password: '',
            name: 'nau-session',
            cookie: {
                maxAge: 3600 * 24 * 7, // 7day
            }
        }
    },
    i18n: {
        defaultLocale: 'en',
        locales: [
            {code: 'en', file: 'en/common.json', language: 'English'},
            {code: 'ru', file: 'ru/common.json', language: 'Русский'},
            {code: 'ua', file: 'ua/common.json', language: 'Українська'},
            {code: 'en', file: 'en/auth.json', language: 'English'},
            {code: 'ru', file: 'ru/auth.json', language: 'Русский'},
            {code: 'ua', file: 'ua/auth.json', language: 'Українська'}
        ]
    },
    nitro: {
        storage: {
            session: {
                driver: 'redis',
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
                username: process.env.REDIS_USER,
                db: 0,
            },
        },
    },

})