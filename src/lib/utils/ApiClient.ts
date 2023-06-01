import PocketBase, { LocalAuthStore, Admin } from "pocketbase";
import { PUBLIC_BACKEND_URL } from '$env/static/public'
// ---
import CommonHelper from "$lib/utils/CommonHelper";
import { goto } from '$app/navigation'
import { addErrorToast } from "$lib/stores/toasts";
import { setErrors } from "$lib/stores/errors";
import { setAdmin } from "$lib/stores/admin";
import type { BaseAuthStore, ClientResponseError, Record } from 'pocketbase'


interface AppPocketBaseInterface extends PocketBase {
    /**
     * Clears the authorized state and redirects to the login page.
     *
     * @param {Boolean} [redirect] Whether to redirect to the login page.
     */
    logout: (redirect: boolean) => void
    /**
     * Generic API error response handler.
     *
     * @param  {Error}   err        The API error itself.
     * @param  {Boolean} notify     Whether to add a toast notification.
     * @param  {String}  defaultMsg Default toast notification message if the error doesn't have one.
     */
    errorResponseHandler: (err: ExtendedError, notify?: boolean, defaultMsg?: string) => any
}

interface ExtendedError extends Error {
    isAbort: boolean,
    status: number,
    data: { 
        message: string
        data: object
     }
}


class AppPocketBase extends PocketBase implements AppPocketBaseInterface {
    constructor(baseUrl?: string | undefined, authStore?: BaseAuthStore | null | undefined, lang?: string | undefined) {
        super(baseUrl, authStore, lang)
    }

    logout(redirect = true) {
        this.authStore.clear();

        if (redirect) {
            goto('/login');
        }
    }



    errorResponseHandler(err: ExtendedError, notify = true, defaultMsg = '') {
        if (!err || !(err instanceof Error) || err.isAbort) {
            return;
        }
        const statusCode = (err?.status << 0) || 400;
        const responseData = err?.data || {};

        // add toast error notification
        if (
            notify &&          // notifications are enabled
            statusCode !== 404 // is not 404
        ) {
            const msg = responseData.message || err.message || defaultMsg;
            if (msg) {
                addErrorToast(msg);
            }
        }

        // populate form field errors
        if (!CommonHelper.isEmpty(responseData.data)) {
            setErrors(responseData.data);
        }

        // unauthorized
        if (statusCode === 401) {
            this.cancelAllRequests();
            return this.logout();
        }

        // forbidden
        if (statusCode === 403) {
            this.cancelAllRequests();
            return goto('/');
        }
    }
}


// Custom auth store to sync the svelte admin store state with the authorized admin instance.
class AppAuthStore extends LocalAuthStore {
    /**
     * @inheritdoc
     */
    save(token: string, model: Admin | Record | null) {
        super.save(token, model);

        if (model instanceof Admin) {
            setAdmin(model);
        }
    }

    /**
     * @inheritdoc
     */
    clear() {
        super.clear();

        setAdmin(null);
    }
}


const client = new AppPocketBase(
    import.meta.env.PUBLIC_BACKEND_URL,
    new AppAuthStore("pb_admin_auth")
);



if (client.authStore.model instanceof Admin) {
    setAdmin(client.authStore.model);
}

export default client;
