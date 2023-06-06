import type { PageLoad } from "./$types";
import treeViewData from '$lib/data/files.json'

export const load = (async () => {
    return { treeViewData }
}) satisfies PageLoad