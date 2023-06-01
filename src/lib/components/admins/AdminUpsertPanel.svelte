<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { Admin } from "pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import ApiClient from "$lib/utils/ApiClient";
    import tooltip from "$lib/actions/tooltip";
    import { setErrors } from "$lib/stores/errors";
    import { confirm } from "$lib/stores/confirmation";
    import { addSuccessToast } from "$lib/stores/toasts";
    import Field from "$lib/components/base/Field.svelte";
    import Toggler from "$lib/components/base/Toggler.svelte";
    import OverlayPanel from "$lib/components/base/OverlayPanel.svelte";

    import { _ } from "svelte-i18n";

    import { Button, TextInput, Toggle } from "carbon-components-svelte";

    const dispatch = createEventDispatcher();
    const formId = "admin_" + CommonHelper.randomString(5);

    let panel;
    let admin = new Admin();
    let isSaving = false;
    let confirmClose = false; // prevent close recursion
    let avatar = 0;
    let email = "";
    let password = "";
    let passwordConfirm = "";
    let changePasswordToggle = false;

    $: hasChanges =
        (admin.$isNew && email != "") ||
        changePasswordToggle ||
        email !== admin.email ||
        avatar !== admin.avatar;

    export function show(model) {
        load(model);

        confirmClose = true;

        return panel?.show();
    }

    export function hide() {
        return panel?.hide();
    }

    function load(model) {
        admin = model?.$clone ? model.$clone() : new Admin();
        reset(); // reset form
    }

    function reset() {
        changePasswordToggle = false;
        email = admin?.email || "";
        avatar = admin?.avatar || 0;
        password = "";
        passwordConfirm = "";
        setErrors({}); // reset errors
    }

    function save() {
        if (isSaving || !hasChanges) {
            return;
        }

        isSaving = true;

        const data = { email, avatar };
        if (admin.$isNew || changePasswordToggle) {
            data["password"] = password;
            data["passwordConfirm"] = passwordConfirm;
        }

        let request;
        if (admin.$isNew) {
            request = ApiClient.admins.create(data);
        } else {
            request = ApiClient.admins.update(admin.id, data);
        }

        request
            .then(async (result) => {
                confirmClose = false;
                hide();
                addSuccessToast(admin.$isNew ? "Successfully created admin." : "Successfully updated admin.");
                dispatch("save", result);

                if (ApiClient.authStore.model?.id === result.id) {
                    ApiClient.authStore.save(ApiClient.authStore.token, result);
                }
            })
            .catch((err) => {
                ApiClient.errorResponseHandler(err);
            })
            .finally(() => {
                isSaving = false;
            });
    }

    function deleteConfirm() {
        if (!admin?.id) {
            return; // nothing to delete
        }

        confirm($_("adminUpsert.confirmDelete"), () => {
            return ApiClient.admins
                .delete(admin.id)
                .then(() => {
                    confirmClose = false;
                    hide();
                    addSuccessToast("Successfully deleted admin.");
                    dispatch("delete", admin);
                })
                .catch((err) => {
                    ApiClient.errorResponseHandler(err);
                });
        });
    }
</script>

<OverlayPanel
    bind:this={panel}
    popup
    class="admin-panel"
    beforeHide={() => {
        if (hasChanges && confirmClose) {
            confirm($_("collectionSidebar.unsavedChangesMessage"), () => {
                confirmClose = false;
                hide();
            });
            return false;
        }
        return true;
    }}
    on:hide
    on:show
