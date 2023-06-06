<script lang="ts">
  import { pb as ApiClient, pb } from '$lib/pocketbase'
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
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

  import Spreadsheet from 'x-data-spreadsheet'

  import { confirm } from '$lib/stores/confirmation'

  import CUBES from './data/result.json'

  import { _ } from 'svelte-i18n'

  import { requestTM1CubeData } from './helpers/TM1RequestHelper'
  import { exportDataToXLSX } from './helpers/saveXlsx'
  import { CELL_KINDS } from '$lib/types/spreadsheet'
  import FormulaParser from 'fast-formula-parser'
  import type { Record } from 'pocketbase'

  let data: any
  export let spreadsheetRecord: Record
  let spreadsheet: Spreadsheet
  let saveInterval

  function createSpreadsheet(record: Record) {
    if (data) {
      data = record.data
    }

    spreadsheet = new Spreadsheet('#spreadsheet')
    spreadsheet.loadData(record.data)
  }

  function handleSaveSpreadsheet() {
    const data = spreadsheet.getData()

    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    formData.append('name', spreadsheetRecord.name)

    pb.collection(spreadsheetRecord.collectionId).update(
      spreadsheetRecord.id,
      formData,
      {
        $autoCancel: false,
      }
    )
  }

  onMount(() => {
    createSpreadsheet(spreadsheetRecord)
  })
</script>

<Grid fullWidth noGutter>
  {#if !spreadsheetRecord}
    <span>Select table left side panel!</span>
  {:else}
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
      </Column>
    </Row>
    <Row noGutter>
      <Column>
        <Button on:click={handleSaveSpreadsheet}>Save spreadsheet</Button>
      </Column>
    </Row>
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
        <div id="spreadsheet" />
      </Column>
    </Row>
  {/if}
</Grid>
