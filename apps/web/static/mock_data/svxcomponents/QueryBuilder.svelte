<script lang="ts">
     import { Grid, Row, Column,Tile, ButtonSet, ComboBox, InlineLoading, SkeletonText, TextInput, Button, OverflowMenu, OverflowMenuItem, Toggle,Toolbar,
        ToolbarBatchActions,
        DataTable,
    ToolbarContent,
    ToolbarSearch,
    Dropdown,
    ToolbarMenu,
    Form,
    RadioButtonGroup,Popover,
    RadioButton, Tag,
    FormGroup,
    Checkbox,
    ToolbarMenuItem,} from "carbon-components-svelte";

import { Tabs, Tab, TabContent } from "carbon-components-svelte";

    import VerticalList from "./VerticalList.svelte";
    
    import { writable, type Writable } from "svelte/store";

    import { connect, JSONCodec, type Codec, type NatsConnection} from "nats.ws";
    
    export let views = writable([]);
    let hovering = writable({});
    let lcl = JSON.parse(localStorage?.getItem('cubby_defaults') || "{}");
    let cube = writable(null);

    let cubes_list = writable([]);
    let dims_list = writable([]);

    let lcl_views = writable([]);
    // lcl[document.location.pathname][`views`] ? lcl[document.location.pathname][`views`]: 
    let pre_views = writable([
    //     {id: '1', name: "test2", meta: {
    //     cube: "00.03._Адм{Курсы",
    //     rows: [],
    //     cols: [],
    //     type: "lcl",
    //     dims_list: [],
    // }}, {id: '2', name: "test", meta: {
    //     cube: "00.03._Адм{Курсы",
    //     rows: [],
    //     cols: [],
    //     type: "lcl",
    //     dims_list: [],
    // }}
]);
    let active = writable("1");
    let nc: NatsConnection | null = null;
    let sc: any = JSONCodec();
    let hasFatalError : Writable<{
        code: number,
        message: string,
    }> = writable(false);

    let unused_dimensions = writable([]);
    let selected_rows = writable([]);
    let selected_cols = writable([]);
    
    export let datasource = "default:tm1"
    // export let query

    enum QMElement {
        Cell = "cell",
        Cube = "cube",
        TextValue = "input",
        SelectValue = "select",
        ValueOfText = "input_val",
        ValueOfSelect = "select_val",
    }
    import { onMount, onDestroy } from 'svelte';
    import { update } from "lodash";
    import Board from "./Board.svelte";
    import HorizontalList from "./HorizontalList.svelte";

    type QMeta = any;

    onMount(() => {
        lcl  = JSON.parse(localStorage?.getItem('cubby_defaults') || "{}");
        cube.update( v => lcl[document.location.pathname].cube ? lcl[document.location.pathname][`cube`]: null);

         unused_dimensions.subscribe(v => {
            // console.log('dims', v);
            // board.set([]);
            board.set([{id: 'all',
                name: "all",
                    items: v,
                }]);
             updateQ();
        })

        selected_rows.subscribe(v => {
            updateQ();
        })
        selected_cols.subscribe(v => {
            updateQ();
        })

        cube.subscribe(v => {
            initial = WaitInitial([]);
        })
        // unused_dimensions.subscribe(v => {
           
        // });
    })

    onDestroy(() => {
        if (nc !== null) {
            nc.close();
        };
        
    })

    async function WaitInitial(q: Array<Array<string>>) {
        if (!nc) {
            try {
                nc = await connect({ servers: [  `ws://${document.location.hostname}:8866` ] })
            } catch(e) {
                hasFatalError.set({
                    code: 500,
                    message: "Не удалось подключиться к серверу шины данных"
                })
                return Promise.reject("wrong conn")
            }
        }

        let result = await nc?.request("cubby.back.query.workspace.datasource.v2-spec", sc.encode({
            input: {
                cube: $cube,
                // query: i[1],
            },
            
        }), { timeout: 20000 })
            .then(m => {
                let msg = sc.decode(m.data);
                cubes_list.update(e => msg.cubes);
                dims_list.update(e => msg.dimensions);
                unused_dimensions.update(e => msg.dimensions);

                 selected_cols.set([]); selected_rows.set([]);
            }).catch((e) => {
                // console.log(e);
                hasFatalError.set({
                    code: 500,
                    message: e.toString(),
                })
            })

        
        // let b_prom = new Promise<QMeta>((resolve, reject) => {
    
        //  })
        // return b_prom;
    }
    
    let initial = WaitInitial([])
        .then((nc) => {
            // meta={{
            //     rows: ['Статьи_Выплат'],
            //     columns: ['Показатели_ОХР{Выплаты'], 
            // }}
            // query={{
            //     select: `  {TM1SubsetToSet([Показатели_ОХР{Выплаты].[Показатели_ОХР{Выплаты], "Показатели")}       ON COLUMNS,     {TM1SubsetToSet([Статьи_Выплат].[Статьи_Выплат], "Выплаты_управленч_хар-ра")}       ON ROWS `,
            //     from: '04.02._ОХР{Выплаты',
            //     where: {
            //         Год: null,
            //         Период: null,
            //         Сценарии: null,
            //         Валюта_отчета: null,
            //         Валюты_ввода: null,
            //         Контрагенты: null,
            //     },
            // }}
            
            // hovering = {};
            return hovering;
        })
    
    let board = writable([]);

        
    const updateQ = function () {
        let prep = $unused_dimensions.map(el => el.Name);
        let postp = {};
        prep.map(e => {
            postp[e] = null;
        })

        let pres = $selected_cols.map(e => `{TM1SubsetAll([${e.id}] )}`) + ' ON COLUMNS, ';
            pres += $selected_rows.map(e => `{TM1SubsetAll([${e.id}])}`) + ' ON ROWS';

        let res = {
            ready_to_display: $selected_rows.length != 0 && $selected_cols.length,
            from: $cube,
            key: writable(Math.random()),
            options: {},
            meta: {
                rows: $selected_rows,
                columns: $selected_cols,     
            },
            query: {
                select: pres,
                from:  $cube,
                where: postp,
                options: {},
            }
        
        }
        // console.log(res,  $selected_cols);
        hovering.set(res);
    }
    // let resultPass = writable();
