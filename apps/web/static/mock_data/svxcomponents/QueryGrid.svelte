<script lang="ts">
    import { Grid, Row, Column,Tile, InlineLoading, SkeletonText, TextInput, Button, OverflowMenu, OverflowMenuItem, Toggle,Toolbar,
        ToolbarBatchActions,
        DataTable,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    Form,
    RadioButtonGroup,
    RadioButton,
    FormGroup,
    Checkbox,
    ToolbarMenuItem,} from "carbon-components-svelte";
    // import { Link } from "carbon-components-svelte";
    import { Modal } from "carbon-components-svelte";
    import Carbon from "carbon-icons-svelte/lib/Carbon.svelte";
    // import JSONBlock from './JSONBlock.svelte';
    import { Dropdown, Tag } from "carbon-components-svelte";
    import { tick } from 'svelte';
    import CellEditor from './CellEditor.svelte';

    import { onMount, onDestroy } from 'svelte';
    import { connect, JSONCodec, type Codec, type NatsConnection} from "nats.ws";
    import lazy from 'lazy-template';

    import type { Writable } from "svelte/store";

    export let datasource = "default:tm1"
    export let syntax;
    export let template = lazy`SELECT ${'select'} FROM [${'from'}] WHERE ( ${'where'} )`;
    export let title: string | null = null;
    export let description: string | null = null;
    export let showDropdownTitles = true;
    export let options = {};
    export let displayGrid = true;

    export let key = writable(null);

    let options_modal_open = false;

    // export let suppress_zero_on_rows = null;
    // export let suppress_zero_on_columns= null;
    
    let has_error = writable(null);

    export let meta = {};

    let rows_meta_data = writable([]);
    let columns_meta_data = writable([]);


    let hasFatalError = writable(false);
    let isOnline = writable(false)

    let nc: NatsConnection | null = null;
    let sc: any = JSONCodec();

    export let datasets = {};
    export let dataCb = () => {};

    export let query_options = {
        suppress_zero: {
            rows: true,
            columns: true,
        }
    };

    export let query_options_default = {
        suppress_zero: {
            rows: false,
            columns: false,
        }
    }

    let real_query_options = writable({
        suppress_zero: query_options?.suppress_zero || query_options_default.suppress_zero
    })

    let resultDataToPass = writable([]);


    // options: {
    //         suppress_zero: {
    //             rows: false,
    //             columns: true,
    //         },
    //         default: {
    //             suppress_zero: {
    //                 rows: true,
    //                 columns: true,
    //             },
    //         }
    //     }  

    let widgets_options = writable({

    })

    onDestroy(() => {
        if (nc !== null) {
            nc.close();
        }
    });

    export let defined: {	
        [key: string]: {	
            [key: string]: string | number | any	
        }	
    } = {};

    export let query: {
        select: string,
      
        select_on_rows: string[],
        select_on_columns: string[],
        options: undefined,

        "from": string,
        where: {
            [key: string] : string | [string, string | null | number] | null,
        },
        widgets: {
            [key: string]: string | { widget: string, props: any}
        }
    } = {};
    
    if (query) {
        if (query.options) {
            if (query.options?.suppress_zero) {
                if (query?.options.suppress_zero.rows !== null) {
                    real_query_options.update(v => {
                        if (v == undefined)  v = {};
                        if (!v.suppress_zero) v.suppress_zero = {};
                        v.suppress_zero.rows = query.options.suppress_zero.rows;
                        return v
                    })
                }
                if (query?.options.suppress_zero.columns !== null) {
                    real_query_options.update(v => {
                        if (v == undefined)  v = {};
                        if (!v.suppress_zero) v.suppress_zero = {};
                        v.suppress_zero.columns = query?.options?.suppress_zero.columns;
                        return v
                    })
                }
            }
        }
    }
    

    import { writable, derived,  } from 'svelte/store';
    import type { element } from "svelte/internal";
    // import { each } from "svelte/internal";
    // import tr from "date-fns/locale/tr";
    // import { Split } from "carbon-icons-svelte";

    // import { json } from '@sveltejs/kit';
    let cube = query["from"];

    let defaults: { [key: string] : string | null | number } = {};

    let lcl = JSON.parse(localStorage.getItem('cubby_defaults') || "{}");
    // let client: any = 

    let queries: Array<Array<string>> = [
        ...Object.keys(query.where).map(e => {
            const val = query.where[e];
            if (Array.isArray(val)) { 
                if (val.length < 2) {
                    throw new Error("Wrong where signature")
                }
            }
            const p0 = Array.isArray(val) ? val[0] : e;
            const def = Array.isArray(val) ? val[1] : val;
            defaults[e] = def;
            if (defaults[e] === null) {
                if (lcl[document.location.pathname] !== undefined) {
                    defaults[e] = lcl[document.location.pathname][e] || null;
                }
            }
            // console.log(query['from'])
            // return [e, `SELECT {TM1SubsetToSet([${e}].[${e}], "${e}")} ON 0 FROM [${query['from']}]` ]
            return [e, JSON.stringify({dimension_name:e, hierarchy_name: e, subset_name: p0}) ]
            // dimension_name
            // hierarchy_name
        })
        // ['Сценарии', `select Сценарии ${ cube }`],
        // ['Валюта_отчета', `select Валюта_отчета ${ cube }`],
        // ['Период', `select Период ${ cube }`],
        // ['Валюты_ввода', `select Валюты_ввода ${ cube }`],
    ]

    type Data = {
        meta: { [key: string]: string | number | null | any[] },
        status: "wait" | "done",
        data: any[],
    }

    let proto_data: {
        [key: string] : Data
    } = {};

    Object.keys(query.where).map(e => {
        proto_data[e] = {meta: {}, status: "wait", data: []}
    });

    let data = writable({
        ...proto_data,
        // Сценарии: 
        // Валюта_отчета: {},
        // Период: {},
        // Валюты_ввода: {},
    });

    async function WaitInitial(q: Array<Array<string>>) {
        // connect
        try {
            nc = await connect({ servers: [  `ws://${document.location.hostname}:8866` ] })
        } catch(e) {
            hasFatalError.set({
                code: 500,
                message: "Не удалось подключиться к серверу шины данных"
            })
        }
        // run queries
        let _c = localStorage.getItem("cubby@creds");
        if (!_c) {
            localStorage.setItem("cubby@creds", "{}");
            _c = "{}"
        }

        let _pc = JSON.parse(_c);
        if (!_pc[datasource]) {
            hasFatalError.set({ code: 403, message: "Нет сохраненных данных для доступа к источнику " + datasource })
        }

        return Promise.all(q.map(i => {
            return nc?.request("cubby.back.mutation.workspace.datasource-elements", sc.encode({
                input: {
                    cube: cube,
                    query: i[1],
                },
                
            }), { timeout: 20000 })
                .then(m => {
                    let msg = sc.decode(m.data);
                    console.log(`got response: ${msg}`);
                    dataCb(msg);
                    data.update(v => {
                        return {
                            ...v,
                            [ i[0] ]: {
                                meta: msg.meta || {},
                                status: "done",
                                data: msg.elements.map(el => ({ ...el, id: el.id + "",  })) || [],
                            }
                        }
                    })
                })
        }))
    }

    let proto_values: {
        [key: string] : null | string | number
    } = {};

    Object.keys(query.where).map(e => {
        proto_values[e] = defaults[e] || null;
    });

    let values = writable({
        ...proto_values,
    })

    let finalData: Writable<Data> = writable({ meta: {}, status: "wait", data: [] });
    let activeEdits: Writable<Array<Element>> = writable([]);
        
    // let gridTitlesHelper
    // const cancelEditOnTd = (td: Element) => {
    //     activeEdits.update(v => {
    //         if (v.includes(td)) {
    //             v = v.filter(el => el === td);
    //             td.style['min-width'] = `auto`;
    //             td.style['max-width'] = `auto`;
    //             td.style['width'] = `auto`;
    //             td.style['max-height'] = `auto`;
    //             td.style['min-height'] = `auto`;
    //             td.style['height'] = `auto`;
    //             const m = JSON.parse(td.dataset?.metaData || "{}");
    //             td.replaceChildren(m.FormattedValue);
    //         } else {
    //             console.warn('Removing on non-exists editor');
    //         }
    //         return v;
    //     })
    // }
    // const activateEditOnTd = (td: Element) => {
    //     activeEdits.update(v => {
    //         v.push(td);
    //         return v;
    //     })
    //     const dd: Element = document.createElement('div');
    //     td.replaceChildren(dd);
    //     var clientWidth = td.clientWidth + 1;
    //     var clientHeight = td.clientHeight + 1;

    //     td.style['min-width'] = `${clientWidth}px`;
    //     td.style['max-width'] = `${clientWidth}px`;
    //     td.style['width'] = `${clientWidth}px`;
    //     td.style['max-height'] = `${clientHeight}px`;
    //     td.style['min-height'] = `${clientHeight}px`;
    //     td.style['height'] = `${clientHeight}px`;
        

    //     new CellEditor({
    //         target: dd,
    //         props: {
    //             meta: JSON.parse(td.dataset?.metaData || "{}"),
    //             value: "",
    //             on_cancel: () => {
    //                 cancelEditOnTd(td);
    //             },
    //             on_accept: () => {
    //                 cancelEditOnTd(td)
    //             }
    //         },
    //     })
    // }
    // values.tri

    values.subscribe(values_val => {
        // if (finalData.status === 'wait') return;
        has_error.set(null);
        let hasNull = Object.keys(values_val).map(el => values_val[el]).filter(e => e === null).length > 0;

        let vvv = values_val;



        if (hasNull) {
            finalData.set({meta: {}, status: "wait", data: []});
        } else {
            let pre_select = query.select;

            let res_ = [
                ...$real_query_options.suppress_zero.columns === true ? [' NON EMPTY ', pre_select.split('ON COLUMNS,')[0], 'ON COLUMNS,'] : [ pre_select.split('ON COLUMNS,')[0], ' ON COLUMNS, '],
                ...$real_query_options.suppress_zero.rows === true ? [' NON EMPTY ', pre_select.split('ON COLUMNS,')[1], ] : [ pre_select.split('ON COLUMNS,')[1]],
            ];

            // let prep_ = pre_select.split(' ');
            // let accu = [];
            // prep_.forEach((el, pos) => {
            //     // if (el.toUpperCase().startsWith('ON')) {
            //         //  console.log('is', prep_[pos + 1].toUpperCase())
            //     if (el.toUpperCase().startsWith('COLUMNS')) {
                    
            //         if ($real_query_options.suppress_zero.columns === true) {
            //             accu = ['NON EMPTY', ...accu];
            //         }
            //         accu.push(el);
            //         res_ = [...prep_, ...accu];
            //         accu = [];
            //     } else if (el.toUpperCase().startsWith('ROWS')) {
            //         if ($real_query_options.suppress_zero.rows === true) {
            //             accu = ['NON EMPTY', ...accu];
            //         }
            //         accu.push(el);
            //         res_ = [...prep_, ...accu];
            //         accu = [];
            //     } else {
            //         accu.push(el);
            //     }
            // });
            // res_ = [...prep_, ...accu];
            console.log($real_query_options.suppress_zero.columns)
            console.log(res_.join(''))
            
            // if (typeof pre_select === 'string') {
            //     if (query_options.suppress_zero.columns) {
            //         pre_select.split('ON')[0].includes('COLUMNS')
            //     }
            //     if (query_options.suppress_zero.rows) {
            //         pre_select = pre_select.split('ON COLUMNS')
            //     }
            // } else {
            //     if (pre_select.rows !== undefined && pre_select.columns !== undefined) {
            //         // TBD
            //     }
            //     console.warn('Only string seelect allowed at this moment');
            // }

            const result_q = template({
                'select': query.select,
                'from': query.from,
                'select': res_.join(''),
                'where': [
                    ...Object.keys(query.where).map(e => {
                        // console.log(e, values_val);
                        const val = query.where[e];
                        if (Array.isArray(val)) { 
                            if (val.length < 2) {
                                throw new Error("Wrong where signature")
                            }
                        }
                        const p0 = Array.isArray(val) ? val[0] : e;
                        const value = Array.isArray(val) ? val[1] : val;
                        const res = vvv[e] !== null ? vvv[e]: value;
                        
                        return res;
                    })
                ].join(', ')
            })

            console.log('result_q', result_q);

            nc?.request("cubby.back.mutation.workspace.datasource-query", sc.encode({
                input: {
                    cube: cube,
                    query: result_q,
                },
                
            }), { timeout: 20000 })
                .then(m => {
                    let msg = sc.decode(m.data);
                    console.log(`got response:`, msg);

                    dataCb(msg);
                    console.log("dataCb", msg);

                    if (m.error) {
                        has_error.set(m.error);
                    }
                    
                    finalData.update((v: Data) => {
                        return {
                            result: msg.result,
                            data: msg.data,
                            meta: msg.meta,
                            error: msg.error,
                            status: "done"
                        }
                    })
                    return tick();
                }).then(() => {

                    let paths_at_cube = {};
                    meta.rows.forEach((rows_meta, rows_meta_i) => {
                        let check_el = Array.isArray(rows_meta) ? rows_meta[0] : rows_meta;

                        ($finalData.meta?.extra?.Axes || []).forEach(ax_el => {
                            ax_el.Hierarchies.forEach(hier_el => {
                                if (hier_el.Name === check_el) {
                                    let result_els = {};
                                    hier_el.Subsets.forEach(subs_el => {
                                        // paths_at_cube[mem_el.UniqueName] = {...mem_el}
                                        subs_el.Elements.forEach(elem_el => {
                                            let res_Alias = subs_el.Alias;
                                            if (res_Alias === '') {
                                                res_Alias = 'Caption'
                                            }
                                            result_els[elem_el.UniqueName] = {
                                                'title': elem_el.Attributes[res_Alias],
                                                'meta_data': elem_el,
                                                'id': subs_el['@odata']?.id,
                                            }
                                        })
                                    });
                                    rows_meta_data.update(v => ([...v, result_els]));
                                }
                                // columns_meta_data
                            });
                        });
                    })

                    meta.columns.forEach((cols_meta) => {
                        let check_el = Array.isArray(cols_meta) ? cols_meta[0] : cols_meta;
                        
                        ($finalData.meta?.extra?.Axes || []).forEach(ax_el => {
                            ax_el.Hierarchies.forEach(hier_el => {
                                
                                if (hier_el.Name === check_el) {
                                    let result_els = {};
                                    hier_el.Subsets.forEach(subs_el => {
                                        // paths_at_cube[mem_el.UniqueName] = {...mem_el}
                                        subs_el.Elements.forEach(elem_el => {
                                            result_els[elem_el.UniqueName] = {
                                                'title': elem_el.Attributes[subs_el.Alias],
                                                'meta_data': elem_el,
                                                'id': subs_el['@odata']?.id,
                                            }
                                        })
                                    });
                                    columns_meta_data.update(v => ([...v, result_els]));
                                }
                                // columns_meta_data
                            });
                        });
                    })

                    console.log('paths_at_cube', paths_at_cube);

                    // console.log('updated');
                    let table_heads = document.querySelectorAll('.dataframe thead tr th');
                    const table_rows = document.querySelectorAll('.dataframe tbody tr');
                    const head_row = document.querySelectorAll('.dataframe thead tr');
                    const offset_x = meta.columns.length;
                    const offset_y = meta.rows.length;

                    // document.querySelectorAll('.dataframe tbody tr')
                    // i_count = table_rows.length;
                    table_rows?.forEach((el, i) => {
                        const primary_el_post = el.querySelectorAll('td')[0];
                        el.querySelectorAll('th').forEach(ee => {
                            ee.style['opacity'] = '0.4';
                            // ee.textContent = `#${( parseInt(ee.textContent, 10) + 1 )}`
                            ee.style['min-width'] = "50px";
                            // ee.style['text-align'] = "right";
                            
                        });
                        if (i == 0 ) {
                            // el.style['border-top'] = '1px solid var(--cds-active-ui)'
                        }
                        const tdi_count = el.querySelectorAll('td').length;
                       

                        el.querySelectorAll('td')?.forEach((tdel, tdi) => {
                            tdel.style['position'] = 'relative';
                            tdel.style['overflow'] = 'hidden';
                            if (tdi > offset_x - 1) {
                                tdel.style['border-left']= '1px solid var(--cds-active-light-ui)';
                                tdel.style['border-top']= '1px solid var(--cds-active-light-ui)';
                            }
                            if (tdi == tdi_count -1) {
                                tdel.style['border-right']= '1px solid var(--cds-active-light-ui)';
                                
                            }
                             if (i == table_rows.length -1 && tdi > (offset_x - 1)) {
                                tdel.style['border-bottom']= '1px solid var(--cds-active-light-ui)';
                            }

                            let v = tdel.textContent?.trim();
                            
                            
                            // tdel.addEventListener('click', (e) => {
                            // e.preventDefault();
                            // console.log(table_heads, table_heads[tdi + 1], primary_el_post);
                                table_heads[tdi + 1].style['background-color'] = "var(--cds-ui-01)";
                                primary_el_post.style['background-color'] = "var(--cds-ui-01)";
                                primary_el_post.style['text-align'] = "left";
                                table_heads[tdi + 1].style['text-align'] = "left";
                                table_heads[tdi + 1].style['padding-right'] = '14px';


                                let flat_rows = meta.columns.map(el => Array.isArray(el) ? el[0] : el);
                                let flat_columns = meta.columns.map(el => Array.isArray(el) ? el[0] : el);

                                
                                // $finalData.meta.dimensions.forEach(element => {
                                //     if (flat_rows.includes(element)) {
                                //         // нашли по колонке — берём адрес
                                //     }
                                //     if (flat_rows.includes(element)) {
                                //         // нашли по строке — берём адрес
                                //     }
                                // });

                                // const one_path = $finalData.data.map(elem => {
                                //     // console.log(elem);
                                //     let found_v: string = '';
                                //     if (meta.columns.includes(elem.id)) {
                                //         found_v = table_heads[tdi + 1].textContent || "";
                                //     } else if (meta.rows.includes(elem.id)) {
                                //         found_v = primary_el_post?.textContent || "";
                                //     } else if (values_val[elem.id.split(']')[0].substr(1)] !== null) {
                                //         found_v = values_val[elem.id.split(']')[0].substr(1)]?.toString();
                                //     }
                                //     // console.log('found_final_data_v', found_v);
                                //     return found_v;
                                // }).join(',')
                                
                                
                                // const res_meta = $finalData.data.find((data_el) => {
                                //     const j = data_el.path.join('.');
                                //     console.log('data_el', data_el)
                                //     return j === one_path;
                                // });
                                // console.log('v', one_path, res_meta);

                                // tdel.dataset.metaData = JSON.stringify(res_meta);
                                // tdel.addEventListener('click', (e) => {
                                    // activateEditOnTd(tdel);
                                // });
                                //   let bbb = numfmt("#,###,###.##");
                                //   let bbb = numfmt("# ### 0.00;(# ## 0.00)");
                                // console.log(res_meta);
                                // const res_meta = $finalData.data[(tdi + 1 + (i + 1)*1) ] || {};
                                // console.log('v', v);
                                
                                // try {
                                    // v = bbb(parseFloat(v));
                                    // console.log("bbbb", bbb(v));
                                // } catch (e) {
                                    // v = v;
                                // }

                                let res_meta = {
                                    'FormattedValue': v,
                                }
                                if (res_meta.FormattedValue === '') {
                                    res_meta.FormattedValue = '';
                                }
                                const one_path = res_meta.path || [];
                                
                                if (tdi > (offset_x - 1)) {
                                    const dd: Element = document.createElement('div');
                                    dd.style = {
                                        'margin-bottom':'0px',
                                        // 'position':'absolute',
                                        'top':'0','left':'0','right':'0','bottom':'0px',
                                        ...res_meta?.RuleDerived ? {'opacity':'0.5'} : {}, 
                                    }
                                    tdel.replaceChildren(dd);

                                    let res_Val = res_meta?.FormattedValue || "";

                                    if (res_Val === 'NaN') {
                                        res_Val = "0.00";
                                    } else if (res_Val === 'None') {
                                        res_Val = "0.00";
                                    } else if (res_Val === null || res_Val === 'null' || res_Val == "None") {
                                        res_Val = "0.00";
                                    }
                                    
                                    
                                //   try {
                                //     res_Val = a(res_Val);
                                //   } catch(e) {
                                //     res_Val = res_Val;
                                //   }

                                    // res_Val = a(res_Val)
                                    // console.log(res_Val)
                                    new CellEditor({
                                        target: dd,
                                        
                                        props: {
                                            meta: res_meta,
                                            pull_data: () => {
                                                res_meta = JSON.parse(tdel.dataset.metaData || "{}");
                                                return res_meta;
                                            },
                                            on_activate: () => {
                                                

                                            },
                                            on_accept: async (val) => {
                                                //alert(val)
                                                if (val.includes("%")) {
                                                    //alert(val)
                                                    let _tmp = parseInt(val.split("%")[0]);
                                                    val = _tmp / 100;
                                                    //console.log(_tmp);
                                                }
                                                res_meta = JSON.parse(tdel.dataset.metaData || "{}");
                                                // alert(tdel.dataset.metaData)
                                                return nc?.request("cubby.back.mutation.workspace.datasource-query", sc.encode({
                                                    input: {
                                                        cube: cube,
                                                        query: result_q,
                                                        write: [res_meta.path.join(','), val],
                                                    }}), { timeout: 20000 })
                                                    .then(m => {
                                                        // document.location.reload()
                                                        if (m.error) {
                                                            alert(m.error);
                                                        } else {	
                                                            document.location.reload()
                                                        }
                                                    })
                                            },
                                            inputProps: {
                                                hideLabel: true,
                                                size:'sm',
                                                value: res_Val,
                                                light: true,
                                                readonly: tdi < 1 || res_meta?.RuleDerived,
                                                
                                                // value: tdel.textContent,
                                            }
                                        },
                                    })
                                } else {
                                    tdel.style['padding'] = '3px 20px';
                                    tdel.style['font-size'] = '14px';
                                    tdel.style['font-weight'] = '300';
                                    // tdel.style['border-top'] = '1px solid var(--cds-active-ui)';
                                }
                            // })
                        })
                    });

                    if (offset_y > 1 && document.querySelectorAll('.dataframe thead tr').length !== offset_y) {
                        const newRow = head_row[0].cloneNode(true);

                        const second_step_max = Object.keys($columns_meta_data[1]).length - 1;
                        let second_step = offset_x;

                        
                        // table_heads.forEach((ee, ei) => {
                        //     const nv = ee.cloneNode();
                        //     newRow.append(nv);
                        // })
                        // console.log(head_row[0], head_row[0].parentNode, newRow);
                        head_row[0].parentNode?.appendChild(newRow);

                        document.querySelectorAll('.dataframe thead tr:last-of-type th').forEach((element, element_i) => {
                            if (element_i  > offset_x) {
                                // console.log('clonned childs', element);
                                element.textContent = $columns_meta_data[1][Object.keys($columns_meta_data[1])[second_step]].meta_data.Name;
                                if (second_step === second_step_max) {
                                    second_step = 0;
                                } else {
                                    second_step += 1;
                                }
                            } else {
                                if (element_i !== 0) {
                                element.textContent = meta.columns[element_i -1 ];
                                }
                            }
                        });
                        // insertAfter(li,  menu.lastElementChild);
                    }

                    const table_head_rows = document.querySelectorAll('.dataframe thead tr');

                    document.querySelectorAll('.dataframe tbody tr').forEach((ee, ee_i) => {
                        ee.querySelectorAll('td').forEach((eee, eee_i) => {
                            if (eee_i >= offset_x) {
                                // cooord
                                let res_parh_of_cell = null;
                                res_parh_of_cell = $finalData.meta.dimensions.map(dim => {
                                    if (meta.columns.includes(dim)) {
                                        // console.log('here', document.querySelectorAll('.dataframe tbody tr')[meta.columns.indexOf(dim)].querySelectorAll('th'))
                                        return `[${dim}].[${dim}].[${  document.querySelectorAll('.dataframe thead tr')[meta.columns.indexOf(dim)].querySelectorAll('th')[eee_i + 1].textContent }]`;
                                    } else if (meta.rows.includes(dim)) {
                                        return `[${dim}].[${dim}].[${ee.querySelectorAll('td')[ meta.rows.indexOf(dim) ].textContent}]`;
                                    } else if ($values[dim] !== undefined) {
                                        return $values[dim];
                                    }
                                }).join(',');

                                // console.log('it\'s a ',eee, res_parh_of_cell);
                                let __found =  $finalData.data.find(ell => {
                                    return ell.id === res_parh_of_cell;
                                });

                                if (__found !== undefined) {
                                    eee.dataset.metaData = JSON.stringify(__found);
                                    //  console.log('__found', __found.FormattedValue, __found, eee);
                                        if (__found.RuleDerived == true || __found.Consolidated == true) {
                                            eee.style.opacity = 0.8;
                                            eee.querySelectorAll('input')[0].disabled = true
                                        } else {
                                            let flag = false;
                                            const tmpls = [
                                                // "[Период].[Период].[400]",
                                                // "[Период].[Период].[410]",
                                                // "[Период].[Период].[420]",
                                                // "[Период].[Период].[430]",
                                                // "[Период].[Период].[440]",
                                                // "[Сценарии].[Сценарии].[4]",
                                                // "[Сценарии].[Сценарии].[5]",
                                            ]
                                            __found.path.map((eeeee) => {
                                                if (tmpls.includes(eeeee)) {
                                                    flag = true;
                                                }
                                            })
                                            if (flag) {
                                                eee.style.opacity = 0.8;
                                                eee.querySelectorAll('input')[0].disabled = true
                                            } else {
                                                eee.style.opacity = 1.0;
                                                eee.querySelectorAll('input')[0].disabled = false
                                            }
                                        }
                                    // if (__found.FormattedValue <=)
                                    // console.log(
                                        try {
                                            eee.querySelector("input").value = __found.FormattedValue
                                        } catch(e) {

                                        }
                                    // );
                                    // .value = __found.FormattedValue;
                                } else {
                                    
                                    let __r2 = eee.querySelector("input")?.value;
                                    
                                    try {
                                            //  = __found.FormattedValue
                                             
                                                // if (__r2.length == 0) {
                                                    if (parseFloat(__r2) == NaN) {
                                                        __r2 = "0.00"
                                                    }
                                                     else if (__r2 == "") {
                                                        __r2 = "0.00"
                                                    }
                                                    console.log('__not_found111', __r2);
                                                     eee.querySelector("input").value = __r2;
                                                // }
                                        }catch(e) {
                                            console.log(e);
                                        }
                                   
                                }
                            }
                        })
                    });
                    // columns_meta_data.set()

                    table_head_rows.forEach((th_row, i) => {
                        console.log('table head element', th_row, i);
                        
                            // console.log('eleme', th_row);
                            // const col_i = i;
                            th_row.querySelectorAll('th').forEach((thel, col_i) => {
                                    if (col_i  > (offset_x)) {
                                            console.log('thel', thel);
                                            const text = thel.textContent;
                                            let __sd = "";
                                            try {
                                                __sd = defined[meta.columns[0]?.id][text] || text;
                                            } catch(e) {
                                                __sd = text;
                                            }
                                            console.log('thel', thel, query, defined, meta, __sd);
                                            

                                            let res_path = `[${meta.columns[i]}].[${meta.columns[i]}].[${text}]`;
                                            if (Array.isArray(meta.columns[i])) {
                                                res_path = meta.columns[i].map(el => `[${el}]`).join('.') + `.[${text}]`;
                                            }
                                            let new_title = $columns_meta_data[i];
                                            if (new_title) {
                                                new_title = new_title[res_path];
                                                if (!new_title) {
                                                    thel.style['background-color'] = 'rggba(255,0,0,0.1)';
                                                } else {
                                                    thel.replaceChildren(new_title.title  || text);
                                                    // console.log("replace", __sd, new_title)
                                               }
                                                
                                            } else {
                                                new_title = undefined;
                                                thel.style['background-color'] = 'rggba(255,0,0,0.1)';
                                            }
                                        
                                            
                                            thel.style['text-overflow'] = 'ellipsis';
                                            thel.style['overflow'] = 'hidden';
                                            thel.style['white-space'] = 'nowrap';
                                     };
                                });
                           
                        // console.log(thel);
                    });

                    console.log('cols', $columns_meta_data,);
                    console.log('rows', $rows_meta_data);

                    table_rows.forEach((trel, tri) => {
                        if (tri >= (offset_y - 1)) {
                            meta.rows.forEach((one_row, row_i) => {
                                const text = trel.querySelectorAll('td')[row_i].textContent;
                                let res_path = `[${one_row}].[${one_row}].[${text}]`;
                                    if (Array.isArray(one_row)) {
                                        res_path = one_row.map(el => `[${el}]`).join('.') + `.[${text}]`;
                                    }
                                let new_title = $rows_meta_data[row_i];
                                if (new_title) {
                                    new_title = new_title[res_path];
                                
                                    if (!new_title) {
                                            trel.querySelectorAll('td')[row_i].style['background-color'] = 'rggba(255,0,0,0.1)';
                                        } else {
                                            trel.querySelectorAll('td')[row_i].replaceChildren(new_title.title || text);
                                        }
                                } else {
                                    // console.log("here", new_title)

                                 
                                            let __sd = "";
                                            try {
                                                __sd = defined[meta.rows[0]?.id][text] || text;
                                            } catch(e) {
                                                __sd = text;
                                            }
                                            trel.querySelectorAll('td')[row_i].replaceChildren(__sd || text);
                                            // console.log('thel_rows', thel, query, defined, meta, __sd);


                                    new_title = undefined;
                                    trel.querySelectorAll('td')[row_i].style['background-color'] = 'rggba(255,0,0,0.1)';
                                }
                                
                                // console.log($rows_meta_data);
                                // console.log($rows_meta_data[0][`[${meta.rows[0]}].[${meta.rows[0]}].[${text}]`]);
                                
                                // console.log('')
                                trel.querySelectorAll('td')[row_i].style['text-overflow'] = 'ellipsis';
                                trel.querySelectorAll('td')[row_i].style['overflow'] = 'hidden';
                                trel.querySelectorAll('td')[row_i].style['white-space'] = 'nowrap';
                            })
                            
                        // meta.rows.forEach(element => {
                        //     // console.log(
                        //     //     'rows_meta_data', element,
                        //     //     $rows_meta_data,
                        //     //     $rows_meta_data[element]
                        //     //     // [`[${element}].[${element}].[${text}]`]
                        //     // );

                        // });
                        };
                       
                        

                    });

                    const table_rows_again = document.querySelectorAll('.dataframe tbody tr');
                    const table_head_rows2 = document.querySelectorAll('.dataframe thead tr');
                    let _p = {}
                    Object.keys(datasets).forEach((kk) => {
                        _p[kk] = []
                        
                        if (datasets[kk] === 'z') {
                                const prelude2 =table_head_rows2[0]?.querySelectorAll('th');
                                let _ppp = [];
                                prelude2?.forEach((eeee, iii) => {
                                    if (iii >= 2) {
                                        _p[kk].push(eeee.textContent?.trim())
                                    }
                                }) 
                        }
                        if (datasets[kk] === 'x,y') {

                            table_rows_again.forEach(eel => {
                                // _p[kk].push()
                                // console.log(eel);
                                // const prelude =table_head_rows[0].querySelectorAll('th');
                                // let _ppp = [];
                                // prelude.forEach((eeee, iii) => {
                                //     if (iii >= 1) {
                                //         _ppp.push(eeee.textContent?.trim())
                                //     }
                                // }) 
                                let _pre = {
                                    "group": eel.querySelectorAll('td')[0]?.textContent,
                                }
                                eel.querySelectorAll('td').forEach((sc, ii) => {
                                    // console.log(sc, ii)
                                    if (ii >= 1) {
                                        _pre['element_' + ii] = (JSON.parse(sc.dataset.metaData) || {} ).Value;
                                        if (_pre['element_' + ii] === null || _pre['element_' + ii] === 'None' || _pre['element_' + ii] === '' || _pre['element_' + ii] === 'NaN') {
                                            _pre['element_' + ii] = 0.0;
                                        } 
                                    }
                                    
                                })
                                _p[kk].push(_pre)
                            })
                        }
                        
                    })
                    resultDataToPass.set(_p);
                    
                    // const table_header = document.querySelector('.dataframe');
                    // table_cells?.addEventListener('click', () => {
                    //     alert('a');
                    // })
                    })}

            // setTimeout(() => {
            //     finalData.update((v: Data) => {
            //         return {
            //             ...v,
            //             data: [  ],
            //             status: "done"
            //         }
            //     })
            // }, 1000)
        // }
    });

    let initial = WaitInitial(queries);

    // const response_to_tree_converter = (el) => {
    //     return el.map(elem => {

    //     });
    // }

    // let options = MDX.create(cube)
    //     .hierarchy('Сценарии')
    //     .hierarchy('Валюта_отчета')
    //     .hierarchy('Период', 'Итого год')
    //     .hierarchy('Валюты_ввода')
    // let query = MDX.create(cube)
    //     .build(`
    //         SELECT 
    //             {TM1SubsetToSet([Год].[Год], "Годы")} ON COLUMNS, 
    //             {TM1SubsetToSet([Показатели_Адм{Курсы].[Показатели_Адм{Курсы], "Показатели")} ON ROWS 
    //         FROM ${options.cube}
    //         WHERE 
    //             (
    //                 [Сценарии].[Сценарии]${options.get('Сценарии')},
    //                 [Валюта_отчета].[Валюта_отчета]${options.get('Валюта_отчета')},
    //                 [Период].[Период]${options.get('Период')},
    //                 [Валюты_ввода].[Валюты_ввода]${options.get('Валюты_ввода')}
    //             )
    //     `)


    const OnDataDoneGetter = function() {
        
    }

    setTimeout(() => {
        // values.update((v) => { return {...v, ...proto_values, }})
    }, 1000);

    let debug_toggled = false;

    real_query_options.subscribe(vv => {
        
        let _tmpLcl2 = JSON.parse(localStorage.getItem('cubby_defaults') || JSON.stringify({suppress_zero:{columns: false, rows: false}}));
        // console.log(_tmpLcl2)
        _tmpLcl2.suppress_zero = _tmpLcl2.suppress_zero ||  { columns: false, rows: false } 
        _tmpLcl2.suppress_zero.rows = vv.suppress_zero.rows;
        _tmpLcl2.suppress_zero.columns = vv.suppress_zero.columns;
        localStorage.setItem("cubby_defaults", JSON.stringify(_tmpLcl2));
        // values.update(v => v);
    })

    $: {
        console.log(activeEdits);
        // console.log(rows_meta_data.);
    }
    $: document.documentElement.setAttribute("_debug_mode", debug_toggled ? "yes" : "no");
