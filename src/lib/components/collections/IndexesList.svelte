<script>
    import CommonHelper from "$lib/utils/CommonHelper";
    import { errors, removeError } from "$lib/stores/errors";
    import tooltip from "$lib/actions/tooltip";
    import IndexUpsertPanel from "$lib/components/collections/IndexUpsertPanel.svelte";

    import {_} from 'svelte-i18n'
    import { Button } from "carbon-components-svelte";
    import Add from 'carbon-icons-svelte/lib/Add.svelte'

    export let collection;

    let upsertPanel;

    function pushOrReplace(oldIndex, newIndex) {
        for (let i = 0; i < collection.indexes.length; i++) {
            // replace
            if (collection.indexes[i] == oldIndex) {
                collection.indexes[i] = newIndex;
                removeError("indexes." + i);
                return;
            }
        }

        // push missing
        collection.indexes.push(newIndex);
        collection.indexes = collection.indexes;
    }
</script>

<div class="section-title">
    {$_('collectionSidebar.constraintsAndIndexes')} ({collection?.indexes?.length || 0})
</div>
<div class="indexes-list">
    {#each collection?.indexes || [] as rawIndex, i}
        {@const parsed = CommonHelper.parseIndex(rawIndex)}
        <button
            type="button"
            class="label link-primary {$errors.indexes?.[i]?.message ? 'label-danger' : ''}"
            use:tooltip={$errors.indexes?.[i]?.message || ""}
            on:click={() => upsertPanel?.show(rawIndex, i)}
        >
            {#if parsed.unique}
                <strong>Unique:</strong>
            {/if}
            <span class="txt">
                {parsed.columns?.map((c) => c.name).join(", ")}
            </span>
        </button>
    {/each}
    <Button
    on:click={() => upsertPanel?.show()}
    kind="ghost"
    icon={Add}
    >
        {$_('collectionSidebar.newIndex')}
    </Button>
    <!-- <button
        type="button"
        class="pb-btn btn-xs pb-btn-transparent btn-pill btn-outline"
        on:click={() => upsertPanel?.show()}
    >
        <span class="txt">+</span>
        <span class="txt">{$_('collectionSidebar.newIndex')}</span>
    </button> -->
</div>

<IndexUpsertPanel
    bind:this={upsertPanel}
    bind:collection
    on:remove={(e) => {
        for (let i = 0; i < collection.indexes.length; i++) {
            if (collection.indexes[i] == e.detail) {
                collection.indexes.splice(i, 1);
                removeError("indexes." + i);
                break;
            }
        }
        collection.indexes = collection.indexes;
    }}
    on:submit={(e) => {
        pushOrReplace(e.detail.old, e.detail.new);
    }}
/>

<style lang="scss">
    .indexes-list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: 10px;
    }
    .label {
        overflow: hidden;
        min-width: 50px;
    }
</style>
