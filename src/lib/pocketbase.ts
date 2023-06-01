import { PUBLIC_BACKEND_URL } from '$env/static/public'
import PocketBase, { Admin, LocalAuthStore, BaseAuthStore, Record } from 'pocketbase'
import { writable } from 'svelte/store'
import { setAdmin } from "$lib/stores/admin";
import { goto } from '$app/navigation';
import { addErrorToast } from './stores/toasts';
import CommonHelper from './utils/CommonHelper';
import { setErrors } from './stores/errors';

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

export const pb = new AppPocketBase(PUBLIC_BACKEND_URL, new AppAuthStore("pb_admin_auth"))

export const currentUser = writable(pb.authStore.model)
