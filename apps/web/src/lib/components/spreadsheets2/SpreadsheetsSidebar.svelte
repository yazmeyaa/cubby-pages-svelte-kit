<script>
    import { hideControls } from "$lib/stores/app";
    import {
        collections,
        activeCollection,
        isCollectionsLoading,
        loadCollections,
    } from "$lib/stores/collections";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { onMount } from "svelte";
    import {pb as ApiClient} from "$lib/pocketbase";
    import { activeTable } from "$lib/stores/tables";
    import RecordUpsertPanel from "../records/RecordUpsertPanel.svelte";
    import PortalToAppLeftSidebar from "../base/PortalToAppLeftSidebar.svelte";
    import {
        Button
    } from "carbon-components-svelte";
    import Add from "carbon-icons-svelte/lib/Add.svelte";
    import DocumentBlank from "carbon-icons-svelte/lib/DocumentBlank.svelte";

    import { _ } from "svelte-i18n";

    export function showPanel() {
        tableUpsertPanel?.show();
    }

    let tableUpsertPanel;
    let searchTerm = "";

    let data = [];

    let TABLES_COLLECTION = {};
    $: hasSearch = searchTerm !== "";

    // $: if ($collections) {
    //     // scrollIntoView();
    // }

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
        console.log(ApiClient)
        TABLES.getList(1, 500).then((data) => {
            records = [...data.items];
            TABLES_COLLECTION = tablesRecords;
        });
    }

    function selectTable(table) {
        $activeTable = table;
    }

    // function scrollIntoView() {
    //     setTimeout(() => {
    //         const activeItem = document.querySelector(".collection-sidebar .sidebar-list-item.active");
    //         if (activeItem) {
    //             activeItem?.scrollIntoView({ block: "nearest" });
    //         }
    //     }, 0);
    // }
</script>

<PortalToAppLeftSidebar>
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
                <input
                    type="text"
                    placeholder={$_("pageSpreadsheet.sidebar.search.placeholder")}
                    bind:value={searchTerm}
                />
            </div>
        </header>

        <div
            class="sidebar-content"
            class:fade={$isCollectionsLoading}
            class:sidebar-content-compact={filtered.length > 20}
        >
            {#each filtered as collection (collection.id)}
                <a
                    href="/spreadsheets?collectionId={collection.id}"
                    class="sidebar-list-item"
                    class:active={$activeTable?.id === collection.id}
                    on:click={(event) => {
                        event.preventDefault();
                        selectTable(collection);
                    }}
                >
                    <!-- <i class={CommonHelper.getCollectionTypeIcon(collection.type)} /> -->
                    <div style="display: flex; gap: 10px;align-items: center;padding: 0.5rem;">
                        <DocumentBlank />
                        <span class="txt">{collection.name}</span>
                    </div>
                </a>
            {:else}
                {#if normalizedSearch.length}
                    <p class="txt-hint m-t-10 m-b-10 txt-center">No spreadsheets found.</p>
                {/if}
            {/each}
        </div>

        <!-- {#if !$hideControls && tables_collection} -->
        <footer class="sidebar-footer">
            <Button kind="ghost" icon={Add} style="width: 100%;" on:click={() => tableUpsertPanel?.show()}>
                {$_("pageSpreadsheets.sidebar.addTableButton")}
            </Button>
        </footer>
        <!-- {/if} -->
    </aside>
    <!-- </aside> -->
</PortalToAppLeftSidebar>
<RecordUpsertPanel
    bind:this={tableUpsertPanel}
    collection={tables_collection}
    on:save={loadRecordList}
    on:delete={loadRecordList}
/>
