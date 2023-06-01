<script>
    import SpreadsheetsSidebar from "../spreadsheets/SpreadsheetsSidebar.svelte";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    // import TableView from "./TableView.svelte";
    import { activeTable } from "$lib/stores/tables";
    import { loadCollections } from "$lib/stores/collections";

    loadCollections();
</script>