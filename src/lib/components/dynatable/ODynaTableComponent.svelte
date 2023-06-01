<script lang="ts">
    import '@wolf-table/table/dist/table.min.css';
    // import {  } from '@codesandbox/sandpack-client';
    import { loadSandpackClient } from "@codesandbox/sandpack-client";

    import { onMount, onDestroy } from 'svelte';

    import Table from "@wolf-table/table";

    let tableBlock;
    let sandbox;
    let client;
    // let port = 3000;

    export let collections;
    export let width: number = 3500;
    export let height: number = 900;

    onMount(() => {
        console.log('collections', collections)
        const t = Table.create(
            tableBlock,
            () => width,
            () => height,
            {
                scrollable: true,
                resizable: true,
                selectable: true,
                editable: false,
                copyable: false,
                renderer: {
                    // style: {
                        // BackgroundColor: "#000",
                    // },
                    colHeader: {
                        
                    },
                    headerStyle: {
                        FontFace: "Source Sans Pro",
    
                    }
                },
                data: {
                   colWidth: 100,
                   cols:100,
                   rowHeight:20,
                   rows:100,
                //    cols: [10, 200, 200]
                }
                // style: {
                    // background: "transparent",
                // }
            }
            )
            .merge('A1:A100')
            .merge('B1:ZZ1')
            // .row(0)
            // .formulaParser((v) => 10)
            .render();

            // const library = new Library();
            // const canvas = library.DOM.canvas(960, 500);
            // console.log(canvas)

            
            // const sandboxEl = document.getElementB;

            
            // console.log(t.toHtml("A0"))
                // add style
            // const si = t.addStyle({
            //     bold: true,
            //     italic: true,
            //     underline: true,
            //     color: '#1b1c1d',
            // });
            // set cell
            // t.cell(2, 2, { value: 'set-value', style: si }).render();
    // /
            // get cell
            // console.log('cell[0,0]:', );
            // tableBlock.on("select", (v) => {
            //         console.log('select', v);
            //     });
            // tableBlock.querySelectorAll("canvas")[0].on("select", () => {
            //     console.log('aaa');
            // })
            console.log(t);
        })

</script>
<div style="padding-top: 20px;position:relative;overflow:hidden;max-height:calc( 100% - 80px)">
    <div class="parent">
        <div class="cells" style={`height:100%; width:100%;overflow:scroll;`}>
           
             <iframe bind:this={sandbox} />
        </div>
        <div class="formula-bar">
            <!-- <div bind:this={tableBlock} /> -->
  
        </div>
        <div class="props">
            2
        </div>
        <div class="footer">
          <iframe id="nodebox-iframe" />
        </div>
    </div>
    
</div>


<style lang="scss">
    .parent {
        height: 100%;
        position: relative;
        display: grid;
        overflow: hidden;
        grid-template-columns: 1fr 400px;
        grid-template-rows: 70px 1fr 200px;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
    }

    .cells { grid-area: 2 / 1 / 3 / 2;
        overflow: hidden;
        display: block;
        position: relative;
    }
    .formula-bar { grid-area: 1 / 1 / 2 / 3;
        display: block;
        position: relative;
        background:1px solid var(--cds-ui-04);
    }
    .props { grid-area: 2 / 2 / 4 / 3; }
    .footer { grid-area: 3 / 1 / 4 / 2; }
</style>