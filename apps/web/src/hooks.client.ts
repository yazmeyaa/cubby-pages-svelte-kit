import { pb } from '$lib/pocketbase'
import { setAdmin, setAuth } from '$lib/stores/admin'
import type { Admin } from 'pocketbase'


pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {
  setAuth(pb.authStore)
  setAdmin(pb.authStore.model as Admin ?? null)
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
})
