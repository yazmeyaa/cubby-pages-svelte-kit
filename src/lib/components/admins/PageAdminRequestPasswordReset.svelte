<script>
    import { link, replace } from "svelte-spa-router";
    import ApiClient from "$lib/utils/ApiClient";
    import FullPage from "$lib/components/base/FullPage.svelte";
    import Field from "$lib/components/base/Field.svelte";

    import { Button, Link, TextInput } from "carbon-components-svelte";
    import Email from "carbon-icons-svelte/lib/Email.svelte";
    
    import { _ } from "svelte-i18n";

    let email = "";
    let isLoading = false;
    let success = false;

    async function submit() {
        if (isLoading) {
            return;
        }

        isLoading = true;

        try {
            await ApiClient.admins.requestPasswordReset(email);
            success = true;
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoading = false;
    }
</script>

<FullPage>
    {#if success}
        <div class="alert alert-success">
            <div class="icon"><i class="ri-checkbox-circle-line" /></div>
            <div class="content">
                
                <p> {@html $_('padgeAdminLogin.resetPassword.successMessage', {
                    values: {
                        mail: `<strong class="txt-nowrap">${email}</strong>`
                    }
                })}</p>
            </div>
        </div>
    {:else}
        <form class="form_container" on:submit|preventDefault={submit}>
            <div class="content txt-center">
                <h4 class="m-b-xs">{$_("padgeAdminLogin.resetPassword.title")}</h4>
                <p>{$_("padgeAdminLogin.resetPassword.description")}</p>
            </div>

            <Field name="email" let:uniqueId>
                <!-- <label for={uniqueId}>Email</label> -->
                <!-- svelte-ignore a11y-autofocus -->
                <!-- <input type="email" id={uniqueId} required autofocus bind:value={email} /> -->
                <TextInput
                    labelText="Email"
                    type="email"
                    id={uniqueId}
                    required
                    autofocus
                    bind:value={email}
                />
            </Field>

            <!-- <button
                type="submit"
                class="pb-btn btn-lg pb-btn-block"
                class:btn-loading={isLoading}
                disabled={isLoading}
            >
                <i class="ri-mail-send-line" />
                <span class="txt">Send recovery link</span>
            </button> -->
            <Button style="width: fit-content; align-self: center;" icon={Email} type="submit" disabled={isLoading}>{$_('padgeAdminLogin.resetPassword.sendRecoveryLink')}</Button>
        </form>
    {/if}

    <div class="content txt-center">
        <!-- <a href="/login" class="link-hint" use:link>Back to login</a> -->
        <Link style="margin-top: 1rem;" href="/login" on:click={event => {
            event.preventDefault()
            replace('/login')
        }}> {$_('padgeAdminLogin.resetPassword.backToLogin')} </Link>
    </div>
</FullPage>

<style>
    .form_container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>
