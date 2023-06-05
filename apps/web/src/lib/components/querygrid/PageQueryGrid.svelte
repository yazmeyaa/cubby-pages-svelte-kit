<script>
    import { querystring, replace } from "svelte-spa-router";
    import CommonHelper from "$lib/utils/CommonHelper";
    import {
        collections,
        activeCollection,
        isCollectionsLoading,
        loadCollections,
        changeActiveCollectionById,
    } from "$lib/stores/collections";
    import tooltip from "$lib/actions/tooltip";
    import { pageTitle, hideControls } from "$lib/stores/app";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Searchbar from "$lib/components/base/Searchbar.svelte";
    import RefreshButton from "$lib/components/base/RefreshButton.svelte";
    import CollectionUpsertPanel from "$lib/components/collections/CollectionUpsertPanel.svelte";
    import CollectionDocsPanel from "$lib/components/collections/CollectionDocsPanel.svelte";
    import RecordUpsertPanel from "$lib/components/records/RecordUpsertPanel.svelte";
    import RecordPreviewPanel from "$lib/components/records/RecordPreviewPanel.svelte";
    import RecordsList from "$lib/components/records/RecordsList.svelte";
    import QueryGridListSidebar from "./QueryGridListSidebar.svelte";
    import HierarchyView from "./QueryGridView.svelte";
    import { onMount } from "svelte";

    const queryParams = new URLSearchParams($querystring);

    let collectionUpsertPanel;
    let collectionDocsPanel;
    let recordUpsertPanel;
    let recordPreviewPanel;
    let recordsList;
    let filter = queryParams.get("filter") || "";
    let sort = queryParams.get("sort") || "";
    let selectedCollectionId = queryParams.get("collectionId") || $activeCollection?.id;

    let isHierarchyMode;

    $: reactiveParams = new URLSearchParams($querystring);

    // $: isHierarchyMode = reactiveParams.get("collectionId") === "_pb_hy_collections_";
    // $: isHierarchyMode = checkIsHYCollection($activeCollection);

    function checkIsQueryGridCollection(collection) {
        const hyPrefixRegex = /^qg_.+/;
        if (hyPrefixRegex.test(collection.name)) {
            isHierarchyMode = true;
        } else {
            isHierarchyMode = false;
        }
    }

    onMount(() => {
        activeCollection.subscribe((collection) => checkIsQueryGridCollection(collection));
    });

    $: if (
        !$isCollectionsLoading &&
        reactiveParams.get("collectionId") &&
        reactiveParams.get("collectionId") != selectedCollectionId
    ) {
        changeActiveCollectionById(reactiveParams.get("collectionId"));
    }

    // reset filter and sort on collection change
    $: if ($activeCollection?.id && selectedCollectionId != $activeCollection.id) {
        reset();
    }

    // keep the url params in sync
    $: if (sort || filter || $activeCollection?.id) {
        const query = new URLSearchParams({
            collectionId: $activeCollection?.id || "",
            filter: filter,
            sort: sort,
        }).toString();
        replace("/querygrid?" + query);
    }

    $: $pageTitle = $activeCollection?.name || "Collections";

    function reset() {
        selectedCollectionId = $activeCollection?.id;
        filter = "";
        sort = "-created";

        // clear default sort if created field is not available
        if (
            $activeCollection?.$isView &&
            !CommonHelper.extractColumnsFromQuery($activeCollection.options.query).includes("created")
        ) {
            sort = "";
        }
    }

    loadCollections(selectedCollectionId);
</script>

{#if $isCollectionsLoading && !$collections.length}
    <PageWrapper center>
        <div class="placeholder-section m-b-base">
            <span class="loader loader-lg" />
            <h1>Loading collections...</h1>
        </div>
    </PageWrapper>
{:else}
    <QueryGridListSidebar />
    <PageWrapper>
        <header class="page-header">
            <nav >
                <div class="breadcrumb-item">Query Grid</div>
            </nav>

            <div class="inline-flex gap-5">
                {#if !$hideControls}
                    <button
                        type="button"
                        aria-label="Edit collection"
                        class="pb-btn pb-btn-transparent pb-btn-circle"
                        use:tooltip={{ text: "Edit collection", position: "right" }}
                        on:click={() => collectionUpsertPanel?.show($activeCollection)}
                    >
                        <i class="ri-settings-4-line" />
                    </button>
                {/if}

                <RefreshButton on:refresh={() => recordsList?.load()} />
            </div>
        </header>

        {#if !isHierarchyMode}
            <div class="center-content">
                <div class="placeholder-section m-b-base">
                    <h1>Select collection in left side panel!</h1>
                </div>
            </div>
        {:else}
            <HierarchyView collection={$activeCollection} />
        {/if}
    </PageWrapper>
{/if}

<CollectionUpsertPanel bind:this={collectionUpsertPanel} />

<CollectionDocsPanel bind:this={collectionDocsPanel} />

<RecordUpsertPanel
    bind:this={recordUpsertPanel}
    collection={$activeCollection}
    on:save={() => recordsList?.reloadLoadedPages()}
    on:delete={() => recordsList?.reloadLoadedPages()}
/>

<RecordPreviewPanel bind:this={recordPreviewPanel} collection={$activeCollection} />
