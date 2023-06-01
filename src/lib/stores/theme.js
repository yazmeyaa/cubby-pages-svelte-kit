import {writable} from 'svelte/store'

export const theme = writable(localStorage.getItem('__carbon-theme') ?? 'white')