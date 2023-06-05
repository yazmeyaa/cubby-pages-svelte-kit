<script>
    import { link } from "svelte-spa-router";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { hideControls } from "$lib/stores/app";
    import { collections, activeCollection, isCollectionsLoading } from "$lib/stores/collections";
    import CollectionUpsertPanel from "$lib/components/collections/CollectionUpsertPanel.svelte";
    import PortalToAppLeftSidebar from "../base/PortalToAppLeftSidebar.svelte";
    import { Button, Search } from "carbon-components-svelte";
    import Add from 'carbon-icons-svelte/lib/Add.svelte'
    
    import {_} from 'svelte-i18n'

    let collectionPanel;
    let searchTerm = "";

    $: if ($collections) {
        scrollIntoView();
    }

    $: normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    $: hasSearch = searchTerm !== "";

    $: filtered = $collections.filter((collection) => {
        return (
            collection.id == searchTerm ||
            collection.name.replace(/\s+/g, "").toLowerCase().includes(normalizedSearch)
        );
    });

    //* Might be useful in the future

    // function checkIsHYCollection(collection) {
    //     const hyPrefixRegex = /^hy_.+/;
    //     return hyPrefixRegex.test(collection.name);
    // }

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

<PortalToAppLeftSidebar>
    <aside class="page-sidebar collection-sidebar">
        <header class="sidebar-header">
            <Search style="border-bottom: none;padding-bottom: 1px;" size="lg" placeholder={$_('carbon.search.placeholder')} bind:value={searchTerm}/>
        </header>

        <!-- <hr class="m-t-5 m-b-xs" /> -->

        <div
            class="sidebar-content"
            class:fade={$isCollectionsLoading}
            class:sidebar-content-compact={filtered.length > 20}
        >
            {#each filtered as collection (collection.id)}
            {@const icon = CommonHelper.getCollectionTypeIconCarbon(collection.type)}
                <a
                    href="/collections?collectionId={collection.id}"
                    class="sidebar-list-item"
                    class:active={$activeCollection?.id === collection.id}
                    use:link
                >
                <svelte:component this={icon}/>
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
                <!-- <button
                    type="button"
                    class="pb-btn pb-btn-block btn-outline"
                    on:click={() => collectionPanel?.show()}
                >
                    <i class="ri-add-line" />
                    <span class="txt">New collection</span>
                </button> -->
                <Button kind="ghost" icon={Add} style="width: 100%;" on:click={() => collectionPanel?.show()}>
                    {$_('pageCollections.sidebar.addCollectionButton')}
                </Button>
            </footer>
        {/if}
    </aside>
</PortalToAppLeftSidebar>

<CollectionUpsertPanel
    bind:this={collectionPanel}
    on:save={(e) => {
        if (e.detail?.isNew && e.detail.collection) {
            selectCollection(e.detail.collection);
        }
    }}
/>
