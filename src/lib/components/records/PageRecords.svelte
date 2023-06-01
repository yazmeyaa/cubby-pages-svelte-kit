<script>
    import { replace, querystring } from "svelte-spa-router";
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
    import CollectionsSidebar from "$lib/components/collections/CollectionsSidebar.svelte";
    import CollectionUpsertPanel from "$lib/components/collections/CollectionUpsertPanel.svelte";
    import CollectionDocsPanel from "$lib/components/collections/CollectionDocsPanel.svelte";
    import RecordUpsertPanel from "$lib/components/records/RecordUpsertPanel.svelte";
    import RecordPreviewPanel from "$lib/components/records/RecordPreviewPanel.svelte";
    import RecordsList from "$lib/components/records/RecordsList.svelte";
    import { Breadcrumb, BreadcrumbItem, Button } from "carbon-components-svelte";
    import  Settings  from "carbon-icons-svelte/lib/Settings.svelte";
    import Reset from "carbon-icons-svelte/lib/Reset.svelte";
    import Add from 'carbon-icons-svelte/lib/Add.svelte'

    import {_} from 'svelte-i18n'

    const queryParams = new URLSearchParams($querystring);

    let collectionUpsertPanel;
    let collectionDocsPanel;
    let recordUpsertPanel;
    let recordPreviewPanel;
    let recordsList;
    let filter = queryParams.get("filter") || "";
    let sort = queryParams.get("sort") || "";
    let selectedCollectionId = queryParams.get("collectionId") || $activeCollection?.id;

    $: reactiveParams = new URLSearchParams($querystring);

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
    // $: if (sort || filter || $activeCollection?.id) {
    //     const query = new URLSearchParams({
    //         collectionId: $activeCollection?.id || "",
    //         filter: filter,
    //         sort: sort,
    //     }).toString();
    //     replace("/collections?" + query);
    // }

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
{:else if !$collections.length}
    <PageWrapper center>
        <div class="placeholder-section m-b-base">
            <div class="icon">
                <i class="ri-database-2-line" />
            </div>
            {#if $hideControls}
                <h1 class="m-b-10">You don't have any collections yet.</h1>
            {:else}
                <h1 class="m-b-10">Create your first collection to add records!</h1>
                <button
                    type="button"
                    class="pb-btn btn-expanded-lg btn-lg"
                    on:click={() => collectionUpsertPanel?.show()}
                >
                    <i class="ri-add-line" />
                    <span class="txt">Create new collection</span>
                </button>
            {/if}
        </div>
    </PageWrapper>
{:else}
    <CollectionsSidebar />

    <PageWrapper >
        <header style="display: flex; align-items: center; height: 40px;margin-left: 1rem; box-sizing:border-box"> <!-- style="margin-top: 10.6px;"-->
            <Breadcrumb>
                <BreadcrumbItem >{$_("pageRecords.breadcrumbs.page")}</BreadcrumbItem>
                <BreadcrumbItem>{$pageTitle}</BreadcrumbItem>
            </Breadcrumb>
            <!-- <nav >
                <div class="breadcrumb-item">{$_("pageRecords.breadcrumbs.page")}</div>
                <div class="breadcrumb-item">{$pageTitle}</div>
            </nav> -->
        </header>
        <div class="clearfix" />

        <RecordsList
            bind:this={recordsList}
            collection={$activeCollection}
            bind:filter
            bind:sort
            on:select={(e) => {
                $activeCollection.$isView
                    ? recordPreviewPanel.show(e?.detail)
                    : recordUpsertPanel?.show(e?.detail);
            }}
            on:new={() => recordUpsertPanel?.show()}
        >
            <svelte:fragment slot="editCollection">
                <Button
                    size="field"
                    kind="ghost"
                    iconDescription={$_('pageRecords.table.toolbar.settings.description')}
                    icon={Settings}
                    on:click={() => collectionUpsertPanel?.show($activeCollection)}
                />
            </svelte:fragment>

            <svelte:fragment slot="refreshButton">
                <Button 
                    size="field"
                    kind="ghost"
                    iconDescription={$_('pageRecords.table.toolbar.refresh.description')}
                    icon={Reset}
                    on:click={(() => recordsList?.load())}
                />
            </svelte:fragment>
        </RecordsList>
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

<style>
</style>