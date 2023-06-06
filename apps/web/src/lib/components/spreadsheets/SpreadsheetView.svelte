<script lang="ts">
  import { pb as ApiClient } from '$lib/pocketbase'
  import { createEventDispatcher, onMount } from 'svelte'
  import Parser, { FormulaHelpers, FormulaError } from 'fast-formula-parser'
  import Table from './table/Table.svelte'
  import Palette from './palette/Palette.svelte'
  import { makeDefaultCell } from './table/utils'
  import {
    floatNumberWithSpaces,
    formatToCurrency,
    formatToDate,
    formatToPercent,
    formatToPrecision,
  } from './formatters'

  import {
    Grid,
    Row,
    Column,
    Button,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
  } from 'carbon-components-svelte'
  import CharacterWholeNumber from 'carbon-icons-svelte/lib/CharacterWholeNumber.svelte'
  import TextClearFormat from 'carbon-icons-svelte/lib/TextClearFormat.svelte'
  import TextFont from 'carbon-icons-svelte/lib/TextFont.svelte'
  import Locked from 'carbon-icons-svelte/lib/Locked.svelte'
  import Unlocked from 'carbon-icons-svelte/lib/Unlocked.svelte'
  import Download from 'carbon-icons-svelte/lib/Download.svelte'

  import { confirm } from '$lib/stores/confirmation'

  import CUBES from './data/result.json'

  import { _ } from 'svelte-i18n'

  import { requestTM1CubeData } from './helpers/TM1RequestHelper'
  import { exportDataToXLSX } from './helpers/saveXlsx'
  import {
    CELL_KINDS,
    type Cell,
    type SpreadSheetSelection,
  } from '$lib/types/spreadsheet'
  import type FormulaParser from 'fast-formula-parser'
  import type { Record } from 'pocketbase'

  /**
   * @typedef {string} CellKinds
   */

  /**
   * @readonly
   * @enum {CellKinds}
   */

  //   const CELL_KINDS = {
  //     CELL: 'CELL',
  //     PICKLIST: 'PICKLIST',
  //   }

  //   Object.freeze(CELL_KINDS)

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
   * @property {keyof typeof CELL_KINDS} kind
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

  interface CellPosition {
    col: number
    row: number
  }

  const NUMBER_FORMATS = {
    'Plain text': 'plain_text',
    'To precision': 'to_precision',
    Number: 'number',
    Percent: 'percent',
    USD: 'USD',
    EUR: 'EUR',
    RUB: 'RUB',
    Date: 'date',
  }
  Object.freeze(NUMBER_FORMATS)

  const TEXT_FORMATTING = {
    Regular: 'regular',
    Italic: 'italics',
    Bold: 'bold',
    Underline: 'underline',
  }
  Object.freeze(TEXT_FORMATTING)

  const DB_METHODS = ['cdbr', 'cdbw', 'cdbrw']
  Object.freeze(NUMBER_FORMATS)

  const DEFAULT_ROW_SETTING = { resizable: true, height: 40 }
  const DEFAULT_COLUMN_SETTING = { resizable: true, width: 150 }

  const DEFAULT_CELL_FORMAT = {
    italics: 0,
    bold: 0,
    underline: 0,
    fontsize: 13,
    align: 'left',
    colour: null,
    background: null,
    border: [false, false, false, false], //	TLBR
    //"hidden":   false,
    readonly: false,
    displayFormat: 'TEXT', //	DATE,TIME, DURATION, CURRENCY2, CURRENCY, TEXT, NUMBER, NUMBER2
  }
  Object.freeze(DEFAULT_CELL_FORMAT)

  function checkIsCDBFormula(input: string, position: CellPosition) {
    const { col, row } = position
    const isFormulaRegex = /^=.*/
    const value = data[row][col].value
    const isFormula = isFormulaRegex.test(value)
    if (!isFormula) return false
    const formattedValue = value.slice(1) // Remove '='
    const isCDBFormula = DB_METHODS.some((item) =>
      formattedValue.startsWith(item)
    )
    return isCDBFormula
  }

  let isTableEditable = false

  export let spreadsheetRecord: Record
  const dispatch = createEventDispatcher()
  let formulaParser: FormulaParser<string>

  /**
   * @type {TableConfig}
   */
  let config: any

  //	The array of cells needs to be in sync with the rows/columns configuration
  /**
   * Table payload. Two-dimensional array of `Cell`
   *
   * @type {Cell[][]}
   * */
  let data: Cell[][]

  let uid = 'Tbl-' + ((Math.random() * 999999999) | 0)

  /**
   * @type {CurrCell}
   */
  let currCell: SpreadSheetSelection

  function saveSpreadsheet() {
    if (!data) return
    const { name } = spreadsheetRecord
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    formData.append('config', JSON.stringify(config))
    formData.append('name', name)
    ApiClient.collection(spreadsheetRecord.collectionId).update(
      spreadsheetRecord.id,
      formData,
      {
        $autoCancel: false,
      }
    )
  }

  async function refreshTable() {
    if (!data) return
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const isFormulaRegex = /^=.*/
        const value = data[row][col].value
        const isFormula = isFormulaRegex.test(value)
        data[row][col].kind = CELL_KINDS.CELL
        if (!isFormula) continue
        try {
          data[row][col].display = 'LOADING...'
          const formattedValue = value.slice(1) // Remove '='
          const parsed = await formulaParser.parseAsync(formattedValue, {
            row,
            col,
          })
          data[row][col].display = parsed
        } catch (e) {
          if (e instanceof FormulaError) {
            data[row][col].display = e.error
          } else {
            data[row][col].display = '#ERROR'
          }
        }
      }
    }
  }

  function updateSpecialFormula(event) {
    const kind = event.detail.formulaKind

    switch (kind) {
      case 'cdbrw': {
        return handleCDBFormulaUpdate(event)
      }
      case 'tm1dbrw': {
        return handleUpdateTM1DBRW(event)
      }
    }
  }

  /**
   * Function that handles actions when editing a cell with a CDBRW formula in view mode
   * @param event
   */

  function handleCDBFormulaUpdate(event) {
    if (isTableEditable) return
    const { col, row } = event.detail
    const saveFormatting = data[row][col].format
    const newValue = event.detail.edited.value

    data[row][col].display = 'UPDATING...'
    data[row][col].format.readonly = true

    const CHEAT_INPUT = data[row][col].value.replace('cdbrw', 'GETARGS')
    const FORMATTED_CHEAT_INPUIT = CHEAT_INPUT.slice(1)
    const parsed = formulaParser.parse(FORMATTED_CHEAT_INPUIT, { col, row })
    const parsedArgs = parsed.split(',')
    const collectionName = parsedArgs[0]

    ApiClient.collections
      .getFullList(undefined, {
        $autoCancel: false,
      })
      .then(async (response) => {
        const collection = response.find((item) => item.name === collectionName)
        const filterArguments = parsedArgs.slice(1)
        const fields = collection!.schema
          .filter((item) => item.name.startsWith('el_'))
          .map((item) => item.name)
        const entries = fields.map((item, index) => {
          return `${item}.name="${filterArguments[index]}"`
        })
        const query = entries.join('&&')
        const rr = await ApiClient.collection(collectionName).getList(1, 10, {
          filter: query,
          $autoCancel: false,
        })
        const item = rr.items[0]

        const newRecordData = item
        newRecordData.amount = newValue

        const formData = new FormData()
        formData.append('amount', newValue)

        ApiClient.collection(collectionName)
          .update(item.id, formData)
          .then((response) => {
            data[row][col].format = saveFormatting
            data[row][col].display = response.amount
            data[row][col].format.readonly = false
          })
      })
      .finally(() => {
        refreshTable()
      })
  }

  /**
   * Function that handles actions when editing a cell with a TM1DBRW formula in view mode
   * @param event
   */

  function handleUpdateTM1DBRW(event) {
    if (isTableEditable) return
    const { col, row } = event.detail
    const saveFormatting = data[row][col].format
    const newValue = event.detail.edited.value
    const saveOldValue = data[row][col].display

    //* Getting cells formula arguments by replacing command to "GETARGS"
    const CHEAT_INPUT = data[row][col].value.replace('TM1DBRW', 'GETARGS')
    const FORMATTED_CHEAT_INPUIT = CHEAT_INPUT.slice(1)

    const parsed = formulaParser.parse(FORMATTED_CHEAT_INPUIT, { col, row })
    const parsedArgs = parsed.split(',')

    //Request config
    const method = 'POST'
    const cubeName = parsedArgs[0]
    const args = parsedArgs.slice(1) //Without cube name

    // Get required demensions (arguments) keys
    const requiredCube = CUBES.find((item) => item.name === cubeName)
    if(!requiredCube) throw new FormulaError("#CUBE")
    const requiredDemensions = requiredCube.demensions

    if (args.length < requiredDemensions.length)
      throw new FormulaError('ARGUMENTS')

    // Template for body request
    const requestBody = {
      Cells: [
        {
          'Tuple@odata.bind': [],
        },
      ],
      Value: newValue,
    }

    const makeStringForTulpeBinding = (key: string, value: string) =>
      `Dimensions('${key}')/Hierarchies('${key}')/Elements('${value}')`

    for (let i = 0; i < requiredDemensions.length; i++) {
      const key = requiredDemensions[i]
      const value = args[i]
      requestBody.Cells[0]['Tuple@odata.bind'].push(
        makeStringForTulpeBinding(key, value)
      )
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      Cookie: 'TM1SessionId=PHUZmWKpss5Tt1FRCn-06kjnqcQ',
      Authorization: 'Basic ' + btoa('admin:Apple'),
    })

    data[row][col].display = 'UPDATING...'
    data[row][col].format.readonly = true

    fetch(
      `https://84.201.147.227:8009/api/v1/Cubes('${cubeName}')/tm1.Update`,
      {
        method,
        headers,
        body: JSON.stringify(requestBody),
      }
    )
      .then(() => {
        return requestTM1CubeData({
          args,
          requiredDemensions,
          cubeName,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        const value = responseJson['Cells'][0]['Value']
        data[row][col].display = value
      })
      .catch((err) => {
        console.error(err)
        data[row][col].display = saveOldValue
      })
      .finally(() => {
        data[row][col].format = saveFormatting
        data[row][col].format.readonly = false
      })
  }

  function startEdit(e) {}
  function onEdit(e) {
    refreshTable()
    saveSpreadsheet()
    const { col, row } = e.detail
    const isFormulaRegex = /^=.*/
    const value = data[row][col].value
    const isFormula = isFormulaRegex.test(value)
    if (!isFormula) return //Do nothing
    const isCDBFormula = checkIsCDBFormula(value, e.detail)
    if (!isCDBFormula) data[row][col].isCDBFormula = false
    const formattedValue = value.slice(1) // Remove '='

    try {
      formulaParser.parseAsync(formattedValue, { row, col }).then((result) => {
        data[row][col].display = result
        saveSpreadsheet()
      })
    } catch (e) {
      console.error(e)
    }
  }

  function onSelectionChange(e) {
    currCell = e.detail
  }

  function createSpreadsheet(record) {
    if (data) {
      data = record.data
    }

    data = record.data

    applyActionForEveryCell((cell) => {
      cell.format.readonly = true
      cell.nowIsViewMode = false
      cell.isCDBFormula = false
      cell.canEditInViewMode = false
    })

    const gridConfig = {
      columnSetting: [],
      rowSetting: [],
      selCells: { row: 0, col: 0 },
      editCell: { row: -1, col: -1 },
      defaultFormat: structuredClone(DEFAULT_CELL_FORMAT),
    }

    const dbConfig = record.config

    for (let i = 0; i < data.length; i++) {
      gridConfig.rowSetting.push({ resizable: true, height: 40 })
    }
    for (let i = 0; i < data[0].length; i++) {
      gridConfig.columnSetting.push({ resizable: true, width: 150 })
    }
    config = dbConfig ?? gridConfig
    config.isTableEditable = false

    const parserConfig = {
      functionsNeedContext: {
        CDBRW: async (context, collectionNameReference, ...args) => {
          const { col, row } = context.position

          data[row][col].canEditInViewMode = true
          data[row][col].isCDBFormula = true
          data[row][col].formulaKind = 'cdbrw'
          const filterArgs = args
          const collectionName = FormulaHelpers.accept(collectionNameReference) //Decode first argument

          return ApiClient.collections
            .getFullList({
              $autoCancel: false,
            })
            .then(async (response) => {
              const collection = response.find(
                (item) => item.name === collectionName
              )
              const filterArguments = filterArgs
                .map((item) => {
                  return FormulaHelpers.accept(item)
                })
                .flat(Infinity) // Исключаем первый аргумент, т.к. это название базы данных.
              const fields = collection.schema
                .filter((item) => item.name.startsWith('el_'))
                .map((item) => item.name)
              const entries = fields.map((item, index) => {
                return `${item}.name="${filterArguments[index]}"`
              })

              const query = entries.join('&&')

              const rr = await ApiClient.collection(collectionName).getList(
                1,
                10,
                {
                  filter: query,
                  $autoCancel: false,
                }
              )
              const item = rr.items[0]
              if (!item) {
                data[row][col].canEditInViewMode = false
                data[row][col].isCDBFormula = false
                return '#NOT FOUND'
              }
              return item.amount
            })
        },
        TM1DBRW: async (context, collectionNameReference, ...args) => {
          const name = FormulaHelpers.accept(collectionNameReference)
          const { col, row } = context.position

          data[row][col].canEditInViewMode = true
          data[row][col].isCDBFormula = true
          data[row][col].formulaKind = 'tm1dbrw'

          const parsedArgs = args
            .map((item) => {
              return FormulaHelpers.accept(item)
            })
            .flat(Infinity)

          const cubeName = name

          const requiredCube = CUBES.find((item) => item.name === cubeName)

          if (!requiredCube) throw new FormulaError('#ARGUMENTS')

          const requiredDemensions = requiredCube.demensions

          if (parsedArgs.length !== requiredDemensions.length)
            throw new Error('#ARGS')

          data[row][col].display = 'LOADING...'
          data[row][col].format.readonly = true

          const requiredArgs = parsedArgs
          const response = await requestTM1CubeData({
            requiredDemensions,
            args: requiredArgs,
            cubeName,
          })
          const responseJson = await response.json()

          data[row][col].format.readonly = false

          /**@type {{Ordinal: number, Value: string|null, FormattedValue: string}}*/
          const responsePayload = responseJson['Cells'][0]

          const { Value, FormattedValue } = responsePayload

          const returnData = Value ?? FormattedValue

          return returnData
        },
        DROPDOWN: (context, kind, ...args) => {
          const { col, row } = context.position
          const kindName = FormulaHelpers.accept(kind)
          if (!kindName || args.length === 0)
            throw new FormulaError('#ARGUMENTS')

          const parsedArgs = args
            .map((argument) => {
              return String(FormulaHelpers.accept(argument))
            })
            .flat(Infinity)

          data[row][col].kind = CELL_KINDS.PICKLIST
          data[row][col].pickListItems = parsedArgs

          return parsedArgs.join(', ')
        },
      },

      functions: {
        GETARGS: (...args) => {
          const parsedArgs = args.map((item) => FormulaHelpers.accept(item))
          return parsedArgs.join(',')
        },
        CONCATWITHSEPARATOR: (separatorArg, ...args) => {
          const separator = FormulaHelpers.accept(separatorArg)
          const parsedArgs = args.map((item) => FormulaHelpers.accept(item))

          return parsedArgs.join(separator)
        },
        TM1DIMS: (nameArg) => {
          const name = FormulaHelpers.accept(nameArg)
          const cube = CUBES.find((item) => item.name === name)
          const demensions = cube.demensions.join(', ')

          return demensions
        },
      },

      onCell: ({ row, col }) => {
        const value = data[row - 1][col - 1].display
        if (value && /^\d+$/i.test(value)) {
          return Number(value)
        }
        return value
      },
      onRange: (ref) => {
        const arr = []
        for (let row = ref.from.row; row <= ref.to.row; row++) {
          const innerArr = []
          if (data[row - 1]) {
            for (let col = ref.from.col; col <= ref.to.col; col++) {
              const value = data[row - 1][col - 1].display
              if (value && /^\d+$/i.test(value)) {
                innerArr.push(Number(value))
              } else {
                innerArr.push(data[row - 1][col - 1])
              }
            }
          }
          arr.push(innerArr)
        }
        return arr
      },
    }
    formulaParser = new Parser(parserConfig)
    refreshTable()
  }

  onMount(() => {
    createSpreadsheet(spreadsheetRecord)
    refreshTable()
  })

  $: {
    createSpreadsheet(spreadsheetRecord)
    refreshTable()
  }

  function exportAsXLSX() {
    exportDataToXLSX(data)
  }

  function formatInputNumber(input, formatType) {
    if (!isTableEditable) return input
    if (
      formatType === NUMBER_FORMATS.EUR ||
      formatType === NUMBER_FORMATS.USD ||
      formatType === NUMBER_FORMATS.RUB
    ) {
      return formatToCurrency(input, formatType)
    }

    if (formatType === NUMBER_FORMATS.Number) {
      return floatNumberWithSpaces(input)
    }
    if (formatType === NUMBER_FORMATS.Date) {
      return formatToDate(input)
    }
    if (formatType === NUMBER_FORMATS.Percent) {
      return formatToPercent(input)
    }
    if (formatType === NUMBER_FORMATS['To precision']) {
      return formatToPrecision(input)
    }
    if (formatType === NUMBER_FORMATS['Plain text']) {
      return input
    } else {
      return input
    }
  }

  function applyNumberFormattingToCells(value) {
    applyActionForSelectedCells(currCell, (cell) => {
      cell.display = formatInputNumber(cell.value, value)
    })
    refreshTable()
  }

  function formatInputTextStyle(cell, formatType) {
    if (!isTableEditable) return
    switch (formatType) {
      case 'regular': {
        cell.format.bold = 0
        cell.format.italics = 0
        cell.format.underline = 0
        break
      }
      case 'bold': {
        cell.format.bold = 1
        break
      }
      case 'italics': {
        cell.format.italics = 1
        break
      }
      case 'underline': {
        cell.format.underline = 1
        break
      }
      default: {
        break
      }
    }
  }

  function applyTextFormattingToCells(value) {
    applyActionForSelectedCells(currCell, (cell) => {
      formatInputTextStyle(cell, value)
    })
    refreshTable()
    saveSpreadsheet()
  }

  function appendRowToTable() {
    const { row, row2 } = currCell
    const appendLength = Math.abs(row - row2) + 1
    const appendToPositionIndex = Math.min(row, row2)

    /**@type {RowSetting[]}*/
    const configRows = []
    const rows = []

    for (let i = 0; i < appendLength; i++) {
      configRows.push(structuredClone(DEFAULT_ROW_SETTING))
      const row = []
      for (let i = 0; i < data.length; i++) {
        const cell = makeDefaultCell()
        cell.format = structuredClone(DEFAULT_CELL_FORMAT)
        row.push(cell)
      }
      rows.push(row)
    }

    config.rowSetting.splice(appendToPositionIndex, 0, ...configRows)
    data.splice(appendToPositionIndex, 0, ...rows)

    config.selCells = {
      col: -1,
      row: -1,
      col2: -1,
      row2: -1,
    }
    saveSpreadsheet()
  }

  function appendColumnToTable() {
    const { col, col2 } = currCell
    const appendLength = Math.abs(col - col2) + 1
    const appendIndex = Math.min(col, col2)

    /**@type {ColSetting[][]}*/
    const configColumns = []

    for (let i = 0; i < appendLength; i++) {
      configColumns.push(structuredClone(DEFAULT_COLUMN_SETTING))
    }

    config.columnSetting.splice(appendIndex, 0, ...configColumns)

    for (let i = 0; i < config.rowSetting.length; i++) {
      const subRow = []
      for (let j = appendIndex; j < appendIndex + appendLength; j++) {
        const cell = makeDefaultCell()
        cell.format = structuredClone(DEFAULT_CELL_FORMAT)
        subRow.push(cell)
      }
      data[i].splice(appendIndex, 0, ...subRow)
    }

    config.selCells = {
      col: -1,
      row: -1,
      col2: -1,
      row2: -1,
    }
    saveSpreadsheet()
  }

  function handleAddColOrRow(event) {
    const { add } = event.detail
    if (add === 'row') appendRowToTable()
    else if (add === 'column') appendColumnToTable()
  }

  function clearCellsFormatting() {
    applyActionForSelectedCells(currCell, (cell) => {
      cell.display = cell.value
      cell.format = structuredClone(DEFAULT_CELL_FORMAT)
    })
    refreshTable()
    saveSpreadsheet()
  }

  function applyActionForEveryCell(callback) {
    data.forEach((row) => {
      row.forEach((cell) => {
        callback(cell)
      })
    })
  }

  /**
   * @callback applyActionForSelectedCellsCB
   * @param {Cell} cell
   */

  /**
   * @param {Selection} selection
   * @param {applyActionForSelectedCellsCB} callback
   */

  function applyActionForSelectedCells(selection, callback) {
    if (!selection) return
    const { col, row, col2, row2 } = selection
    for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
      for (let j = Math.min(col, col2); j <= Math.max(col, col2); j++) {
        callback(data[i][j])
      }
    }
  }

  function changeTableEditMode() {
    isTableEditable = !isTableEditable
    config.isTableEditable = isTableEditable
    applyActionForEveryCell((cell) => {
      cell.nowIsViewMode = !isTableEditable
      if (cell.canEditInViewMode) {
        return (cell.format.readonly = false)
      }
      cell.format.readonly = !isTableEditable
    })
  }

  function changeTableEditModeWithConfirm() {
    if (config.isTableEditable) {
      changeTableEditMode()
    } else {
      confirm(
        'Вы уверены, что хотите перейти в режим редактирования?',
        changeTableEditMode
      )
    }
  }

  /**
   * @param {Colors} colorTheme
   */
  function changeCellsTheme(colorTheme) {
    const { background, color } = colorTheme
    applyActionForSelectedCells(currCell, (cell) => {
      cell.format.background = background
      cell.format.colour = color
    })
    refreshTable()
    saveSpreadsheet()
  }

  function clearCellsValue() {
    applyActionForSelectedCells(currCell, (cell) => {
      cell.value = ''
      cell.display = ''
    })
    refreshTable()
    saveSpreadsheet()
  }

  function handleClearCellsAll() {
    clearCellsValue()
    clearCellsFormatting()
  }

  function handleChangeKindOfCellFromContextMenu(event) {
    const { kind } = event.detail
    const { col, row } = currCell
    data[row][col].kind = CELL_KINDS[kind]

    refreshTable()
  }

  const number_formats = Object.entries(NUMBER_FORMATS)
  const text_formats = Object.entries(TEXT_FORMATTING)
