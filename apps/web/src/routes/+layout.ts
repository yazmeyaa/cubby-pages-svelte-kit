import type {LayoutLoad} from './$types'
import { pb } from '$lib/pocketbase'

export const load = (async () => {
    const isValid = pb.authStore.isValid
    return {auth: isValid}
}) satisfies LayoutLoad