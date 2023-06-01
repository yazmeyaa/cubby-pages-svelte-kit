import { writable } from "svelte/store";
import type { Admin } from 'pocketbase';



// logged app admin
export const admin = writable<Admin>({} as Admin);

export function setAdmin(model: Admin | null) {
    admin.set(model ?? {} as Admin);
}