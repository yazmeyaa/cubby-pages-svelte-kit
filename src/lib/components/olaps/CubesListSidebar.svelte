<script>
    import { link } from "svelte-spa-router";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { hideControls } from "$lib/stores/app";
    import { collections, activeCollection, isCollectionsLoading } from "$lib/stores/collections";
    import CollectionUpsertPanel from "$lib/components/collections/CollectionUpsertPanel.svelte";

    let collectionPanel;
    let searchTerm = "";

    $: if ($collections) {
        scrollIntoView();
    }

    $: normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    $: hasSearch = searchTerm !== "";

    $: hy_collections = $collections.filter((collection) => {
        return checkIsCubesCollection(collection);
    });

    $: filtered = hy_collections.filter((collection) => {
        return (
            collection.id == searchTerm ||
            collection.name.replace(/\s+/g, "").toLowerCase().includes(normalizedSearch)
        );
    });

    function checkIsCubesCollection(collection) {
        const hyPrefixRegex = /^cb_.+/;
        return hyPrefixRegex.test(collection.name);
    }

    function selectCollection(collection) {
        $activeCollection = collection;
    }

    function scrollIntoView() {
        setTimeout(() => {
            const activeItem = document.querySelector(".collection-sidebar .sidebar-list-item.active");
            if (activeItem) {
                activeItem?.scrollIntoView({ block: "nearest" });
            }
        }, 0);
    }
</script>

<aside class="page-sidebar collection-sidebar">
    <header class="sidebar-header">
        <div class="form-field search" class:active={hasSearch}>
            <div class="form-field-addon">
                <button
                    type="button"
                    class="pb-btn btn-xs pb-btn-transparent pb-btn-circle btn-clear"
                    class:hidden={!hasSearch}
                    on:click={() => (searchTerm = "")}
                >
                    <i class="ri-close-line" />
                </button>
            </div>
            <input type="text" placeholder="Search collections..." bind:value={searchTerm} />
        </div>
    </header>

    <!-- <hr class="m-t-5 m-b-xs" /> -->

    <div
        class="sidebar-content"
        class:fade={$isCollectionsLoading}
        class:sidebar-content-compact={filtered.length > 20}
    >

        {#each filtered as collection (collection.id)}
            <a
                href="/cubes?collectionId={collection.id}"
                class="sidebar-list-item"
                class:active={$activeCollection?.id === collection.id}
                use:link
            >
                <i class={CommonHelper.getCollectionTypeIcon(collection.type)} />
                <span class="txt">{collection.name}</span>
            </a>
        {:else}
            {#if normalizedSearch.length}
                <p class="txt-hint m-t-10 m-b-10 txt-center">No collections found.</p>
            {/if}
        {/each}
    </div>

    {#if !$hideControls}
        <footer class="sidebar-footer">
            <button type="button" class="pb-btn pb-btn-block btn-outline" on:click={() => collectionPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">New collection</span>
            </button>
        </footer>
    {/if}
</aside>

<CollectionUpsertPanel
    bind:this={collectionPanel}
    on:save={(e) => {
        if (e.detail?.isNew && e.detail.collection) {
            selectCollection(e.detail.collection);
        }
    }}
/>