</script>
<br />
<Row >
           
                       
                                 <Column lg={3} md={3} sm={3}>
                    
                    <ComboBox
                        selectedId={$cube}
                        placeholder={$cube ? $cube : "Выберите куб" }
                     
                        size="xl"
                        warnText="This contact method is not associated with your account"
                        items={[
                            {id: undefined, text: "нет значения (сброс)", label:"", disabled: false},
                            ...$cubes_list.map(e => {
                                return {
                                    id: e.id, text: e.text,
                                }
                            })
                            // ...$data[dt[0]]?.data.map(el => ({ id: el.id, text: el.label, disabled: el.disabled, label:el.text }))
                        ]}
                        on:select={(e) => {
                            // alert(e);
                            // const __v = e.detail.selectedId;
                            // if (__v === values[dt[0]]) return;
                            // console.log('selected ', e);

                            if ($cube !== e.detail.selectedId) {
                                if (lcl[document.location.pathname] === undefined) {
                                    lcl[document.location.pathname] = {}
                                }
                                // lcl[document.location.pathname][`cube`] = e.detail.selectedId !== "" ? e.detail.selectedId : null;
                                localStorage.setItem("cubby_defaults", JSON.stringify(lcl));
                                initial = WaitInitial([]);
                                cube.update(v => e.detail.selectedId);
                                dims_list.update(v => []);
                                unused_dimensions.update(v => []);
                                selected_cols.update(v => []);
                                selected_rows.update(v => []);
                            }
                            
                            // localStorage.setItem("cubby_defaults", JSON.stringify(lcl));
                            
                            // values.update(v => {
                            //     // console.log(e);
                            //     return {
                            //         // ...v,
                            //         // [ dt[0] ]: __v !== "" ? __v : null,
                            //     }
                            // })
                        }}>

                
                    </ComboBox>
                    
                           
                            <br />
                        </Column>
                        <Column lg={3} md={3} sm={3}>
                        <Button kind="secondary"  style="margin-right:10px;" on:click={() => {
                            updateQ();
                        }}>Обновить запрос</Button>
                    </Column>
                        
                        <Column lg={3} md={3} sm={3}>
  
                            <Button disabled={$cube == null} kind="ghost" style="margin-right:10px;"  on:click={() => {
                               cube.update(v => null);
                            //    cubes_list.update(e => );
                                dims_list.update(e => []);
                                unused_dimensions.set([]);
                                selected_cols.set([]);
                                selected_rows.set([]);
                            }}>Сброс значений</Button>
                         
                                </Column>
                                <Column lg={7} md={7} sm={7}>
                             
                            <div style="float:left;height:40px;width:100%;">
                           <Tabs size="small" on:change={(e) => {
                            console.log(e);
                           }}>
                           {#each $views as item(item.id)}
                            <Tab label={item.name} />
                            {/each}
                           
                            <svelte:fragment slot="content">
                          
                            </svelte:fragment>
                            </Tabs></div>
                                </Column>
</Row>
<br />

<Row >
                                <Column  lg={$unused_dimensions.length == 0 ? 1 : 3} md={$unused_dimensions.length == 0 ? 1 : 3} sm={$unused_dimensions.length == 0 ? 1 : 3} style="user-select:none;position:relative;">
                                    
                                    <VerticalList bind:items={$unused_dimensions} moveToRows={(id) => {
                                        $selected_rows.push($unused_dimensions.find(e => e.id == id));
                                        $unused_dimensions.filter( e => e.id != id);
                                    }} moveToCols={() => {

                                    }}/>
                                    
                            </Column>
                            <Column  lg={$unused_dimensions.length == 0 ? 15 : 13} md={$unused_dimensions.length == 0 ? 15 : 13} sm={$unused_dimensions.length == 0 ? 15 : 13}>
                                <Row>
                                     <Column lg={8} md={8} sm={8} style="">
                                
                                 <HorizontalList bind:items={$selected_rows} onDrop={(lst) => {
                                    selected_rows.set(lst);
                                 } } title="строки" />
                                
                            </Column>
                           
                            <Column lg={8} md={8} sm={8} style="margin-top:- 0.3em;user-select:none;">
                               
                                <HorizontalList bind:items={$selected_cols} onDrop={(lst) => {
                                    selected_cols.set(lst);
                                    console.log(lst);
                                } } title="колонки"/>
                            
                            </Column>
                                </Row>
                                <br />
                                <Row>
                                    <Column aspectRatio="2x1">
                                <div class="pattern-diagonal-lines-sm" style="position:absolute;top:25px;bottom:0;right:15px;left:15px;height:100%;color:var(--cds-ui-01, #ffffff);z-Index:-1;border-radius:0px;opacity:0.8;border:1px solid var(--cds-ui-01, #ffffff);"></div>
                            
                                     {#if !$hovering.ready_to_display}
        <p style="margin-top:60px;margin-left:20px;opacity:1.0;font-size:40px;line-height:1.0;font-weight:bold;color:var(--cds-ui-01, #ffffff);">Для отображения запроса необходимо построить все поля</p>
    {:else}
    <br /> <br /><div style="padding-left:10px;padding-right:10px;">
        {#if $hovering.query !== undefined}<slot pass={$hovering} key={$hovering.key}>{$hovering.key}</slot>{/if}
        </div>
    {/if}
                            </Column>
                                </Row>
                            </Column>
                           
                            
                    </Row>
                        {#if $unused_dimensions?.length != 0}
                            <div style="margin-top:-40px;">
                                    <Dropdown
                                    size="sm"
                                    type="inline"

                                    style=" padding-left:10px;padding-right:15px;"
                            titleText=""
                            selectedId="0"
                            items={[
                                { id: "0", text: "вывод: Таблица" },
                                { id: "1", text: "вывод: График" },
                            ]}
                            on:select={() => document.location.reload()}
                            /></div>
                        {/if}
                        {#await initial}
                            <br />
                        {:then result}
                            <br />
                        <br /><br />
                        
                        <br /><br />

   <!-- {JSON.stringify($hovering)} -->

{/await}

