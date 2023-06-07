<script>
    import ApiClient from "@/utils/ApiClient";
    import { onMount } from "svelte";

    export let tableRecord;
    let ref;
    let spreadsheet = null;
    let sp;

    function saveSpreadSheetToDataBase() {
        const currentSpreadSheetData = spreadsheet.serialize();
        updateTableData(currentSpreadSheetData);
    }

    function updateTableData(dataToSave) {
        if (!tableRecord) return;
        const { name } = tableRecord;

        const formData = new FormData();

        formData.append("data", JSON.stringify(dataToSave));
        formData.append("name", name);

        const collectionId = tableRecord.collectionId;
        const recordId = tableRecord.id;

        ApiClient.collection(collectionId).update(recordId, formData);
    }

    function createTable(record) {
        if (spreadsheet) {
            // Если spreadsheet существует
            // уничтожаем текущий экземпляр DHTMLX.SpreadSheet
            spreadsheet.destructor();
        }

        spreadsheet = new dhx.Spreadsheet("spreadsheet", {
            topSplit: 2,
        });
        let data777 = JSON.stringify(record.data);
        spreadsheet.parse(data777);

        spreadsheet.events.on("afterAction", saveSpreadSheetToDataBase);
    }

    $: console.log(`Изменился tableRecord на ${tableRecord}`);

    onMount(() => {
        createTable(tableRecord);
    });

    $: {
        createTable(tableRecord);
    }

    $: if (ref) {
        sp = spreadsheet.JSON;
    }
</script>

<div>
    {#if !tableRecord}
        <span>Select table left side panel!</span>
    {:else}
        <div
            bind:this={ref}
            style="min-height: 80vh; height: 80vh"
            class="dhx_sample-container__widget"
            id="spreadsheet"
        />
    {/if}
</div>
