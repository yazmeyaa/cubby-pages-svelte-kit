<script>
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import ApiClient from "$lib/utils/ApiClient";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { pageTitle } from "$lib/stores/app";
    import { setErrors } from "$lib/stores/errors";
    import { removeAllToasts, addWarningToast, addSuccessToast } from "$lib/stores/toasts";
    import tooltip from "$lib/actions/tooltip";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import RedactedPasswordInput from "$lib/components/base/RedactedPasswordInput.svelte";
    import SettingsSidebar from "$lib/components/settings/SettingsSidebar.svelte";

    import { _ } from "svelte-i18n";
    import {
        Breadcrumb,
        BreadcrumbItem,
        Button,
        Checkbox,
        Column,
        Grid,
        Loading,
        Row,
        SkeletonPlaceholder,
        TextInput,
        Tile,
    } from "carbon-components-svelte";
    import Information from "carbon-icons-svelte/lib/Information.svelte";

    $pageTitle = "Files storage";

    const testRequestKey = "s3_test_request";

    let originalFormSettings = {};
    let formSettings = {};
    let isLoading = false;
    let isSaving = false;
    let isTesting = false;
    let testS3Error = null;
    let testS3TimeoutId = null;

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
            ApiClient.cancelRequest(testRequestKey);
            const settings = await ApiClient.settings.update(CommonHelper.filterRedactedProps(formSettings));
            setErrors({});

            await init(settings);

            removeAllToasts();

            if (testS3Error) {
                addWarningToast("Successfully saved but failed to establish S3 connection.");
            } else {
                addSuccessToast("Successfully saved files storage settings.");
            }
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isSaving = false;
    }

    async function init(settings = {}) {
        formSettings = {
            s3: settings?.s3 || {},
        };
        originalFormSettings = JSON.parse(JSON.stringify(formSettings));

        await testS3();
    }

    async function reset() {
        formSettings = JSON.parse(JSON.stringify(originalFormSettings || {}));

        await testS3();
    }

    async function testS3() {
        testS3Error = null;

        if (!formSettings.s3.enabled) {
            return; // nothing to test
        }

        // auto cancel the test request after 30sec
        ApiClient.cancelRequest(testRequestKey);
        clearTimeout(testS3TimeoutId);
        testS3TimeoutId = setTimeout(() => {
            ApiClient.cancelRequest(testRequestKey);
            addErrorToast("S3 test connection timeout.");
        }, 30000);

        isTesting = true;

        try {
            await ApiClient.settings.testS3({ $cancelKey: testRequestKey });
        } catch (err) {
            testS3Error = err;
        }

        isTesting = false;
        clearTimeout(testS3TimeoutId);
    }

    onMount(() => {
        return () => {
            clearTimeout(testS3TimeoutId);
        };
    });
</script>

<SettingsSidebar />

