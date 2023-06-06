<script>
    import { link, replace, querystring } from "svelte-spa-router";
    import FullPage from "$lib/components/base/FullPage.svelte";
    import {pb as ApiClient} from "$lib/pocketbase";
    import Field from "$lib/components/base/Field.svelte";
    import { addErrorToast, removeAllToasts } from "$lib/stores/toasts";
    import CommonHelper from "$lib/utils/CommonHelper";

    import { Button, Link, TextInput } from "carbon-components-svelte";
    import ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";

    import { _ } from "svelte-i18n";

    const queryParams = new URLSearchParams($querystring);

    let email = queryParams.get("demoEmail") || "";
    let password = queryParams.get("demoPassword") || "";
    let isLoading = false;

    function login() {
        if (isLoading) {
            return;
        }

        isLoading = true;

        return ApiClient.admins
            .authWithPassword(email, password)
            .then(() => {
                removeAllToasts();
                replace("/");
            })
            .catch(() => {
                addErrorToast("Invalid login credentials.");
            })
            .finally(() => {
                isLoading = false;
            });
    }
</script>

<FullPage>
    <form class="form_container" on:submit|preventDefault={login}>
        <div class="content txt-center m-b-base">
            <h1>{$_("pageAdminLogin.title")}</h1>
        </div>

        <Field name="identity" let:uniqueId>
            <TextInput
                labelText={CommonHelper.textCapitalize($_("email"))}
                type="email"
                id={uniqueId}
                bind:value={email}
                required
                autofocus
            />
        </Field>

        <Field name="password required" let:uniqueId>
            <TextInput
                labelText={CommonHelper.textCapitalize($_("password"))}
                type="password"
                id={uniqueId}
                bind:value={password}
                required
            >
            </TextInput>
            <div class="help-block">
                <Link href="/request-password-reset" on:click={(event) => {
                    event.preventDefault()
                    replace('/request-password-reset')
                    }}>
                    {CommonHelper.textCapitalize($_("forgotPassword"))}
                </Link>
            </div>
        </Field>

        <Button  disabled={isLoading} type="submit" icon={ArrowRight} style="width: fit-content; align-self: center;">
            {CommonHelper.textCapitalize($_("login"))}
        </Button>
    </form>
</FullPage>

<style>
    .form_container {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
</style>
