import { writable } from "svelte/store";
import type { BaseModel } from 'pocketbase'

// logged app admin
export const admin = writable({});

export function setAdmin(model: BaseModel | null) {
    admin.set(model || {});
}