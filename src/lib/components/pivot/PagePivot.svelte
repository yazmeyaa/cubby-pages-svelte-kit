<script>
    import PivotSidebar from "./PivotSidebar.svelte";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import PivotView from "./PivotView.svelte";
    import { activePivot } from "$lib/stores/pivots";
    import { loadCollections } from "$lib/stores/collections";

    loadCollections();
</script>

<PivotSidebar />

{#if !$activePivot}
    <PageWrapper center>
        <div class="placeholder-section m-b-base">
            <h1>Select Spew in left side panel!</h1>
        </div>
    </PageWrapper>
{:else}
    <PageWrapper>
        <header class="page-header">
            <nav >
                <div class="breadcrumb-item">Pivots</div>
                <div class="breadcrumb-item">{$activePivot.name}</div>
            </nav>
        </header>
        <PivotView pivotRecord={$activePivot} />
    </PageWrapper>
{/if}
