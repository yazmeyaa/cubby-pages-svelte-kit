<script>
    import {pb as ApiClient} from "$lib/pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { pageTitle, appName, hideControls } from "$lib/stores/app";
    import { addSuccessToast } from "$lib/stores/toasts";
    import tooltip from "$lib/actions/tooltip";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import SettingsSidebar from "$lib/components/settings/SettingsSidebar.svelte";

    import { _ } from "svelte-i18n";
    import { Breadcrumb, BreadcrumbItem, Button, Column, Grid, Row, TextInput, Toggle } from "carbon-components-svelte";

    $pageTitle = "Application settings";

    let originalFormSettings = {};
    let formSettings = {};
    let isLoading = false;
    let isSaving = false;
    let initialHash = "";

    $: initialHash = JSON.stringify(originalFormSettings);

    $: hasChanges = initialHash != JSON.stringify(formSettings);

    loadSettings();

    async function loadSettings() {
        isLoading = true;

        try {
            const settings = (await ApiClient.settings.getAll()) || {};
            init(settings);
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
            const settings = await ApiClient.settings.update(CommonHelper.filterRedactedProps(formSettings));
            init(settings);
            addSuccessToast("Successfully saved application settings.");
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isSaving = false;
    }

    function init(settings = {}) {
        $appName = settings?.meta?.appName;
        $hideControls = !!settings?.meta?.hideControls;

        formSettings = {
            meta: settings?.meta || {},
            logs: settings?.logs || {},
        };

        originalFormSettings = JSON.parse(JSON.stringify(formSettings));
    }

    function reset() {
        formSettings = JSON.parse(JSON.stringify(originalFormSettings || {}));
    }
</script>

<SettingsSidebar />

<PageWrapper>
    <header style="display: flex; align-items: center; height: 40px;margin-left: 1rem; box-sizing:border-box;">
        <Breadcrumb>
            <BreadcrumbItem>{$_("pageSettings.header.breadcrumbs.page")}</BreadcrumbItem>
            <BreadcrumbItem>{$_("pageSettings.application.header.breadcrumbs.title")}</BreadcrumbItem>
        </Breadcrumb>
        <!-- <nav >
            <div class="breadcrumb-item">{$_("pageSettings.header.breadcrumbs.page")}</div>
            <div class="breadcrumb-item">{$_("pageSettings.application.header.breadcrumbs.title")}</div>
        </nav> -->
    </header>

    <div>
        <form autocomplete="off" on:submit|preventDefault={save}>
            {#if isLoading}
                <div class="loader" />
            {:else}
                <Grid>
                    <Row noGutterLeft >
                        <Column max={8} xlg={8} lg={8} md={4} sm={2}>
                            <Field name="meta.appName" let:uniqueId>
                                <TextInput
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.meta.appName}
                                    labelText={$_("pageSettings.field.applicationName")}
                                />
                            </Field>
                        </Column>
                        <Column max={8} xlg={8} lg={8} md={4} sm={2}>
                            <Field name="meta.appUrl" let:uniqueId>
                                <TextInput
                                    labelText={$_("pageSettings.field.applicationUrl")}
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.meta.appUrl}
                                />
                            </Field>
                        </Column>
                    </Row>
                    <Row noGutterLeft padding>
                        <Column>
                            <Field name="logs.maxDays" let:uniqueId>
                                <TextInput
                                    labelText={$_("pageSettings.field.logsRentetion")}
                                    type="number"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.logs.maxDays}
                                />
                            </Field>
                        </Column>
                    </Row>
                    <Row padding noGutterLeft>
                        <Column padding>
                            <Field name="meta.hideControls" let:uniqueId>
                                <Toggle
                                    labelText={$_("pageSettings.field.hideControl")}
                                    id={uniqueId}
                                    bind:checked={formSettings.meta.hideControls}
                                >
                                    <svelte:fragment slot="labelText">
                                        <span>{$_("pageSettings.field.hideControl")}</span>
                                        <i
                                            class="ri-information-line link-hint"
                                            use:tooltip={{
                                                text: $_("pageSettings.field.hideControl.description"),
                                                position: "right",
                                            }}
                                        />
                                    </svelte:fragment>
                                </Toggle>
                            </Field>
                        </Column>
                    </Row>
                    <Row>
                        <Column
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
                        <Column max={4} xlg={4} lg={4} md={4} sm={2}>
                            <Button
                                style="width: 100%"
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
