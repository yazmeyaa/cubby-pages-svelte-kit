<script>
    import { slide } from "svelte/transition";
    import ApiClient from "$lib/utils/ApiClient";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { pageTitle } from "$lib/stores/app";
    import { setErrors } from "$lib/stores/errors";
    import { addSuccessToast } from "$lib/stores/toasts";
    import tooltip from "$lib/actions/tooltip";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import ObjectSelect from "$lib/components/base/ObjectSelect.svelte";
    import RedactedPasswordInput from "$lib/components/base/RedactedPasswordInput.svelte";
    import SettingsSidebar from "$lib/components/settings/SettingsSidebar.svelte";
    import EmailTemplateAccordion from "$lib/components/settings/EmailTemplateAccordion.svelte";
    import EmailTestPopup from "$lib/components/settings/EmailTestPopup.svelte";

    import { _ } from "svelte-i18n";
    import {
        Breadcrumb,
        BreadcrumbItem,
        Button,
        Column,
        Grid,
        Loading,
        NumberInput,
        Row,
        Select,
        SelectItem,
        TextInput,
        Toggle,
    } from "carbon-components-svelte";
    import Mail from "carbon-icons-svelte/lib/Email.svelte";

    const tlsOptions = [
        { label: "Auto (StartTLS)", value: false },
        { label: "Always", value: true },
    ];

    const authMethods = [
        { label: "PLAIN (default)", value: "PLAIN" },
        { label: "LOGIN", value: "LOGIN" },
    ];

    $pageTitle = "Mail settings";

    let testPopup;
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
            setErrors({});
            addSuccessToast("Successfully saved mail settings.");
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isSaving = false;
    }

    function init(settings = {}) {
        formSettings = {
            meta: settings?.meta || {},
            smtp: settings?.smtp || {},
        };

        if (!formSettings.smtp.authMethod) {
            formSettings.smtp.authMethod = authMethods[0].value;
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
        <Breadcrumb>
            <BreadcrumbItem>{$_("pageSettings.header.breadcrumbs.page")}</BreadcrumbItem>
            <BreadcrumbItem>{$_("pageSettings.mail.header.breadcrumbs.title")}</BreadcrumbItem>
        </Breadcrumb>
    </header>

    <div>
        <form autocomplete="off" on:submit|preventDefault={() => save()}>
            <Grid>
                <Row noGutterLeft padding>
                    <p>{$_("pageSettings.mail.pageDescription")}</p>
                </Row>

                {#if isLoading}
                    <Loading />
                {:else}
                    <Row noGutterLeft padding>
                        <Column>
                            <Field name="meta.senderName" let:uniqueId>
                                <TextInput
                                    type="text"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.meta.senderName}
                                    labelText={$_("pageSettings.mail.field.senderName")}
                                />
                            </Field>
                        </Column>
                        <Column>
                            <Field name="meta.senderAddress" let:uniqueId>
                                <TextInput
                                    type="email"
                                    id={uniqueId}
                                    required
                                    bind:value={formSettings.meta.senderAddress}
                                    labelText={$_("pageSettings.mail.field.senderAddress")}
                                />
                            </Field>
                        </Column>
                    </Row>
                    <Row noGutterLeft>
                        <EmailTemplateAccordion
                            single
                            key="meta.verificationTemplate"
                            title={$_("pageSettings.mail.template.verification")}
                            bind:config={formSettings.meta.verificationTemplate}
                        />
                    </Row>
                    <Row noGutterLeft>
                        <EmailTemplateAccordion
                            single
                            key="meta.resetPasswordTemplate"
                            title={$_("pageSettings.mail.template.reset")}
                            bind:config={formSettings.meta.resetPasswordTemplate}
                        />
                    </Row>
                    <Row noGutterLeft>
                        <EmailTemplateAccordion
                            single
                            key="meta.confirmEmailChangeTemplate"
                            title={$_("pageSettings.mail.template.changeEmail")}
                            bind:config={formSettings.meta.confirmEmailChangeTemplate}
                        />
                    </Row>
                    <Row noGutterLeft>
                        <Field let:uniqueId>
                            <Toggle
                                style="margin-bottom: 1rem;"
                                id={uniqueId}
                                required
                                bind:toggled={formSettings.smtp.enabled}
                            >
                                <svelte:fragment slot="labelText">
                                    <span
                                        >{$_("pageSettings.mail.useSMTP")}
                                        <strong>({$_("recommended")})</strong></span
                                    >
                                    <i
                                        class="ri-information-line link-hint"
                                        use:tooltip={{
                                            text: $_("pageSettings.mail.useSMTP.description"),
                                            position: "top",
                                        }}
                                    />
                                </svelte:fragment>
                            </Toggle>
                        </Field>
                    </Row>
                    {#if formSettings.smtp.enabled}
                        <Row noGutterLeft padding>
                            <Column>
                                <Field name="smtp.host" let:uniqueId>
                                    <TextInput
                                        type="text"
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.smtp.host}
                                        labelText={$_("pageSettings.mail.field.host")}
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="smtp.port" let:uniqueId>
                                    <NumberInput
                                        hideSteppers
                                        label={$_("pageSettings.mail.field.port")}
                                        id={uniqueId}
                                        required
                                        bind:value={formSettings.smtp.port}
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="smtp.tls" let:uniqueId>
                                    <!-- <label for={uniqueId}>{$_("pageSettings.mail.field.encrypt")}</label>
                                    <ObjectSelect
                                        id={uniqueId}
                                        items={tlsOptions}
                                        bind:keyOfSelected={formSettings.smtp.tls}
                                    /> -->
                                    <Select
                                        id={uniqueId}
                                        bind:selected={formSettings.smtp.tls}
                                        labelText={$_("pageSettings.mail.field.authMethod")}
                                    >
                                        {#each tlsOptions as method}
                                            <SelectItem value={method.value} text={method.label} />
                                        {/each}
                                    </Select>
                                </Field>
                            </Column>
                            <Column>
                                <Field name="smtp.authMethod" let:uniqueId>
                                    <!-- <label for={uniqueId}>{$_("pageSettings.mail.field.authMethod")}</label>
                                    <ObjectSelect
                                        id={uniqueId}
                                        items={authMethods}
                                        bind:keyOfSelected={formSettings.smtp.authMethod}
                                    /> -->
                                    <Select
                                        id={uniqueId}
                                        bind:selected={formSettings.smtp.authMethod}
                                        labelText={$_("pageSettings.mail.field.authMethod")}
                                    >
                                        {#each authMethods as method}
                                            <SelectItem value={method.value} text={method.label} />
                                        {/each}
                                    </Select>
                                </Field>
                            </Column>
                        </Row>
                        <Row noGutterLeft>
                            <Column>
                                <Field name="smtp.username" let:uniqueId>
                                    <TextInput
                                        labelText={$_("pageSettings.mail.field.username")}
                                        id={uniqueId}
                                        bind:value={formSettings.smtp.username}
                                    />
                                </Field>
                            </Column>
                            <Column>
                                <Field name="smtp.password" let:uniqueId>
                                    <TextInput
                                        labelText={$_("pageSettings.mail.field.password")}
                                        id={uniqueId}
                                        bind:value={formSettings.smtp.password}
                                    />
                                </Field>
                            </Column>
                        </Row>
                    {/if}
                    <Row padding>
                        {#if hasChanges}
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
                                <div class="cancel_button_container">
                                    <Button kind="secondary" disabled={isSaving} on:click={() => reset()}>
                                        {$_("cancel")}
                                    </Button>
                                </div>
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
                        {:else}
                            <Column
                                max={{
                                    offset: 12,
                                    span: 4,
                                }}
                                xlg={{
                                    offset: 12,
                                    span: 4,
                                }}
                                lg={{
                                    offset: 12,
                                    span: 4,
                                }}
                                md={{
                                    offset: 4,
                                    span: 4,
                                }}
                                sm={4}
                            >
                                <Button on:click={() => testPopup?.show()} icon={Mail}
                                    >{$_("pageSettings.mail.sendTestMail")}
                                </Button>
                            </Column>
                        {/if}
                    </Row>
                {/if}
            </Grid>
        </form>
    </div>
</PageWrapper>

<EmailTestPopup bind:this={testPopup} />

<style>
    .cancel_button_container {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: flex-end;
    }
</style>
