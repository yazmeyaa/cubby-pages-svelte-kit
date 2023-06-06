import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const pb_auth = cookies.get('pb_auth')
    if(!pb_auth) return {auth: false}
    return {
        auth: true
    }
}) satisfies LayoutServerLoad;