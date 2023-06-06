import {pb} from '$lib/pocketbase'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // before
  pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')
  if (pb.authStore.isValid) {
    try {
      await pb.admins.authRefresh()
    } catch (_) {
      console.log('Auth error?')
      pb.authStore.clear()
    }
  }

  event.locals.pb = pb
  event.locals.user = structuredClone(pb.authStore.model)

  const response = await resolve(event)

  // after
  response.headers.set(
    'set-cookie',
    pb.authStore.exportToCookie({ httpOnly: false })
  )

  return response
}