>
    <svelte:fragment slot="header">
        <h4>
            {admin.$isNew ? $_("adminUpsert.title.new") : $_("adminUpsert.title.edit")}
        </h4>
    </svelte:fragment>

    <form id={formId} class="grid" autocomplete="off" on:submit|preventDefault={save}>
        {#if !admin.$isNew}
            <Field class="fullwidth" name="id" let:uniqueId>
                <!-- <label for={uniqueId}>
                    <i class={CommonHelper.getFieldTypeIcon("primary")} />
                    <span class="txt">id</span>
                </label>
                <div class="form-field-addon">
                    <i
                        class="ri-calendar-event-line txt-disabled"
                        use:tooltip={{
                            text: `Created: ${admin.created}\nUpdated: ${admin.updated}`,
                            position: "left",
                        }}
                    />
                </div>
                <input type="text" id={uniqueId} value={admin.id} readonly /> -->
                <TextInput 
                id={uniqueId} value={admin.id} readonly
                >
                    <svelte:fragment slot="labelText" >
                            <i class={CommonHelper.getFieldTypeIcon("primary")} />
                            <span class="txt">id</span>
                    </svelte:fragment>
                </TextInput>
            </Field>
        {/if}

        <div class="content">
            <p class="section-title">{$_("adminUpsert.avatar")}</p>
            <div class="flex flex-gap-xs flex-wrap">
                {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as index}
                    <button
                        type="button"
                        class="link-fade thumb thumb-circle {index == avatar ? 'thumb-active' : 'thumb-sm'}"
                        on:click={() => (avatar = index)}
                    >
                        <img
                            src="{import.meta.env.BASE_URL}images/avatars/avatar{index}.svg"
                            alt="Avatar {index}"
                        />
                    </button>
                {/each}
            </div>
        </div>

        <Field class="fullwidth" name="email" let:uniqueId>
            <TextInput
                labelText="Email"
                type="email"
                autocomplete="off"
                id={uniqueId}
                required
                bind:value={email}
            />
            <!-- <label for={uniqueId}>
                <i class={CommonHelper.getFieldTypeIcon("email")} />
                <span class="txt">Email</span>
            </label>
            <input type="email" autocomplete="off" id={uniqueId} required bind:value={email} /> -->
        </Field>

        {#if !admin.$isNew}
            <Field let:uniqueId>
                <Toggle
                    labelText={$_("adminUpsert.changePassword")}
                    id={uniqueId}
                    bind:toggled={changePasswordToggle}
                />
                <!-- <input type="checkbox" id={uniqueId} bind:checked={changePasswordToggle} />
                <label for={uniqueId}>{$_('adminUpsert.changePassword')}</label> -->
            </Field>
        {/if}

        {#if admin.$isNew || changePasswordToggle}
            <div class="col-12">
                <div class="grid" transition:slide|local={{ duration: 150 }}>
                    <div class="col-sm-6">
                        <Field  name="password" let:uniqueId>
                            <TextInput
                                labelText={$_("adminUpsert.password")}
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={password}
                            />
                            <!-- <label for={uniqueId}>
                                <i class="ri-lock-line" />
                                <span class="txt">{$_("adminUpsert.password")}</span>
                            </label>
                            <input
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={password}
                            /> -->
                        </Field>
                    </div>
                    <div class="col-sm-6">
                        <Field  name="passwordConfirm" let:uniqueId>
                            <TextInput 
                            type="password"
                            autocomplete="new-password"
                            id={uniqueId}
                            required
                            bind:value={passwordConfirm}
                            labelText={$_("adminUpsert.confirmPassword")}
                            />
                            <!-- <label for={uniqueId}>
                                <i class="ri-lock-line" />
                                <span class="txt">{$_("adminUpsert.confirmPassword")}</span>
                            </label>
                            <input
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={passwordConfirm}
                            /> -->
                        </Field>
                    </div>
                </div>
            </div>
        {/if}
    </form>

    <svelte:fragment slot="footer">
        {#if !admin.$isNew}
            <button type="button" aria-label="More" class="pb-btn btn-sm pb-btn-circle pb-btn-transparent">
                <!-- empty span for alignment -->
                <span />
                <i class="ri-more-line" />
                <Toggler class="dropdown dropdown-upside dropdown-left dropdown-nowrap">
                    <button type="button" class="dropdown-item txt-danger" on:click={() => deleteConfirm()}>
                        <i class="ri-delete-bin-7-line" />
                        <span class="txt">{$_("delete")}</span>
                    </button>
                </Toggler>
            </button>
            <div class="flex-fill" />
        {/if}

        <!-- <button type="button" class="pb-btn pb-btn-transparent" disabled={isSaving} on:click={() => hide()}>
            <span class="txt">{$_("cancel")}</span>
        </button> -->
        <Button kind="secondary" disabled={isSaving} on:click={() => hide()}>
            {$_("cancel")}
        </Button>
        <Button
        type="submit"
        form={formId}
        disabled={!hasChanges || isSaving}
        >
        {admin.$isNew ? $_("create") : $_("saveChanges")}
        </Button>
        <!-- <button
            type="submit"
            form={formId}
            class="pb-btn btn-expanded"
            class:btn-loading={isSaving}
            disabled={!hasChanges || isSaving}
        >
            <span class="txt">{admin.$isNew ? $_("create") : $_("saveChanges")}</span>
        </button> -->
    </svelte:fragment>
</OverlayPanel>