</script>

<Grid fullWidth noGutter>
  {#if !spreadsheetRecord}
    <span>Select table left side panel!</span>
  {:else}
    <Grid noGutter>
      <Row>
        <Column noGutter style="position: relative;">
          <div
            class="bx--data-table-header"
            style="background: var(--cds-layer, #f4f4f4); padding: 1rem;"
          >
            <h4 class="bx--data-table-header__title">
              {spreadsheetRecord.name}
            </h4>
            <p class="bx--data-table-header__description">
              {$_('pageSpreadsheet.table.description')}
            </p>
          </div>
          {#if !config.isTableEditable}
            <Button
              on:click={changeTableEditModeWithConfirm}
              size="field"
              style="position: absolute; right: 0; top: -40px;"
              >Редактировать таблицу</Button
            >
          {/if}
        </Column>
      </Row>
      <Row
        style="background: var(--cds-layer); border-bottom: 1px solid var(--cds-border-subtle-selected); min-height: 40px; height: 40px;"
      >
        <!--* Toolbar-->
        <Toolbar
          style="background: var(--cds-layer-accent, #e0e0e0); min-height: 40px; height: 40px;border-bottom: 1px solid var(--cds-border-subtle-selected)"
        >
          {#if isTableEditable}
            <OverflowMenu
              style=" min-height: 40px; height: 40px;"
              class="spreadsheet_toolbar_icon_size"
              size="xl"
              iconDescription="Number formatting"
            >
              <svelte:fragment slot="menu">
                <CharacterWholeNumber />
              </svelte:fragment>
              {#each number_formats as [name, value]}
                <OverflowMenuItem
                  on:click={() => applyNumberFormattingToCells(value)}
                  text={name}
                />
              {/each}
            </OverflowMenu>

            <OverflowMenu
              style=" min-height: 40px; height: 40px;"
              size="xl"
              class="spreadsheet_toolbar_icon_size"
            >
              <svelte:fragment slot="menu">
                <TextFont />
              </svelte:fragment>
              {#each text_formats as [name, value]}
                <OverflowMenuItem
                  on:click={() => applyTextFormattingToCells(value)}
                  text={name}
                />
              {/each}
            </OverflowMenu>

            <Palette
              on:colorchoose={(event) => {
                changeCellsTheme(event.detail)
              }}
            />
            <!-- 
                        <OverflowMenu
                            style=" min-height: 40px; height: 40px;"
                            class="spreadsheet_toolbar_icon_size"
                            iconDescription="Add rows/columns"
                            size="xl"
                        >
                            <svelte:fragment slot="menu">
                                <Add />
                            </svelte:fragment>
                            <OverflowMenuItem text="Add rows" on:click={appendRowToTable} />
                            <OverflowMenuItem text="Add columns" on:click={appendColumnToTable} />
                        </OverflowMenu> -->

            <OverflowMenu
              style=" min-height: 40px; height: 40px;"
              class="spreadsheet_toolbar_icon_size"
              iconDescription={$_('pageSpreadsheet.table.toolbar.clearFormat')}
              icon={TextClearFormat}
              kind="ghost"
            >
              <OverflowMenuItem on:click={handleClearCellsAll}
                >Очистить всё</OverflowMenuItem
              >
              <OverflowMenuItem on:click={clearCellsFormatting}
                >Очистить форматы</OverflowMenuItem
              >
              <OverflowMenuItem on:click={clearCellsValue}
                >Очистить содержимое</OverflowMenuItem
              >
            </OverflowMenu>
            <!-- <OverflowMenu
                            style="min-height: 40px; height: 40px;"
                            class="spreadsheet_toolbar_icon_size"
                        >
                            <OverflowMenuItem on:click={() => handleChangeKindOfCell(CELL_KINDS["CELL"])}
                                >Cell</OverflowMenuItem
                            >
                            <OverflowMenuItem on:click={() => handleChangeKindOfCell(CELL_KINDS["PICKLIST"])}
                                >Picklist</OverflowMenuItem
                            >
                        </OverflowMenu> -->
          {/if}
          <div style="margin-left: auto;">
            <Button
              style="min-height: 40px; height: 40px;"
              class="spreadsheet_toolbar_icon_size"
              icon={Download}
              iconDescription="Export as XLSX"
              on:click={exportAsXLSX}
              kind="ghost"
            />
            <Button
              style=" min-height: 40px; height: 40px;"
              class="spreadsheet_toolbar_icon_size"
              size="lg"
              kind="ghost"
              tooltipPosition="bottom"
              on:click={changeTableEditModeWithConfirm}
              icon={isTableEditable ? Unlocked : Locked}
              iconDescription={isTableEditable
                ? $_('pageSpreadsheet.table.toolbar.viewMode')
                : $_('pageSpreadsheet.table.toolbar.editMode')}
            />
          </div>
          <Button
            style=" min-height: 40px; height: 40px;"
            on:click={() => {
              dispatch('new_table')
            }}
          >
            {$_('pageSpreadsheets.sidebar.addTableButton')}
          </Button>
        </Toolbar>
      </Row>
    </Grid>
    <!--* Spreadsheet-->
    <Row noGutter>
      <Column
        noGutter
        md={16}
        lg={{
          span: 16,
          offset: 0,
        }}
        style="max-height: calc(100vh - calc(3rem + 80px + 2px + 78px))"
      >
        <Table
          {data}
          {config}
          {uid}
          on:startedit={startEdit}
          on:endedit={onEdit}
          on:selChange={onSelectionChange}
          on:updateSpecialFormula={updateSpecialFormula}
          on:addColOrRow={handleAddColOrRow}
          on:changeCellKind={handleChangeKindOfCellFromContextMenu}
        />
      </Column>
    </Row>
  {/if}
</Grid>