<PageWrapper>
    <header class="page-header">
        <Breadcrumb>
            <BreadcrumbItem>{$_("pageSettings.header.breadcrumbs.page")}</BreadcrumbItem>
            <BreadcrumbItem>{$_("pageSettings.storage.header.breadcrumbs.title")}</BreadcrumbItem>
        </Breadcrumb>
    </header>

    <div>
        <form autocomplete="off" on:submit|preventDefault={() => save()}>
            <Grid>
                <Row padding noGutterLeft>
                    <Column>
                        <div class="content txt-xl m-b-base">
                            <p>{$_("pageSettings.storage.pageDescription1")}</p>
                            <p>
                                {$_("pageSettings.storage.pageDescription2")}
                            </p>
                        </div>
                    </Column>
                </Row>
                {#if isLoading}
                    <Row>
                        <Column>
                            <Loading />
                        </Column>
                    </Row>
                {:else}
                    <Row noGutterLeft>
                        <Column>
                            <Field let:uniqueId>
                                <Checkbox
                                    id={uniqueId}
                                    labelText={$_("pageSettings.storage.useS3")}
                                    required
                                    bind:checked={formSettings.s3.enabled}
                                />
                            </Field>
                        </Column>
                    </Row>
                    {#if originalFormSettings.s3?.enabled != formSettings.s3.enabled}
                        <Row noGutterLeft padding>
                            <Column>
                                <Tile>
                                    <div class="notification_content">
                                        <Information width="24px" height="24px" />
                                        <span>
                                            {$_("pageSettings.s3tip1")}
                                            <strong>
                                                {originalFormSettings.s3?.enabled
                                                    ? "S3 storage"
                                                    : "local file system"}
                                            </strong>
                                            {$_("pageSettings.s3tip2")}
                                            <strong
                                                >{formSettings.s3.enabled
                                                    ? "S3 storage"
                                                    : "local file system"}</strong
                                            >.
                                            <br />
                                            {$_("pageSettings.s3tip3")}
                                            <a
                                                href="https://github.com/rclone/rclone"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="txt-bold"
                                            >
                                                rclone
                                            </a>,
                                            <a
                                                href="https://github.com/peak/s5cmd"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="txt-bold"
                                            >
                                                s5cmd
                                            </a>, etc.
                                        </span>
                                    </div>
                                </Tile>
                            </Column>
                        </Row>
                    {/if}
                    {#if formSettings.s3.enabled}
                        <Row noGutterLeft padding>
                            <Column>
                                <Field name="s3.endpoint" let:uniqueId>
                                    <TextInput
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.s3.endpoint}
                                        labelText="Endpoint"
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="s3.bucket" let:uniqueId>
                                    <TextInput
                                        labelText="Bucket"
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.s3.bucket}
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="s3.region" let:uniqueId>
                                    <TextInput
                                        labelText="Region"
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.s3.region}
                                    />
                                </Field>
                            </Column>
                        </Row>
                        <Row noGutterLeft padding>
                            <Column>
                                <Field name="s3.accessKey" let:uniqueId>
                                    <TextInput
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.s3.accessKey}
                                        labelText="Access key"
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="s3.secret" let:uniqueId>
                                    <TextInput
                                        type="password"
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.s3.secret}
                                        labelText="Secret"
                                    />
                                </Field>
                            </Column>
                        </Row>
                        <Row noGutterLeft>
                            <Column>
                                <Field name="s3.forcePathStyle" let:uniqueId>
                                    <Checkbox id={uniqueId} bind:checked={formSettings.s3.forcePathStyle}>
                                        <svelte:fragment slot="labelText">
                                            <span class="txt">{$_("pageSettings.forcePathStyle")}</span>
                                            <i
                                                class="ri-information-line link-hint"
                                                use:tooltip={{
                                                    text: $_("pageSettings.forcePathStyle.description"),
                                                    position: "top",
                                                }}
                                            />
                                        </svelte:fragment>
                                    </Checkbox>
                                </Field>
                            </Column>
                        </Row>
                    {/if}
                    <Row noGutterLeft>
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
                                    <Button kind="secondary" disabled={isSaving} on:click={() => reset()}>
                                        {$_("cancel")}
                                    </Button>
                                </div>
                            {/if}
                        </Column>
                        <Column max={4} xlg={4} lg={4} md={4} sm={2}>
                            <Button type="submit" disabled={!hasChanges || isSaving} on:click={() => save()}>
                                {$_("saveChanges")}
                            </Button>
                        </Column>
                    </Row>
                {/if}
            </Grid>

            <!--<div class="content txt-xl m-b-base">
                <p>{$_("pageSettings.storage.pageDescription1")}</p>
                <p>
                    {$_("pageSettings.storage.pageDescription2")}
                </p>
            </div> -->

            {#if isLoading}
                <div class="loader" />
            {:else}
                <!-- <Field class="form-field form-field-toggle" let:uniqueId>
                    <input type="checkbox" id={uniqueId} required bind:checked={formSettings.s3.enabled} />
                    <label for={uniqueId}>{$_("pageSettings.storage.useS3")}</label>
                </Field> -->

                {#if originalFormSettings.s3?.enabled != formSettings.s3.enabled}
                    <!-- <div transition:slide|local={{ duration: 150 }}>
                        <div class="alert alert-warning m-0">
                            <div class="icon">
                                <i class="ri-error-warning-line" />
                            </div>
                            <div class="content">
                                {$_("pageSettings.s3tip1")}
                                <strong>
                                    {originalFormSettings.s3?.enabled ? "S3 storage" : "local file system"}
                                </strong>
                                {$_("pageSettings.s3tip2")}
                                <strong>{formSettings.s3.enabled ? "S3 storage" : "local file system"}</strong
                                >.
                                <br />
                                {$_("pageSettings.s3tip3")}
                                <a
                                    href="https://github.com/rclone/rclone"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="txt-bold"
                                >
                                    rclone
                                </a>,
                                <a
                                    href="https://github.com/peak/s5cmd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="txt-bold"
                                >
                                    s5cmd
                                </a>, etc.
                            </div>
                        </div>
                        <div class="clearfix" />
                    </div> -->
                {/if}

                {#if formSettings.s3.enabled}
                    <div class="grid" transition:slide|local={{ duration: 150 }}>
                        <div class="col-lg-6">
                            <!-- <Field class="form-field required" name="s3.endpoint" let:uniqueId>
                                <label for={uniqueId}>Endpoint</label>
                                <input
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.s3.endpoint}
                                />
                            </Field> -->
                        </div>
                        <div class="col-lg-3">
                            <!-- <Field class="form-field required" name="s3.bucket" let:uniqueId>
                                <label for={uniqueId}>Bucket</label>
                                <input
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.s3.bucket}
                                />
                            </Field> -->
                        </div>
                        <div class="col-lg-3">
                            <!-- <Field class="form-field required" name="s3.region" let:uniqueId>
                                <label for={uniqueId}>Region</label>
                                <input
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.s3.region}
                                />
                            </Field> -->
                        </div>
                        <div class="col-lg-6">
                            <!-- <Field class="form-field required" name="s3.accessKey" let:uniqueId>
                                <label for={uniqueId}>Access key</label>
                                <input
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.s3.accessKey}
                                />
                            </Field> -->
                        </div>
                        <div class="col-lg-6">
                            <!-- <Field class="form-field required" name="s3.secret" let:uniqueId>
                                <label for={uniqueId}>Secret</label>
                                <RedactedPasswordInput
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.s3.secret}
                                />
                            </Field> -->
                        </div>
                        <div class="col-lg-12">
                            <!-- <Field class="form-field" name="s3.forcePathStyle" let:uniqueId>
                                <input
                                    type="checkbox"
                                    id={uniqueId}
                                    bind:checked={formSettings.s3.forcePathStyle}
                                />
                                <label for={uniqueId}>
                                    <span class="txt">{$_("pageSettings.forcePathStyle")}</span>
                                    <i
                                        class="ri-information-line link-hint"
                                        use:tooltip={{
                                            text: $_("pageSettings.forcePathStyle.description"),
                                            position: "top",
                                        }}
                                    />
                                </label>
                            </Field> -->
                        </div>
                        <!-- margin helper -->
                        <div class="col-lg-12" />
                    </div>
                {/if}

                <div class="flex">
                    <div class="flex-fill" />

                    {#if formSettings.s3?.enabled && !hasChanges && !isSaving}
                        {#if isTesting}
                            <span class="loader loader-sm" />
                        {:else if testS3Error}
                            <div
                                class="label label-sm label-warning entrance-right"
                                use:tooltip={testS3Error.data?.message}
                            >
                                <i class="ri-error-warning-line txt-warning" />
                                <span class="txt">Failed to establish S3 connection</span>
                            </div>
                        {:else}
                            <div class="label label-sm label-success entrance-right">
                                <i class="ri-checkbox-circle-line txt-success" />
                                <span class="txt">S3 connected successfully</span>
                            </div>
                        {/if}
                    {/if}

                    <!-- {#if hasChanges}
                        <button
                            type="button"
                            class="pb-btn pb-btn-transparent btn-hint"
                            disabled={isSaving}
                            on:click={() => reset()}
                        >
                            <span class="txt">{$_("cancel")}</span>
                        </button>
                    {/if}

                    <button
                        type="submit"
                        class="pb-btn btn-expanded"
                        class:btn-loading={isSaving}
                        disabled={!hasChanges || isSaving}
                        on:click={() => save()}
                    >
                        <span class="txt">{$_("saveChanges")}</span>
                    </button> -->
                </div>
            {/if}
        </form>
    </div>
</PageWrapper>

<style lang="scss">
    .notification_content {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        & > svg {
            width: 2rem;
            height: 2rem;
        }
    }

    .cancel_button_container {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: flex-end;
    }
</style>
