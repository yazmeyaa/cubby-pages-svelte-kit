<script>
    import ApiClient from "@/utils/ApiClient";
    import { onMount } from "svelte";
    import Parser, { FormulaHelpers, DepParser } from "fast-formula-parser";
    import Table from "./table/Table.svelte";
    import Palette from "./palette/Palette.svelte";
    import { makeDefaultCell } from "./table/utils";
    import {
        floatNumberWithSpaces,
        formatToCurrency,
        formatToDate,
        formatToPercent,
        formatToPrecision,
    } from "./formatters";
    import { Grid, Row, Column, Button, OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
    import CharacterWholeNumber from "carbon-icons-svelte/lib/CharacterWholeNumber.svelte";
    import TextClearFormat from "carbon-icons-svelte/lib/TextClearFormat.svelte";
    import Add from "carbon-icons-svelte/lib/Add.svelte";
    import TextFont from "carbon-icons-svelte/lib/TextFont.svelte";
    import Locked from "carbon-icons-svelte/lib/Locked.svelte";
    import Unlocked from "carbon-icons-svelte/lib/Unlocked.svelte";

    /**
     * * Single cell of table
     * @typedef {Object} Cell
     * @property {string} value
     * @property {string} display
     * @property {string} result
     * @property {Format} format
     * @property {boolean} nowIsViewMode
     * @property {boolean} isCDBFormula
     * @property {boolean} canEditInViewMode
     */

    /**
     * @typedef {Object} Colors
     * @property {string} background
     * @property {string} color
     */
    /**

    /**
     * @typedef Format
     * @property {number} italics
     * @property {number} bold
     * @property {number} underline
     * @property {number} fontsize
     * @property {"left"|"center"|"right"} align
     * @property {string} colour
     * @property {string} background
     * @property {[boolean, boolean, boolean, boolean]} border
     * @property {boolean} readonly
     */

    /**
     * @typedef RowSetting
     * @property {number} height
     * @property {boolean} resizable
     */
    /**
     * @typedef ColSetting
     * @property {number} height
     * @property {boolean} resizable
     */

    /**
     * @typedef Selection
     * @property {number} col
     * @property {number} row
     */

    /**
     * @typedef TableConfig
     * @property {Selection} currCell
     * @property {Selection} editCell
     * @property {RowSetting[]} rowSetting
     * @property {ColSetting[]} columnSetting
     * @property {Format} defaultFormat
     * @property {CurrCell} selCells
     */

    /**
     * @typedef CurrCell
     * @property {number} col
     * @property {number} row
     * @property {number} col2
     * @property {number} row2
     */

    const NUMBER_FORMATS = {
        "Plain text": "plain_text",
        "To precision": "to_precision",
        Number: "number",
        Percent: "percent",
        USD: "USD",
        EUR: "EUR",
        RUB: "RUB",
        Date: "date",
    };
    Object.freeze(NUMBER_FORMATS);

    const TEXT_FORMATTING = {
        Regular: "regular",
        Italic: "italics",
        Bold: "bold",
        Underline: "underline",
    };
    Object.freeze(TEXT_FORMATTING);

    const DB_METHODS = ["cdbr", "cdbw", "cdbrw"];
    Object.freeze(NUMBER_FORMATS);

    const DEFAULT_ROW_SETTING = { resizable: true, height: 24 };
    const DEFAULT_COLUMN_SETTING = { resizable: true, width: 150 };

    const DEFAULT_CELL_FORMAT = {
        italics: 0,
        bold: 0,
        underline: 0,
        fontsize: 13,
        align: "left",
        colour: "#000",
        background: "#fff",
        border: [false, false, false, false], //	TLBR
        //"hidden":   false,
        readonly: false,
        displayFormat: "TEXT", //	DATE,TIME, DURATION, CURRENCY2, CURRENCY, TEXT, NUMBER, NUMBER2
    };
    Object.freeze(DEFAULT_CELL_FORMAT);

    function checkIsCDBFormula(input, position) {
        const { col, row } = position;
        const isFormulaRegex = /^=.*/;
        const value = data[row][col].value;
        const isFormula = isFormulaRegex.test(value);
        if (!isFormula) return false;
        const formattedValue = value.slice(1); // Remove '='
        const isCDBFormula = DB_METHODS.some((item) => formattedValue.startsWith(item));
        return isCDBFormula;
    }

    let isTableEditable = true;

    export let spreadsheetRecord;
    let formulaParser;

    /**
     * @type {TableConfig}
     */
    let config;

    //	The array of cells needs to be in sync with the rows/columns configuration
    /**
     * Table payload. Two-dimensional array of `Cell`
     *
     * @type {Cell[][]}
     * */
    let data;

    let uid = "Tbl-" + ((Math.random() * 999999999) | 0);

    /**
     * @type {CurrCell}
     */
    let currCell;

    function saveSpreadsheet() {
        if (!data) return;
        const { name } = spreadsheetRecord;
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        formData.append("name", name);
        ApiClient.collection(spreadsheetRecord.collectionId).update(spreadsheetRecord.id, formData, {
            $$autoCancel: false,
        });
    }

    function refreshTable() {
        if (!data) return;
        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                const isFormulaRegex = /^=.*/;
                const value = data[row][col].value;
                const isFormula = isFormulaRegex.test(value);
                if (!isFormula) continue;
                try {
                    data[row][col].display = "LOADING...";
                    const formattedValue = value.slice(1); // Remove '='
                    const parsed = formulaParser
                        .parseAsync(formattedValue, { row, col })
                        .then((result) => (data[row][col].display = result));
                } catch (e) {
                    data[row][col].display = "ERROR";
                    console.error(e);
                }
            }
        }
    }

    function handleCDBFormulaUpdate(event) {
        if (isTableEditable) return;
        const { col, row } = event.detail;
        const saveFormatting = data[row][col].format;
        const newValue = event.detail.edited.value;

        data[row][col].display = "UPDATING...";
        data[row][col].format.readonly = true;

        const CHEAT_INPUT = data[row][col].value.replace("cdbr", "GETARGS");
        const FORMATTED_CHEAT_INPUIT = CHEAT_INPUT.slice(1);
        const parsed = formulaParser.parse(FORMATTED_CHEAT_INPUIT, { col, row });
        const parsedArgs = parsed.split(",");
        const collectionName = parsedArgs[0];

        ApiClient.collections
            .getFullList({
                $autoCancel: false,
            })
            .then(async (response) => {
                const collection = response.find((item) => item.name === collectionName);
                const filterArguments = parsedArgs.slice(1);
                const fields = collection.schema
                    .filter((item) => item.name.startsWith("el_"))
                    .map((item) => item.name);
                const entries = fields.map((item, index) => {
                    return `${item}.name="${filterArguments[index]}"`;
                });
                const query = entries.join("&&");
                const rr = await ApiClient.collection(collectionName).getList(1, 10, {
                    filter: query,
                    $autoCancel: false,
                });
                const item = rr.items[0];

                const newRecordData = item;
                newRecordData.amount = newValue;

                const formData = new FormData();
                formData.append("amount", newValue);

                ApiClient.collection(collectionName)
                    .update(item.id, formData)
                    .then((response) => {
                        data[row][col].format = saveFormatting;
                        data[row][col].display = response.amount;
                        data[row][col].format.readonly = false;
                    });
            })
            .finally(() => {
                refreshTable();
            });
    }

    function startEdit(e) {}
    function onEdit(e) {
        refreshTable();
        saveSpreadsheet();
        const { col, row } = e.detail;
        const isFormulaRegex = /^=.*/;
        const value = data[row][col].value;
        const isFormula = isFormulaRegex.test(value);
        if (!isFormula) return; //Do nothing
        const isCDBFormula = checkIsCDBFormula(value, e.detail);
        if (!isCDBFormula) data[row][col].isCDBFormula = false;
        const formattedValue = value.slice(1); // Remove '='

        try {
            formulaParser.parseAsync(formattedValue, { row, col }).then((result) => {
                data[row][col].display = result;
                saveSpreadsheet();
            });
        } catch (e) {
            console.error(e);
        }
    }

    function onSelectionChange(e) {
        currCell = e.detail;
    }

    function createSpreadsheet(record) {
        if (data) {
            data = record.data;
        }

        data = record.data;

        applyActionForEveryCell((cell) => {
            cell.format.readonly = false;
            cell.nowIsViewMode = false;
            cell.isCDBFormula = false;
            cell.canEditInViewMode = false;
        });

        const gridConfig = {
            columnSetting: [],
            rowSetting: [],
            selCells: { row: 0, col: 0 },
            editCell: { row: -1, col: -1 },
            defaultFormat: structuredClone(DEFAULT_CELL_FORMAT),
        };

        for (let i = 0; i < data.length; i++) {
            gridConfig.rowSetting.push({ resizable: true, height: 36 });
        }
        for (let i = 0; i < data[0].length; i++) {
            gridConfig.columnSetting.push({ resizable: true, width: 150 });
        }
        config = gridConfig;

        const parserConfig = {
            functionsNeedContext: {
                CDBR: async (context, collectionNameReference, ...args) => {
                    const { col, row } = context.position;
                    console.log(row, col)
                    console.log(data[row][col])
                    data[row][col].canEditInViewMode = true;
                    data[row][col].isCDBFormula = true;
                    const filterArgs = args;
                    const collectionName = FormulaHelpers.accept(collectionNameReference); //Decode first argument

                    return ApiClient.collections
                        .getFullList({
                            $autoCancel: false,
                        })
                        .then(async (response) => {
                            const collection = response.find((item) => item.name === collectionName);
                            const filterArguments = filterArgs.map((item) => {
                                return FormulaHelpers.accept(item);
                            }); // Исключаем первый аргумент, т.к. это название базы данных.
                            const fields = collection.schema
                                .filter((item) => item.name.startsWith("el_"))
                                .map((item) => item.name);
                            const entries = fields.map((item, index) => {
                                return `${item}.name="${filterArguments[index]}"`;
                            });

                            const query = entries.join("&&");

                            const rr = await ApiClient.collection(collectionName).getList(1, 10, {
                                filter: query,
                                $autoCancel: false,
                            });
                            const item = rr.items[0];
                            if (!item) {
                                data[row][col].canEditInViewMode = false;
                                data[row][col].isCDBFormula = false;
                                return "#NOT FOUND";
                            }
                            return item.amount;
                        });
                },
            },

            functions: {
                GETARGS: (...args) => {
                    const parsedArgs = args.map((item) => FormulaHelpers.accept(item));
                    return parsedArgs.join(",");
                },
            },

            onCell: ({ row, col }) => {
                return data[row - 1][col - 1].value;
            },
            onRange: (ref) => {
                const resultArr = [];
                for (let row = ref.from.row; row < ref.to.row; row++) {
                    const innerArr = [];
                    for (let col = ref.from.col; col <= ref.to.col; col++) {
                        innerArr.push(data[row][col].value ?? ""); //* Empty string to escape errors. "" skips in parsing
                    }
                    resultArr.push(innerArr);
                }

                return resultArr;
            },
        };
        formulaParser = new Parser(parserConfig);
    }

    onMount(() => {
        createSpreadsheet(spreadsheetRecord);
        refreshTable();
    });

    $: {
        createSpreadsheet(spreadsheetRecord);
        refreshTable();
    }

    function formatInputNumber(input, formatType) {
        if (!isTableEditable) return input;
        if (
            formatType === NUMBER_FORMATS.EUR ||
            formatType === NUMBER_FORMATS.USD ||
            formatType === NUMBER_FORMATS.RUB
        ) {
            return formatToCurrency(input, formatType);
        }

        if (formatType === NUMBER_FORMATS.Number) {
            return floatNumberWithSpaces(input);
        }
        if (formatType === NUMBER_FORMATS.Date) {
            return formatToDate(input);
        }
        if (formatType === NUMBER_FORMATS.Percent) {
            return formatToPercent(input);
        }
        if (formatType === NUMBER_FORMATS["To precision"]) {
            return formatToPrecision(input);
        }
        if (formatType === NUMBER_FORMATS["Plain text"]) {
            return input;
        } else {
            return input;
        }
    }

    function applyNumberFormattingToCells(value) {
        applyActionForSelectedCells(currCell, (cell) => {
            cell.display = formatInputNumber(cell.value, value);
        });
        refreshTable();
    }

    function formatInputTextStyle(cell, formatType) {
        if (!isTableEditable) return;
        switch (formatType) {
            case "regular": {
                cell.format.bold = 0;
                cell.format.italics = 0;
                cell.format.underline = 0;
                break;
            }
            case "bold": {
                cell.format.bold = 1;
                break;
            }
            case "italics": {
                cell.format.italics = 1;
                break;
            }
            case "underline": {
                cell.format.underline = 1;
                break;
            }
            default: {
                break;
            }
        }
    }

    function applyTextFormattingToCells(value) {
        applyActionForSelectedCells(currCell, (cell) => {
            formatInputTextStyle(cell, value);
        });
        refreshTable();
    }

    function appendRowToTable() {
        const { row, row2 } = currCell;
        const appendLength = Math.abs(row - row2) + 1;
        const appendToPositionIndex = Math.min(row, row2);

        /**@type {RowSetting[]}*/
        const configRows = [];
        const rows = [];

        for (let i = 0; i < appendLength; i++) {
            configRows.push(structuredClone(DEFAULT_ROW_SETTING));
            const row = [];
            for (let i = 0; i < data.length; i++) {
                row.push(makeDefaultCell());
            }
            rows.push(row);
        }

        config.rowSetting.splice(appendToPositionIndex, 0, ...configRows);
        data.splice(appendToPositionIndex, 0, ...rows);

        config.selCells = {
            col: -1,
            row: -1,
            col2: -1,
            row2: -1,
        };
    }

    function appendColumnToTable() {
        const { col, col2 } = currCell;
        const appendLength = Math.abs(col - col2) + 1;
        const appendIndex = Math.min(col, col2);

        /**@type {ColSetting[][]}*/
        const configColumns = [];

        for (let i = 0; i < appendLength; i++) {
            configColumns.push(structuredClone(DEFAULT_COLUMN_SETTING));
        }

        config.columnSetting.splice(appendIndex, 0, ...configColumns);

        for (let i = 0; i < config.rowSetting.length; i++) {
            const subRow = [];
            for (let j = appendIndex; j < appendIndex + appendLength; j++) {
                subRow.push(makeDefaultCell());
            }
            data[i].splice(appendIndex, 0, ...subRow);
        }

        config.selCells = {
            col: -1,
            row: -1,
            col2: -1,
            row2: -1,
        };
    }

    function clearCellsFormatting() {
        applyActionForSelectedCells(currCell, (cell) => {
            cell.display = cell.value;
            cell.format = structuredClone(DEFAULT_CELL_FORMAT);
        });
        refreshTable();
    }

    function applyActionForEveryCell(callback) {
        data.forEach((row) => {
            row.forEach((cell) => {
                callback(cell);
            });
        });
    }

    function applyActionForSelectedCells(selection, callback) {
        if (!selection) return;
        const { col, row, col2, row2 } = selection;
        for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
            for (let j = Math.min(col, col2); j <= Math.max(col, col2); j++) {
                callback(data[i][j]);
            }
        }
    }

    function changeTableEditMode() {
        isTableEditable = !isTableEditable;
        applyActionForEveryCell((cell) => {
            cell.nowIsViewMode = !isTableEditable;
            if (cell.canEditInViewMode) {
                return (cell.format.readonly = false);
            }
            cell.format.readonly = !isTableEditable;
        });
    }

    /**
     * @param {Colors} colorTheme
     */
    function changeCellsTheme(colorTheme) {
        const { background, color } = colorTheme;
        applyActionForSelectedCells(currCell, (cell) => {
            cell.format.background = background;
            cell.format.colour = color;
        });
        refreshTable();
    }

    const number_formats = Object.entries(NUMBER_FORMATS);
    const text_formats = Object.entries(TEXT_FORMATTING);
