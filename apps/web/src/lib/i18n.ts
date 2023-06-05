import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n'
import i18n, { type Config } from 'sveltekit-i18n'
import {browser} from '$app/environment'



import en from './locales/en.json'
import ru from './locales/ru.json'

addMessages('en', en)
addMessages('ru', ru)

export const LOCALSTORAGE_LOCALE_KEY = "locale"
const DEFAULT_LOCALE_VALUE = 'en'


function getLocaleFromLocalStorage() {
    return browser && localStorage.getItem(LOCALSTORAGE_LOCALE_KEY)
}


const localeSources = {
    localStorage: () => getLocaleFromLocalStorage(),
    navigator: () => getLocaleFromNavigator(),
} as const 

Object.freeze(localeSources)


function initLocale(): string {

    for (const localeSourceName in localeSources) {
        const string = localeSourceName as keyof typeof localeSources
        const localeSource = localeSources[string]();
        if (localeSource) return localeSource
    }

    return DEFAULT_LOCALE_VALUE
}

init({
    fallbackLocale: DEFAULT_LOCALE_VALUE,
    initialLocale: initLocale()
})


