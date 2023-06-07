<script>
    import SpreadsheetsSidebar from "./SpreadsheetsSidebar.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    import SpreadsheetView from "./SpreadsheetView.svelte";
    import { activeTable } from "@/stores/tables";
    import { loadCollections } from "@/stores/collections";
    import { Breadcrumb, BreadcrumbItem, Column, Content, Grid, Row } from "carbon-components-svelte";

    loadCollections();
</script>

<SpreadsheetsSidebar />

{#if !$activeTable}
    <Grid>
        <Column padding>
            <h2>Select Spreadsheet in left side panel!</h2>
        </Column>
    </Grid>
{:else}
    <Grid>
        <Row padding>
            <Column>
                <Breadcrumb>
                    <BreadcrumbItem>Spreadsheets</BreadcrumbItem>
                    <BreadcrumbItem>{$activeTable.name}</BreadcrumbItem>
                </Breadcrumb>
            </Column>
        </Row>
        <Row>
            <Column>
                <SpreadsheetView spreadsheetRecord={$activeTable} />
            </Column>
        </Row>
    </Grid>
{/if}
