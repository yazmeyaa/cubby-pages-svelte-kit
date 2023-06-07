import { writable } from "svelte/store";

export const pivots = writable([]);
export const pivots_collection = writable(null)
export const activePivot = writable(null);
export const isPivotsLoading = writable(false);
