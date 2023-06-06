<script>
    import {pb as ApiClient} from "$lib/pocketbase";
    import { onMount } from "svelte";

    let treeGridRef;
    let treeGrid;
    /** @type {(Array)} */
    let columns;

    export let collection;

    function createGrid(collection) {
        if (treeGrid) {
            treeGrid.destructor(); // уничтожаем текущий экземпляр DHTMLX.TreeGrid
        }

        columns = convertCollectionSchemaToColumns(collection); // на основе полученных данных строим колонки

        treeGrid = new dhx.TreeGrid("widget", {
            columns: columns,
            editable: true,
            autoWidth: true,
        });

        getDataFromCollection(collection).then((result) => {
            const resultWithFilteredParrent = result.map((item) => {
                item.parent = item.parent === "" ? undefined : item.parent;
                return item;
            });
            treeGrid.data.parse(resultWithFilteredParrent);
        });
    }

    async function getDataFromCollection(collection) {
        const collectionRecords = await ApiClient.collection(collection.id).getList(1, 500, {
            $autoCancel: false,
        }); // Максимальное значение 500. Непонятно как без ограничений всё достать.
        return collectionRecords.items;
    }

    function convertCollectionSchemaToColumns(collection) {
        // Converting "type" field from database to valid "type" for grid
        const typesFromDBMap = {
            text: "string",
            url: "link",
            select: "combo",
            bool: "ch",
            file: "string",
            number: "string",
            email: "string",
            date: "string",
            json: "string",
            relation: "string",
        };

        const columns = collection.schema.map((schemaItem) => {
            const { name, type } = schemaItem;
            return {
                id: name,
                type: typesFromDBMap[type],
                header: [{ text: name }],
            };
        });

        return columns;
    }

    // создаем новый экземпляр DHTMLX.TreeGrid при первом монтировании компонента
    onMount(() => {
        createGrid(collection);
    });

    // уничтожаем текущий экземпляр DHTMLX.TreeGrid и создаем новый при изменении пропса collection
    $: {
        createGrid(collection);
    }
</script>

<div id="widget" style=" padding: 20px 20px 0;" bind:this={treeGridRef} />
