<script>
    // import CubeSidebar from "./CubesSidebar.svelte";
    import PageWrapper from "@/components/base/PageWrapper.svelte";
    // import TableView from "./TableView.svelte";
    import { activeTable } from "@/stores/tables";
    import { loadCollections } from "@/stores/collections";
    // import "@/components/pivot_trial/codebase/pivot";
    import ApiClient from "@/utils/ApiClient";
    import { onMount, onDestroy } from "svelte";

    import CodeEditor from "../base/CodeEditor.svelte";
    import Db from "./DB.svelte";
    import { writable } from 'svelte/store';
    // import { DatasetController } from 'chart.js';

    let container;
    let pivot;

    let selected_collection = writable(null);
    let pivot_collection = writable(null);
    let all_collections = writable([]);

    selected_collection.subscribe((v) => {
        console.log(v);

        if (v == null) {
            //  
        } else {
            let c = $all_collections.find(vv => vv.id == v);
            // console.log(c);
            pivot_collection.set(c.schema);
            console.log()
        }
    })

    pivot_collection.subscribe(async (v) => {
        if (v == null) return;
        console.log("pivot coll", v)

        let c = ($selected_collection !== null) ? (await ApiClient.collection($all_collections.find(vv => vv.id == $selected_collection)?.name).getFullList()) : []
        console.log("ccc", c)
        pivot = new dhx.Pivot(container, {
            data: c,
            layout: {
                columnsWidth: "auto",
                rowsHeadersWidth: "auto",
                gridMode: "flat",
                repeatRowsHeaders: false,
                fieldSelectorType: "loop",
                footer: true,
            },
            fields: {
                rows: [],
                columns: [],
                values: [],
            },
            
            fieldList: [
                {id: "collectionId", label: "collectionId"},
                {id: "collectionName", label: "collectionName"},
                {id: "created", label: "created"},
                ...$pivot_collection.map(e => ({id: e.name, label: e.name})),
                // ...sp,
                // ...spec.schema.map(e => ({id: e.name, label: e.name})),
                // spec
                // { id: "name", label: "Name" },
                // { id: "year", label: "Year" },
                // { id: "continent", label: "Continent" },
                // { id: "form", label: "Form" },
                // { id: "gdp", label: "GDP" },
                // {
                //     id: "oil",
                //     label: "Oil",
                //     cellTemplate: function (text, row, col) {
                //         if (col.method === "sum") {
                //         return '<div class="customCell">' + (text||"") + '</div>'
                //         } else {
                //         return '<input class="custom_div" type="checkbox" disabled ' + (text > 3 ? "checked" : "") + ' ></div>'
                //         }
                //     }
                // },
                // { id: "balance", label: "Balance" },
                // { id: "when", label: "When", type: "date", format: "%d/%m/%Y" }
            ],
        });
    })

    onMount(async () => {
        // let hierarcji
        let sp = [];
        let colls = [];
        let recs = [];
        let all_dims = await ApiClient.collections.getFullList();
        all_collections.set(all_dims);

        console.log(all_dims);
        // let spec = await ApiClient.collections.getOne("hy_data");
        // let spec2 = await ApiClient.collections.getOne("cb_test_cube");

        // spec2.schema.map((e) => {
        //     if (e.type === "relation") {
        //         sp.push({ name: `collectionName`, title: `collectionName` });
        //         all_dims
        //             .find((ee) => ee.id == e.options.collectionId)
        //             ?.schema?.map((d) => {
        //                 sp.push({
        //                     name: `${e.options.collectionId}.${d.name}`,
        //                     title: `${e.options.collectionId}:${d.name}`,
        //                 });
        //             });
        //         colls.push({ id: e.options.collectionId });
        //         recs.push(
        //             async () =>
        //                 await ApiClient.collection(e.options.collectionId).getFullList({
        //                     // sort: '-created',
        //                 })
        //         );
        //     }
        // });

        // spec = spec.filter(v => v.name.startsWith("hy_"));
        // console.log(spec2, sp, recs);

        // console.log(await Promise.all(recs.map(e => e())));
        // const records =

        // let current = spec[0]

        
        // await pivot.load("https://snippet.dhtmlx.com/codebase/data/pivot/01/dataset.json")
    });
</script>

{#if !$activeTable}
    <PageWrapper>
        <header class="page-header" />

        <div
            bind:this={container}
            style={"position:absolute;margin-left:0px;min-height:80vh;min-width:100%;width:calc(100vw-40px);height:100vh;margin:-30px;margin-top:-96px;"}
        />
    </PageWrapper>
{/if}
<div style="position:absolute;right:220px;top:20px; width:400px">
    <!-- <button class="btn btn-block btn-outline">123</button> -->
    выбор коллекции <select name="cars" id="cars" bind:value={$selected_collection}>
        {#each $all_collections as k} <option value={k.id}>{k.name}</option>{/each}
       
        </select>
</div>
