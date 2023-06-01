import { writable } from "svelte/store";

export const tables = writable([]);
export const tables_collection = writable(null)
export const activeTable = writable(null);
export const isTablesLoading = writable(false);
