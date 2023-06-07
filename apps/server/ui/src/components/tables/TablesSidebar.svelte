<script>
    import { link } from "svelte-spa-router";
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

    let tableUpsertPanel;
    let searchTerm = "";

    let data = [];

    let TABLES_COLLECTION = {};

    $: if ($collections) {
        scrollIntoView();
    }

    $: if ($activeTable) {
        loadRecordList();
    }

    $: tables_collection = data.find((collection) => {
        console.log("HELLO IM UPDATED");
        return collection.name === "ttables";
    });

    $: normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    let filtered = $collections.filter((collection) => {
        return collection.name === "ttables";
    });

    let records = [];
    $: tablesRecords = records;
    onMount(() => {
        if (!$collections) loadCollections();
        collections.subscribe((value) => {
            data = value;
        });
        loadRecordList();
    });

    function loadRecordList() {
        const TABLES = ApiClient.collection("ttables");
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

<aside class="page-sidebar collection-sidebar">
    <div
        class="sidebar-content"
        class:fade={$isCollectionsLoading}
        class:sidebar-content-compact={filtered.length > 20}
    >
        <input type="text" placeholder="Search tables..." bind:value={searchTerm} />

        {#each tablesRecords as record (record.id)}
            <a
                href="/tables?recordId={record.id}"
                class="sidebar-list-item"
                class:active={$activeCollection?.id === record.id}
                on:click={() => selectTable(record)}
                use:link
            >
                <span class="txt">{record.name}</span>
            </a>
        {:else}
            {#if normalizedSearch.length}
                <p class="txt-hint m-t-10 m-b-10 txt-center">No tables found.</p>
            {/if}
        {/each}
    </div>

    {#if !$hideControls && tables_collection}
        <footer class="sidebar-footer">
            <button type="button" class="pb-btn pb-btn-block btn-outline" on:click={() => tableUpsertPanel?.show()}>
                <i class="ri-add-line" />
                <span class="txt">New table</span>
            </button>
        </footer>
    {/if}
</aside>
<RecordUpsertPanel
    bind:this={tableUpsertPanel}
    collection={tables_collection}
    on:save={loadRecordList}
    on:delete={loadRecordList}
/>
