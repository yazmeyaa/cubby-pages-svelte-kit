<script>
    import { link, replace } from "svelte-spa-router";
    import { hideControls } from "@/stores/app";
    import {
        collections,
        activeCollection,
        isCollectionsLoading,
        loadCollections,
    } from "@/stores/collections";
    import { onMount } from "svelte";
    import ApiClient from "@/utils/ApiClient";
    import { activeTable } from "@/stores/tables";
    import RecordUpsertPanel from "../records/RecordUpsertPanel.svelte";
    import Portal from "svelte-portal";
    import PortalToAppLeftSidebar from "../base/PortalToAppLeftSidebar.svelte";
    import {
        Search,
        ClickableTile,
        Button,
        Content,
        Grid,
        Row,
        Column,
        UnorderedList,
        ListItem,
        Link,
        SideNavMenu,
        SideNav,
        SideNavItems,
        SideNavLink,
        SideNavDivider,
    } from "carbon-components-svelte";
    import Add from "carbon-icons-svelte/lib/Add.svelte";

    let tableUpsertPanel;
    let searchTerm = "";

    let data = [];

    let TABLES_COLLECTION = {};
    $: hasSearch = searchTerm !== "";

    $: if ($collections) {
        scrollIntoView();
    }

    $: if ($activeTable) {
        loadRecordList();
    }

    $: tables_collection = data.find((collection) => {
        return collection.name === "cfg_spreadsheets";
    });

    $: normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    let records = [];
    $: tablesRecords = records;

    $: filtered = tablesRecords.filter((table) => {
        return (
            table.name === searchTerm ||
            table.name.replace(/\s+/g, "").toLowerCase().includes(normalizedSearch)
        );
    });

    // let filtered = $collections.filter((collection) => {
    //     return collection.name === "cfg_spreadsheets";
    // });

    onMount(() => {
        if (!$collections) loadCollections();
        collections.subscribe((value) => {
            data = value;
        });
        loadRecordList();
    });

    function loadRecordList() {
        const TABLES = ApiClient.collection("cfg_spreadsheets");
        TABLES.getList(1, 500).then((data) => {
            records = [...data.items];
            TABLES_COLLECTION = tablesRecords;
        });
    }

    function selectTable(table) {
        $activeTable = table;
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
    <SideNav isOpen rail fixed style="margin-left: 48px; width: calc(300px - 48px) !important;z-index: 1">
        <SideNavItems>
            <Search size="lg" type="text" placeholder="Search spreadsheets..." bind:value={searchTerm} />
            {#each filtered as record (record.id)}
                <SideNavLink
                    style="cursor: pointer;"
                    on:click={(event) => {
                        event.preventDefault();
                        selectTable(record);
                    }}
                    isSelected={$activeTable && $activeTable.id === record.id}
                >
                    {record.name}
                </SideNavLink>
            {:else}
                {#if normalizedSearch.length}
                    <p class="txt-hint m-t-10 m-b-10 txt-center">No spreadsheet found.</p>
                {/if}
            {/each}
            <SideNavDivider />
            {#if !$hideControls && tables_collection}
                <div class="flex_align_center">
                    <Button
                        style="width: 85%;"
                        kind="primary"
                        type="button"
                        icon={Add}
                        on:click={() => tableUpsertPanel?.show()}
                    >
                        <span class="txt">New table</span>
                    </Button>
                </div>
            {/if}
        </SideNavItems>
    </SideNav>
</PortalToAppLeftSidebar>
<RecordUpsertPanel
    bind:this={tableUpsertPanel}
    collection={tables_collection}
    on:save={loadRecordList}
    on:delete={loadRecordList}
/>

<style>
    .flex_align_center {
        display: flex;
        justify-content: center;
    }
</style>
