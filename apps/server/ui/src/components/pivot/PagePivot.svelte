<script>
    import PivotSidebar from "./PivotSidebar.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import PivotView from "./PivotView.svelte";
    import { activePivot } from "@/stores/pivots";
    import { loadCollections } from "@/stores/collections";

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
            <nav class="breadcrumbs">
                <div class="breadcrumb-item">Pivots</div>
                <div class="breadcrumb-item">{$activePivot.name}</div>
            </nav>
        </header>
        <PivotView pivotRecord={$activePivot} />
    </PageWrapper>
{/if}
