import enCommon from './locales/en/common.json'
import enHome from './locales/en/home.json'
import enAuth from './locales/en/auth.json'

import ruCommon from './locales/ru/common.json'
import ruHome from './locales/ru/home.json'
import ruAuth from './locales/ru/auth.json'

import uaCommon from './locales/ua/common.json'
import uaHome from './locales/ua/home.json'
import uaAuth from './locales/ua/auth.json'

type Locale = 'en' | 'ru' | 'ua'

const messages = {
    en: {
        common: enCommon,
        auth: enAuth,
        home: enHome,
    },
    ru: {
        common: ruCommon,
        auth: ruAuth,
        home: ruHome,
    },
    ua: {
        common: uaCommon,
        auth: uaAuth,
        home: uaHome,
    }
} as const

export function t(
    locale: Locale,
    key: string,
    params: Record<string, string | number> = {}
) {
    const keys = key.split('.')
    let value: any = messages[locale] ?? messages.en

    for (const k of keys) {
        value = value?.[k]
    }

    if (typeof value !== 'string') return key

    return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{{${k}}}`, String(v)),
        value
    )
}
