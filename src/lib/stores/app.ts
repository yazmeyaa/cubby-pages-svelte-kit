import { writable } from "svelte/store";

export const pageTitle = writable<string>('');

export const appName = writable<string>('');

export const hideControls = writable<boolean>(false);
