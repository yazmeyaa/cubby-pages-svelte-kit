import { writable } from "svelte/store";
import type { BaseModel } from 'pocketbase'

// logged app user
export const user = writable({});

export function setUser(model: BaseModel | null) {
    user.set(model || {});
}