<script>
    import SpreadsheetsSidebar from "../spreadsheets/SpreadsheetsSidebar.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    // import TableView from "./TableView.svelte";
    import { activeTable } from "@/stores/tables";
    import { loadCollections } from "@/stores/collections";

    loadCollections();
</script>