</script>

<Grid fullWidth>
    {#if !spreadsheetRecord}
        <span>Select table left side panel!</span>
    {:else}
        <Grid>
            <Row>
                <!--* Toolbar-->
                {#if isTableEditable}
                    <Column lg={1} md={1} sm={1}>
                        <OverflowMenu
                            icon={CharacterWholeNumber}
                            size="xl"
                            iconDescription="Number formatting"
                        >
                            {#each number_formats as [name, value]}
                                <OverflowMenuItem
                                    on:click={() => applyNumberFormattingToCells(value)}
                                    text={name}
                                />
                            {/each}
                        </OverflowMenu>
                    </Column>
                    <Column lg={1} md={1} sm={1}>
                        <OverflowMenu icon={TextFont} size="xl">
                            {#each text_formats as [name, value]}
                                <OverflowMenuItem
                                    on:click={() => applyTextFormattingToCells(value)}
                                    text={name}
                                />
                            {/each}
                        </OverflowMenu>
                    </Column>
                    <Column lg={1} md={1} sm={1}>
                        <Palette
                            on:colorchoose={(event) => {
                                changeCellsTheme(event.detail);
                            }}
                        />
                    </Column>
                    <Column lg={1} md={1} sm={1}>
                        <OverflowMenu icon={Add} size="xl">
                            <OverflowMenuItem text="Add rows" on:click={appendRowToTable} />
                            <OverflowMenuItem text="Add columns" on:click={appendColumnToTable} />
                        </OverflowMenu>
                    </Column>
                    <Column lg={1} md={1} sm={1}>
                        <Button
                            iconDescription="Clear format"
                            kind="ghost"
                            icon={TextClearFormat}
                            on:click={clearCellsFormatting}
                        />
                    </Column>
                {/if}
                <Column
                    lg={{
                        span: 1,
                        offset: isTableEditable ? 10 : 15,
                    }}
                >
                    <Button
                        size="lg"
                        kind="tertiary"
                        on:click={changeTableEditMode}
                        icon={isTableEditable ? Unlocked : Locked}
                        iconDescription={`Режим ${isTableEditable ? "просмотра" : "редактирования"}`}
                    />
                </Column>
            </Row>
        </Grid>
        <!--* Spreadsheet-->
        <Row padding>
            <Column
                md={16}
                lg={{
                    span: 16,
                    offset: 0,
                }}
                style="max-height: 550px"
            >
                <Table
                    {data}
                    {config}
                    {uid}
                    on:startedit={startEdit}
                    on:endedit={onEdit}
                    on:selChange={onSelectionChange}
                    on:cdbformulaedit={(e) => {
                        handleCDBFormulaUpdate(e);
                    }}
                />
            </Column>
        </Row>
    {/if}
</Grid>
