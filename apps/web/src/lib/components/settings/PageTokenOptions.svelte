<script>
    import {pb as ApiClient} from "$lib/pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { pageTitle } from "$lib/stores/app";
    import { addSuccessToast } from "$lib/stores/toasts";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import SettingsSidebar from "$lib/components/settings/SettingsSidebar.svelte";

    import { _ } from "svelte-i18n";
    import { Column, Grid, NumberInput, Row, Button, Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";

    const tokensList = [
        { key: "recordAuthToken", label: "Auth record authentication token" },
        { key: "recordVerificationToken", label: "Auth record email verification token" },
        { key: "recordPasswordResetToken", label: "Auth record password reset token" },
        { key: "recordEmailChangeToken", label: "Auth record email change token" },
        { key: "adminAuthToken", label: "Admins auth token" },
        { key: "adminPasswordResetToken", label: "Admins password reset token" },
    ];

    $pageTitle = "Token options";

    let originalFormSettings = {};
    let formSettings = {};
    let isLoading = false;
    let isSaving = false;

    $: initialHash = JSON.stringify(originalFormSettings);

    $: hasChanges = initialHash != JSON.stringify(formSettings);

    loadSettings();

    async function loadSettings() {
        isLoading = true;

        try {
            const result = (await ApiClient.settings.getAll()) || {};
            initSettings(result);
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoading = false;
    }

    async function save() {
        if (isSaving || !hasChanges) {
            return;
        }

        isSaving = true;

        try {
            const result = await ApiClient.settings.update(CommonHelper.filterRedactedProps(formSettings));
            initSettings(result);
            addSuccessToast("Successfully saved tokens options.");
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isSaving = false;
    }

    function initSettings(data) {
        data = data || {};
        formSettings = {};

        for (const listItem of tokensList) {
            formSettings[listItem.key] = {
                duration: data[listItem.key]?.duration || 0,
            };
        }

        originalFormSettings = JSON.parse(JSON.stringify(formSettings));
    }

    function reset() {
        formSettings = JSON.parse(JSON.stringify(originalFormSettings || {}));
    }
</script>

<SettingsSidebar />

<PageWrapper>
    <header class="page-header">
        <Breadcrumb >
            <BreadcrumbItem>{$_("pageSettings.header.breadcrumbs.page")}</BreadcrumbItem>
            <BreadcrumbItem>{$_("pageSettings.tokens.header.breadcrumbs.title")}</BreadcrumbItem>
        </Breadcrumb>
    </header>

    <div>
        <form autocomplete="off" on:submit|preventDefault={save}>
            <div style="margin-left: 1rem;" class="content m-b-sm txt-xl">
                <p>{$_("pageSettings.tokens.pageDescription")}</p>
            </div>

            {#if isLoading}
                <div class="loader" />
            {:else}
                <Grid>
                    {#each tokensList as token (token.key)}
                        <Row style="padding-bottom: 1rem;" noGutterLeft>
                            <Column>
                                <Field name="{token.key}.duration" let:uniqueId>
                                    <NumberInput
                                        hideSteppers
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings[token.key].duration}
                                        label={$_(`pageSettings.tokens.tokensList.${token.key}`) +
                                            $_("pageSettings.tokens.field.duration")}
                                    />
                                    <div class="help-block">
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <span
                                            class="link-primary"
                                            class:txt-success={formSettings[token.key].secret}
                                            on:click={() => {
                                                // toggle
                                                if (formSettings[token.key].secret) {
                                                    delete formSettings[token.key].secret;
                                                    formSettings[token.key] = formSettings[token.key];
                                                } else {
                                                    formSettings[token.key].secret =
                                                        CommonHelper.randomString(50);
                                                }
                                            }}
                                        >
                                            {$_("pageSettings.tokens.field.invalidate")}
                                        </span>
                                    </div>
                                </Field>
                            </Column>
                        </Row>
                    {/each}
                    <Row condensed narrow >
                        <Column
                        noGutter
                            max={{
                                offset: 8,
                                span: 4,
                            }}
                            xlg={{
                                offset: 8,
                                span: 4,
                            }}
                            lg={{
                                offset: 8,
                                span: 4,
                            }}
                            md={{
                                offset: 2,
                                span: 2,
                            }}
                            sm={2}
                        >
                            {#if hasChanges}
                                <div class="cancel_button_container">
                                    <Button
                                        kind="secondary"
                                        type="button"
                                        disabled={isSaving}
                                        on:click={() => reset()}
                                    >
                                        {$_("cancel")}
                                    </Button>
                                </div>
                            {/if}
                        </Column>
                        <Column noGutterRight max={4} xlg={4} lg={4} md={4} sm={2}>
                                <Button
                                    type="submit"
                                    disabled={!hasChanges || isSaving}
                                    on:click={() => save()}
                                >
                                    {$_("saveChanges")}
                                </Button>
                        </Column>
                    </Row>
                </Grid>
            {/if}
        </form>
    </div>
</PageWrapper>

<style>
    .cancel_button_container {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: flex-end;
    }
</style>
