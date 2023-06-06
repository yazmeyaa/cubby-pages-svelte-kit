import { writable } from "svelte/store";
import type { Admin, BaseAuthStore } from 'pocketbase';



// logged app admin
export const admin = writable<Admin | null>({} as Admin);

export const auth = writable<BaseAuthStore | null>(null)

export function setAuth(authentication: BaseAuthStore) {
    auth.set(authentication)
}

export function setAdmin(model: Admin | null) {
    admin.set(model ?? {} as Admin);
}