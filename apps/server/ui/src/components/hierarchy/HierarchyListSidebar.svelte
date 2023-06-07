<script>
    import { hideControls } from "@/stores/app";
    import { collections, activeCollection } from "@/stores/collections";
    import CollectionUpsertPanel from "@/components/collections/CollectionUpsertPanel.svelte";
    import PortalToAppLeftSidebar from "../base/PortalToAppLeftSidebar.svelte";
    import {
        Button,
        Search,
        SideNav,
        SideNavDivider,
        SideNavItems,
        SideNavLink,
    } from "carbon-components-svelte";
    import Add from "carbon-icons-svelte/lib/Add.svelte";
    import TableSplit from "carbon-icons-svelte/lib/TableSplit.svelte";

    let collectionPanel;
    let searchTerm = "";

    $: if ($collections) {
        scrollIntoView();
    }

    $: normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    $: hasSearch = searchTerm !== "";

    $: hy_collections = $collections.filter((collection) => {
        return checkIsHYCollection(collection);
    });

    $: filtered = hy_collections.filter((collection) => {
        return (
            collection.id == searchTerm ||
            collection.name.replace(/\s+/g, "").toLowerCase().includes(normalizedSearch)
        );
    });

    function checkIsHYCollection(collection) {
        const hyPrefixRegex = /^hy_.+/;
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

<PortalToAppLeftSidebar>
    <SideNav isOpen rail fixed style="margin-left: 48px; width: calc(300px - 48px) !important;z-index: 1;">
        <SideNavItems>
            <Search type="text" size="lg" placeholder="Search collections..." bind:value={searchTerm} />
            {#each filtered as collection (collection.id)}
                <SideNavLink
                    isSelected={collection.id === $activeCollection.id}
                    icon={TableSplit}
                    style="cursor: pointer;"
                    on:click={(event) => {
                        event.preventDefault();
                        selectCollection(collection);
                    }}
                >
                    {collection.name}
                </SideNavLink>
            {:else}
                {#if normalizedSearch.length}
                    <p class="txt-hint m-t-10 m-b-10 txt-center">No collections found.</p>
                {/if}
            {/each}
            <SideNavDivider />
            {#if !$hideControls}
                <div class="flex_align_center">
                    <Button
                        style="width: 85%;"
                        kind="primary"
                        type="button"
                        icon={Add}
                        on:click={() => collectionPanel?.show()}
                    >
                        Add new item
                    </Button>
                </div>
            {/if}
        </SideNavItems>
    </SideNav>
</PortalToAppLeftSidebar>

<CollectionUpsertPanel
    bind:this={collectionPanel}
    on:save={(e) => {
        if (e.detail?.isNew && e.detail.collection) {
            selectCollection(e.detail.collection);
        }
    }}
/>

<style>
    .flex_align_center {
        display: flex;
        justify-content: center;
    }
</style>