</script>


{#if title}
    <h1>{title}</h1>
{/if}

{#if description}
    <p style="margin-top:10px;">{description}</p>
    <br />
{/if}
    <br />
{#await initial}
    <br />
{:then _} 
    {#if !$hasFatalError}
        <Row>
        {#each queries as dt}
            <Column>
                {#if $data[dt[0]].data}
                    <Dropdown
                        titleText={dt[0]}
                        selectedId={$values[dt[0]]}
                        style="margin-bottom:5px;"
                        items={[
                            {id: null, text: "нет значения", label:"", disabled: false},
                            ...$data[dt[0]]?.data.map(el => ({ id: el.id, text: el.label, disabled: el.disabled, label:el.text }))
                        ]}
                        on:select={(e) => {
                            const __v = e.detail.selectedId;
                            if (__v === values[dt[0]]) return;

                            if (lcl[document.location.pathname] === undefined) {
                                lcl[document.location.pathname] = {}
                            }
                            lcl[document.location.pathname][dt[0]] = __v !== "" ? __v : null;
                            localStorage.setItem("cubby_defaults", JSON.stringify(lcl));
                            
                            values.update(v => {
                                // console.log(e);
                                return {
                                    ...v,
                                    [ dt[0] ]: __v !== "" ? __v : null,
                                }
                            })
                        }}
                        let:item>

                        {#if item.disabled }
                            <div style="position:relative;height:20px;">
                                <strong style="position:absolute; top:-8px; font-size:12px; left:0; opacity:0.4">{(item.id === null || item.id === "") ? "..." : item?.text || ""}</strong>
                            </div>
                        {:else}
                            <div style="position:relative;height:20px;">
                                <strong style="position:absolute; top:-8px; font-size:12px; left:0;;">{(item.id === null || item.id === "") ? "..." : item?.text || ""}</strong>
                                <small style="position:absolute; bottom:-4px; left:0;font-size:9px;opacity:0.5;">{#if item.id !== null}{item?.id}{:else}надо бы выбрать{/if}</small>
                            </div>
                        {/if}
                    </Dropdown>
                    <Tag filter on:close={() => {
                        if ($values[dt[0]]) {
                            values.update(v => {
                                return {
                                    ...v,
                                    [ dt[0] ]: null,
                                }
                            })
                        } else {
                            values.update(v => {
                                return {
                                    ...v,
                                    [ dt[0] ]: $data[dt[0]].data[0].id,
                                }
                            })
                        }
                    }} type={ $values[dt[0]]  ?  "blue" : "red" } size="sm">{$values[dt[0]] ? "выбрано" : "обязательное поле" } {$values[dt[0].split('.')[2]] || ""}</Tag>
                {/if}
                    
                </Column>
            {/each}
        </Row>
        <br /><br />
        {#if $has_error === null } <DataTable>
            
                {@html $finalData.meta.pivot?.html || "" }
                <Toolbar style="background:transparent;">
                    <ToolbarContent>
                            {#if $finalData.status == 'wait'}
                                <InlineLoading style="margin-left:10px;" status="inactive" description="Заполните все поля для получения данных" />
                            {/if}
                            {#if $finalData.status == 'done'}
                                <InlineLoading style="margin-left:10px;" status="finished" description="Данные получены" />
                            {/if}
                            {#if $real_query_options.suppress_zero?.columns}
                            <nobr style="padding-right:10px;padding-top:19px; font-size:12px; opacity:0.5">подавление нолей в колонках</nobr>
                            {/if}
                            {#if $real_query_options.suppress_zero?.rows}
                             <nobr style="padding-right:10px;padding-top:19px; font-size:12px; opacity:0.5">подавление нолей в строках</nobr>
                            {/if}
                            <Button kind="ghost" on:click={() => {
                                options_modal_open = true;
                            }}>дополнительно</Button>
                    </ToolbarContent>
                </Toolbar>
        </DataTable>
        {:else}
            <InlineLoading style="margin-left:10px;" status="error" description={JSON.stringify($has_error)} />
        {/if}

        <hr style="opacity:0.2;" />
        <br />
            {#if false}
            <Row>
            {#each queries as dt}
                <Column sm={8} lg={8} style="margin-bottom:20px;">
                    {#if $data[dt[0]]}
                        {#if $values[dt[0]]}
                            {JSON.stringify($data[dt[0]].data.find(el => el.id === $values[dt[0]]).full || {}, null, 2)}
                        {/if}
                        <span>не выбран элемент</span>
                        {:else}
                    {/if}
                </Column>
            {/each}
            </Row>
            <hr style="opacity:0.2;" /><br />
            {/if}
            {#if false}
            <Row>
                {#if $finalData.status !== 'wait'}
                    {#each ($finalData.meta?.extra?.Axes || []) as axe}
                        <Column sm={16} lg={16} style="overflow-x:scroll;margin-bottom:20px;">
                            <DataTable
                                expandable
                                size="compact"
                                headers={[
                                    {key: 'Cardinality', value: "Cardinality"},
                                    {key: "Ordinal", value:'Ordinal'},
                                ]}
                                rows={[axe, ]}
                            >
                                <svelte:fragment slot="expanded-row" let:row>
                                    <pre style="overflow-x:scroll">{JSON.stringify(row, null, 2)}</pre>
                                </svelte:fragment>
                            </DataTable>
                        </Column>
                    {/each}
                {/if}
                {#if $finalData.status !== 'loading'}
                
                {/if}
            </Row>
            {/if}

     {:else}
        Произошла ошибка: {$hasFatalError.code} {$hasFatalError.message}
        {#if $hasFatalError.code === 403}
            <br /><br />
            <Button size="field" on:click={() => {
                localStorage.setItem("cubby@creds", `{"default:tm1": {"username": "admin", "password": "Admin"}}` );
                document.location.reload()
            }}>заполнить по умолчанию</Button>
        {/if}
    {/if}


    <Modal
        bind:open={options_modal_open}
        modalHeading="Дополнительно"
        primaryButtonText="Подтвердить"
        secondaryButtonText="Отмена"
        on:click:button--secondary={() => (options_modal_open = false)}
        on:click:button--primary={() => (options_modal_open = false)}
        on:open
        on:close
        on:submit
    >
        <Form on:submit>
            <Grid>
                <Row>
                    <Column>
                        <h5>Настройки</h5>
                        <FormGroup legendText="Подавление нолей">
                            <Checkbox disabled={$real_query_options.suppress_zero?.rows === null} labelText="По строкам" bind:checked={$real_query_options.suppress_zero.rows} />
                            <Checkbox disabled={$real_query_options.suppress_zero?.columns === null} labelText="По колонкам" bind:checked={$real_query_options.suppress_zero.columns} />
                        </FormGroup>
                    </Column>
                    <Column>
                        <h5>Типы виджетов</h5>
                        {#each queries as dt}
                            <FormGroup legendText={dt[0]}>
                                <RadioButtonGroup selected="dropdown">
                                    <RadioButton labelText="Выпадающий список" value="dropdown" />
                                    <RadioButton labelText="Радио-кнопки" value="radio" disabled />
                                </RadioButtonGroup>
                            </FormGroup>
                        {/each}
                    </Column>
             </Row>
             <Row>
                <Column>
                    <h5>Экспорт значений</h5>
                    <FormGroup legendText="Экспорт значений">
                        <Button size="small" kind="tertiary">Скачать в формате Excel</Button>&nbsp;&nbsp;
                        <Button size="small" kind="tertiary">Скачать в формате CSV</Button>
                    </FormGroup>
                </Column>
             </Row>
             </Grid>
        </Form>
    
    </Modal>
    <slot data={$resultDataToPass}></slot>

{/await}
