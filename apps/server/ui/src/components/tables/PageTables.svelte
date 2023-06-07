<script>
    import TablesSidebar from "./TablesSidebar.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import TableView from "./TableView.svelte";
    import { activeTable } from "@/stores/tables";
    import { loadCollections } from "@/stores/collections";


    loadCollections();
</script>

<TablesSidebar />

{#if !$activeTable}
    <PageWrapper center>
        <div class="placeholder-section m-b-base">
            <h1>Select table in left side panel!</h1>
        </div>
    </PageWrapper>
{:else}
    <PageWrapper>
        <header class="page-header">
            <nav class="breadcrumbs">
                <div class="breadcrumb-item">Tables</div>
                <div class="breadcrumb-item">{$activeTable.name}</div>
            </nav>
        </header>
        <TableView tableRecord={$activeTable} />
    </PageWrapper>
{/if}
