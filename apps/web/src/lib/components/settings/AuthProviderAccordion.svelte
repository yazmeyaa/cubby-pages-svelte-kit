<script>
    import { scale, slide } from "svelte/transition";
    import tooltip from "$lib/actions/tooltip";
    import { errors, removeError } from "$lib/stores/errors";
    import CommonHelper from "$lib/utils/CommonHelper";
    import Accordion from "$lib/components/base/Accordion.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import RedactedPasswordInput from "$lib/components/base/RedactedPasswordInput.svelte";

    import { _ } from "svelte-i18n";
    import { TextInput, Toggle } from "carbon-components-svelte";

    export let key;
    export let title;
    export let icon = "";
    export let config = {};
    export let optionsComponent;

    let accordion;

    $: hasErrors = !CommonHelper.isEmpty(CommonHelper.getNestedVal($errors, key));

    $: if (!config.enabled) {
        removeError(key);
    }

    export function expand() {
        accordion?.expand();
    }

    export function collapse() {
        accordion?.collapse();
    }

    export function collapseSiblings() {
        accordion?.collapseSiblings();
    }

    function clear() {
        for (let k in config) {
            config[k] = "";
        }
        config.enabled = false;
    }
</script>

<Accordion bind:this={accordion} on:expand on:collapse on:toggle {...$$restProps}>
    <svelte:fragment slot="header">
        <div class="inline-flex">
            {#if icon}
                <i class={icon} class:txt-hint={!config.enabled} />
            {/if}
            <span class="txt">{title}</span>
            <em class="txt-hint">
                ({key.substring(0, key.length - 4)})
            </em>
        </div>

        <div class="flex-fill" />

        {#if hasErrors}
            <i
                class="ri-error-warning-fill txt-danger"
                transition:scale|local={{ duration: 150, start: 0.7 }}
                use:tooltip={{ text: "Has errors", position: "left" }}
            />
        {/if}

        {#if config.enabled}
            <span class="label label-success">{$_("enabled")}</span>
        {:else}
            <span class="label label-hint">{$_("disabled")}</span>
        {/if}
    </svelte:fragment>

    <div class="flex">
        <Field name="{key}.enabled" let:uniqueId>
            <!-- <input type="checkbox" id={uniqueId} bind:checked={config.enabled} />
            <label for={uniqueId}>{$_('enable')}</label> -->
            <Toggle labelText={$_("enable")} id={uniqueId} bind:toggled={config.enabled} />
        </Field>

        <button type="button" class="pb-btn btn-sm pb-btn-transparent btn-hint m-l-auto" on:click={clear}>
            <span class="txt">{$_("clearAllFields")}</span>
        </button>
    </div>

    <div class="grid">
        <div class="col-12 spacing" />
        <div class="col-lg-6">
            <Field name="{key}.clientId" let:uniqueId>
                <TextInput
                    labelText="Client ID"
                    id={uniqueId}
                    bind:value={config.clientId}
                    required={config.enabled}
                />
                <!-- <label for={uniqueId}>Client ID</label>
                <input type="text" id={uniqueId} bind:value={config.clientId} required={config.enabled} /> -->
            </Field>
        </div>

        <div class="col-lg-6">
            <Field name="{key}.clientSecret" let:uniqueId>
                <TextInput
                    labelText="Client secret"
                    bind:value={config.clientSecret}
                    id={uniqueId}
                    required={config.enabled}
                    type="password"
                />
                <!-- <label for={uniqueId}>Client secret</label>
                <RedactedPasswordInput
                    bind:value={config.clientSecret}
                    id={uniqueId}
                    required={config.enabled}
                /> -->
            </Field>
        </div>

        {#if optionsComponent}
            <div class="col-lg-12">
                <svelte:component this={optionsComponent} {key} bind:config />
            </div>
        {/if}
    </div>
</Accordion>
