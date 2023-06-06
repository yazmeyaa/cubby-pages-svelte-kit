<script>
    import {pb as ApiClient} from "$lib/pocketbase";
    import { onMount } from "svelte";

    export let pivotRecord;

    let ref;
    let pivot = null;
    let sp;

    // function saveSpreadsheet() {
    //     const spreadsheetData = spreadsheet.serialize();
    //     if (!spreadsheetRecord) return;
    //     const { name } = spreadsheetRecord;
    //     const formData = new FormData();
    //     formData.append("data", JSON.stringify(spreadsheetData));
    //     formData.append("name", name);
    //     ApiClient.collection(spreadsheetRecord.collectionId).update(spreadsheetRecord.id, formData);
    // }

    function extractDataFields(record) {
        const uniqueFields = new Set();
        const data = record.data;

        data.forEach((item) => {
            const entries = Object.entries(item);
            const fields = entries.map((entrie) => entrie[0]);
            const filtered = fields.filter((item) => item !== "$keyArr");
            filtered.forEach((field) => uniqueFields.add(field));
        });

        return Array.from(uniqueFields);
    }

    function formatFieldsArrayToFieldsOfPivot(fields) {
        return fields.map((item) => {
            return {
                id: item,
                label: item,
            };
        });
    }

    function createSpreadsheet(record) {
        if (pivot) {
            pivot.destructor();
        }
        const fields = extractDataFields(pivotRecord);

        const formattedFields = formatFieldsArrayToFieldsOfPivot(fields);
        /*! Temporary disabled 12.05.2023 */
        // pivot = new dhx.Pivot("pivot", {
        //     fields: {
        //         rows: [],
        //         columns: [],
        //         values: [],
        //     },
        //     fieldList: formattedFields,
        // });
        // pivot.setData(record.data);

        // spreadsheet.parse(JSON.stringify(record.data));
        // spreadsheet.events.on("afterAction", saveSpreadsheet);
    }

    onMount(() => {
        createSpreadsheet(pivotRecord);
    });

    $: {
        createSpreadsheet(pivotRecord);
    }

    $: if (ref) {
        sp = pivot.JSON;
    }
</script>

<div>
    <!-- ! Temporarily disabled 12.05.2023 -->
    <!-- {#if !pivotRecord}
        <span>Select table left side panel!</span>
    {:else}
        <div
            bind:this={ref}
            style="min-height: 80vh; height: 80vh"
            class="dhx_sample-container__widget"
            id="pivot"
        />
    {/if} -->
    <strong class="error_text">Temporarily disabled</strong>
</div>

<style>
    .error_text {
        color: var(--cds-text-error);
    }
</style>