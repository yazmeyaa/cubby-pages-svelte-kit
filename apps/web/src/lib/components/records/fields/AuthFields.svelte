<script>
    import { slide } from "svelte/transition";
    import { Collection, Record } from "pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import tooltip from "$lib/actions/tooltip";
    import { confirm } from "$lib/stores/confirmation";
    import { removeError } from "$lib/stores/errors";
    import Field from "$lib/components/base/Field.svelte";

    import { _ } from "svelte-i18n";
    import { TextInput, Toggle } from "carbon-components-svelte";

    export let collection = new Collection();
    export let record = new Record();

    let originalUsername = record.username || null;

    let changePasswordToggle = false;

    $: if (!record.username && record.username !== null) {
        record.username = null;
    }

    $: if (!changePasswordToggle) {
        record.password = null;
        record.passwordConfirm = null;
        removeError("password");
        removeError("passwordConfirm");
    }
</script>

<div class="grid m-b-base">
    <div class="col-lg-6">
        <Field name="username" let:uniqueId>
            <!-- <label for={uniqueId}>
                <i class={CommonHelper.getFieldTypeIcon("user")} />
                <span class="txt">{$_('recordSidebar.auth.username')}</span>
            </label> -->

            <TextInput
                requried={!record.$isNew}
                placeholder={record.$isNew ? "Leave empty to auto generate..." : originalUsername}
                id={uniqueId}
                bind:value={record.username}
            >
                <svelte:fragment slot="labelText">
                    <i class={CommonHelper.getFieldTypeIcon("user")} />
                    <span class="txt">{$_("recordSidebar.auth.username")}</span>
                </svelte:fragment>
            </TextInput>
            <!-- <input
                type="text"
                requried={!record.$isNew}
                placeholder={record.$isNew ? "Leave empty to auto generate..." : originalUsername}
                id={uniqueId}
                bind:value={record.username}
            /> -->
        </Field>
    </div>

    <div class="col-lg-6" style="position: relative;">
        <Field name="email" let:uniqueId>
            <TextInput
                type="email"
                autofocus={record.$isNew}
                autocomplete="off"
                id={uniqueId}
                required={collection.options?.requireEmail}
                bind:value={record.email}
            >
                <svelte:fragment slot="labelText">
                    <i class={CommonHelper.getFieldTypeIcon("email")} />
                    <span class="txt">{$_("recordSidebar.auth.email")}</span>
                </svelte:fragment>
            </TextInput>
            <!-- <label for={uniqueId}>
                <i class={CommonHelper.getFieldTypeIcon("email")} />
                <span class="txt">{$_("recordSidebar.auth.email")}</span>
            </label> -->
            <div
                class="form-field-addon email-visibility-addon"
                style="position: absolute;right: 0;top: 28px;"
            >
                <button
                    type="button"
                    class="email-addon-position pb-btn btn-sm pb-btn-transparent {record.emailVisibility
                        ? 'btn-success'
                        : 'btn-hint'}"
                    use:tooltip={{
                        text: "Make email public or private",
                        position: "top-right",
                    }}
                    on:click={() => (record.emailVisibility = !record.emailVisibility)}
                >
                    <span class="txt">Public: {record.emailVisibility ? "On" : "Off"}</span>
                </button>
            </div>
            <!-- svelte-ignore a11y-autofocus -->
            <!-- <input
                type="email"
                autofocus={record.$isNew}
                autocomplete="off"
                id={uniqueId}
                required={collection.options?.requireEmail}
                bind:value={record.email}
            /> -->
        </Field>
    </div>

    <div class="col-lg-12">
        {#if !record.$isNew}
            <Field name="verified" let:uniqueId>
                <Toggle
                    id={uniqueId}
                    bind:toggled={changePasswordToggle}
                    labelA={$_("recordSidebar.auth.changePassword")}
                    labelB={$_("recordSidebar.auth.changePassword")}
                />
                <!-- <input type="checkbox" id={uniqueId} bind:checked={changePasswordToggle} />
                <label for={uniqueId}>{$_("recordSidebar.auth.changePassword")}</label> -->
            </Field>
        {/if}

        {#if record.$isNew || changePasswordToggle}
            <div class="block" transition:slide|local={{ duration: 150 }}>
                <div class="grid" class:p-t-xs={changePasswordToggle}>
                    <div class="col-sm-6">
                        <Field name="password" let:uniqueId>
                            <TextInput
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={record.password}
                            >
                                <svelte:fragment slot="labelText">
                                    <i class="ri-lock-line" />
                                    <span class="txt">{$_("password")}</span>
                                </svelte:fragment>
                            </TextInput>
                            <!-- <label for={uniqueId}>
                                <i class="ri-lock-line" />
                                <span class="txt">{$_("password")}</span>
                            </label>
                            <input
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={record.password}
                            /> -->
                        </Field>
                    </div>
                    <div class="col-sm-6">
                        <Field name="passwordConfirm" let:uniqueId>
                            <TextInput
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={record.passwordConfirm}
                            >
                                <svelte:fragment slot="labelText">
                                    <i class="ri-lock-line" />
                                    <span class="txt">{$_("confirmPassword")}</span>
                                </svelte:fragment>
                            </TextInput>
                            <!-- <label for={uniqueId}>
                                <i class="ri-lock-line" />
                                <span class="txt">{$_("confirmPassword")}</span>
                            </label>
                            <input
                                type="password"
                                autocomplete="new-password"
                                id={uniqueId}
                                required
                                bind:value={record.passwordConfirm}
                            /> -->
                        </Field>
                    </div>
                </div>
            </div>
        {/if}
    </div>

    <div class="col-lg-12">
        <Field  name="verified" let:uniqueId>
            <Toggle
                labelA={$_("recordSidebar.auth.verified")}
                labelB={$_("recordSidebar.auth.verified")}
                id={uniqueId}
                bind:toggled={record.verified}
                on:change={(e) => {
                    e.preventDefault();
                    if (record.$isNew) {
                        return; // no confirmation required
                    }
                    confirm(
                        `Do you really want to manually change the verified account state?`,
                        () => {},
                        () => {
                            record.verified = !e.target.checked;
                        }
                    );
                }}
            />
            <!-- <input
                type="checkbox"
                id={uniqueId}
                bind:checked={record.verified}
                on:change|preventDefault={(e) => {
                    if (record.$isNew) {
                        return; // no confirmation required
                    }
                    confirm(
                        `Do you really want to manually change the verified account state?`,
                        () => {},
                        () => {
                            record.verified = !e.target.checked;
                        }
                    );
                }}
            />
            <label for={uniqueId}>{$_("recordSidebar.auth.verified")}</label> -->
        </Field>
    </div>
</div>

<style>
    .email-visibility-addon ~ input {
        padding-right: 100px;
    }

    .email-addon-position {
        align-self: flex-end;
        padding: 0px 20px;
        min-height: 34.5px;
    }
</style>
