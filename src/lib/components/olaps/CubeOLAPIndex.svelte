<script>
    // import CubeSidebar from "./CubesSidebar.svelte";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    // import TableView from "./TableView.svelte";
    import { activeTable } from "$lib/stores/tables";
    import { loadCollections } from "$lib/stores/collections";
    // import "$lib/components/pivot_trial/codebase/pivot";
    import ApiClient from "$lib/utils/ApiClient";
    import { onMount, onDestroy } from "svelte";

    import CodeEditor from "../base/CodeEditor.svelte";
    import Db from "./DB.svelte";
    import { writable } from 'svelte/store';
    import { prop_dev } from 'svelte/internal';
    import { tick } from 'svelte';
    // import { DatasetController } from 'chart.js';

    let container;
    let pivot;

    let meta = writable(null);
    let selected_cube = writable(null);
    // let selected_cube = writable(null);
    let all_cubes = writable([]);
    let cube_content = writable("");
    let byDimenInfo = writable({});
    // let 

    selected_cube.subscribe((v) => {

        if (v == null) {
            //  
            let prep = {};
            byDimenInfo.set(prep);
        } else {
            let prep = {};

            let found = $meta.database.cubes.find(v => v.id == v);
            found?.dimensions.map((e, i) => {
                if (i == 0) {
                    prep[e] = 'header'
                } else if (i == 1) {
                    prep[e] = 'column'
                } else if (i >= 2) {
                    prep[e] = 'row'
                }
                
            })

            byDimenInfo.set(prep);
        }
    })

    // pivot_collection.subscribe(async (v) => {
        
    // })

    onMount(async () => {

        fetch("http://localhost:8000/databases/db/catalog").then(e => {
            return e.json()
        }).then(e => {
            meta.set(e);
         
        })

        // fetch("http://127.0.0.1:8000/cells/?db=db&cube=name&path=sss").then(e => {
        //     return e.json()
        // }).then(e => {
        //     console.log(e)
        //     cube_content.set(e.cells);
        // })
        // let hierarcji
        // all_collections.set(all_dims);

        // console.log(all_dims);
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

    // byDimenInfo.subscribe(vvv => {
    //     alert('a')
    // })

    async function reloadGrid() {
        let all_sel = true;
        let [c, h, r] = [[], [], []];
        console.log("byDimenInfo", $byDimenInfo)

        Object.keys($byDimenInfo).map(e => {
            if ($byDimenInfo[e] === '') {
                all_sel = false;
            }
            if ($byDimenInfo[e] === 'row') {
                r.push(e)
            } else if ($byDimenInfo[e] === 'column') {
                c.push(e);
            } else if ($byDimenInfo[e] === 'header') {
                c.push(e);
            }
        })

        if (all_sel) {
            fetch(`http://localhost:8000/cells/?db=db&cube=${$selected_cube}&path=s&header=${encodeURI(h.join("|"))}&column=${encodeURI(c.join("|"))}&row=${encodeURI(r.join("|"))}`).then(e => {
                return e.json()
            }).then(e => {
                // console.log(e)
                cube_content.set(e.cells);
                return  tick();
                
            }).then(() => {
                // console.log("aaaa", container.querySelectorAll("td"))
               
                container.querySelectorAll("td").forEach(ee => {
                    
                    ee.addEventListener("click", (e) => {
                        // alert('a')
                        // ee.removeEventListener("click");
                        ee.setAttribute("contenteditable", "true");
                        setTimeout(ee.focus, 1000);
                        ee.addEventListener("input", (e) => {
                            console.log((e.target).innerText);

                        })
                    });
                })
            })
        } else {
            cube_content.set("<h2>Выберите корректные настройки для измерений</h2>");
        }
    }

</script>

{#if !$activeTable}
    <PageWrapper>
        <header class="page-header"></header>
        <div
            bind:this={container}
            style={"position:absolute;margin-left:0px;min-height:80vh;min-width:100%;width:calc(100vw-40px);height:100vh;margin:-30px;margin-top:-0x;"}
        >
        <br />{#if $selected_cube}<br /><h1 style="margin-left:20px;">Куб "{$selected_cube}"</h1>{/if}<br />
        {@html $cube_content}
        </div>
        <!-- <hr style="width:100%;margin-left:-30px;margin-right:-30px;" /> -->

    </PageWrapper>
{/if}
<div style="position:absolute;right:0px;top:0;bottom:auto; width:calc(100% - 75px); z-index:999;padding:0px;box-shadow: 0 0 10px rgba(0,0,0,0.3)">
    {#if $meta !== null }<table style="border-bottom:none;">
        <tr>
            <td>выберите куб
                <select name="cars" id="cars" bind:value={$selected_cube} style="max-width:300px;">
                    <option>не выбрано</option>
                    {#each $meta.database.cubes as k} <option value={k.id}>{k.id} ({k.dimensions.length} dimensions)</option>{/each}
                </select>
            </td>
           
            {#each ($meta.database.cubes.find(v => v.id == $selected_cube)?.dimensions) || [] as nn}
                <td>Измерение {nn}
                    <select name={nn} value={byDimenInfo[nn] || ''} on:change={(v) => {
                        console.log(v.target?.value);
                        byDimenInfo.update(vv => {
                            vv[nn] = v.target?.value;
                            return vv;
                        });
                        // setTimeout(reloadGrid, 100)
                        reloadGrid();
                    
                    }}>
                    <option value={''} >не выбрано</option>
                        <option value={'header'} >заголовок</option>
                        <option value={'column'}>колонки</option>
                        <option value={'row'} >значения</option>
                    </select>
                </td>
            {/each}
        </tr>
    </table>
    {/if}
    <!-- <button class="btn btn-block btn-outline">123</button> -->
    
</div>

<style lang="scss">
    .bx--data-table-container {
        table.bx--data-table {
            tr td, tr th {
                height:30px !important;
            }
        }
    }
</style>