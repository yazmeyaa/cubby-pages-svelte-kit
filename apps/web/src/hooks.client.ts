import {pb} from '$lib/pocketbase'
import { setUser } from '$lib/stores/user'

pb.authStore.loadFromCookie(document.cookie)
pb.authStore.onChange(() => {
  setUser(pb.authStore.model)
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false })
})
