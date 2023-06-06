import type { RequestHandler } from "./$types";
import { json } from '@sveltejs/kit'
import treeViewData from '$lib/data/files.json'

export const GET = (() => {
    return json(treeViewData)
}) satisfies RequestHandler