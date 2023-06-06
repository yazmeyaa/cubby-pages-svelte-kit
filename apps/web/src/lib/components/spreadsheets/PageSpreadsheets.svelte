<script>

  import SpreadsheetsSidebar from './SpreadsheetsSidebar.svelte'
  import PageWrapper from '$lib/components/base/PageWrapper.svelte'
  import SpreadsheetView from './SpreadsheetView.svelte'
  import { activeTable } from '$lib/stores/tables'
  import { loadCollections } from '$lib/stores/collections'
  import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Column,
    Content,
    Grid,
    Row,
  } from 'carbon-components-svelte'
  import RecordUpsertPanel from '../records/RecordUpsertPanel.svelte'
  import { onMount } from 'svelte'

  import { tables_collection } from '$lib/stores/tables'
  import { collections } from '$lib/stores/collections'
  import ApiClient from '$lib/utils/ApiClient'

  import { _ } from 'svelte-i18n'

  // let data = [];
  // let TABLES_COLLECTION = {};
  // let records = []
  // $: tablesRecords = records;
  // $: console.log($tables_collection);

  // let tableUpsertPanel;

  // onMount(() => {
  //     if (!$collections) loadCollections();
  //     collections.subscribe((value) => {
  //         data = value;
  //     });
  //     loadRecordList();
  // });
  // function loadRecordList() {
  //     const TABLES = ApiClient.collection("cfg_spreadsheets");
  //     TABLES.getList(1, 500, {$$autoCancel: false}).then((data) => {
  //         records = [...data.items];
  //         TABLES_COLLECTION = tablesRecords;
  //     });
  // }

  // loadCollections();
</script>

<SpreadsheetsSidebar />
<PageWrapper>
  {#if !$activeTable}
    <Grid>
      <Column padding>
        <h2>{$_('pageSpreadsheet.tableNotSelected')}</h2>
      </Column>
    </Grid>
  {:else}
    <!-- <header class="page-header">
            <nav >
                <div class="breadcrumb-item">{$_("pageSpreadsheet.header.breadcrumbs.page")}</div>
                <div class="breadcrumb-item">{$activeTable.name}</div>
            </nav>
        </header> -->
    <header
      style="display: flex; align-items: center; height: 40px;margin-left: 1rem; box-sizing:border-box"
    >
      <!-- style="margin-top: 10.6px;"-->
      <Breadcrumb>
        <BreadcrumbItem>{$_('pageRecords.breadcrumbs.page')}</BreadcrumbItem>

        <BreadcrumbItem>{$activeTable.name}</BreadcrumbItem>
      </Breadcrumb>
      <!-- <nav >
                <div class="breadcrumb-item">{$_("pageRecords.breadcrumbs.page")}</div>
                <div class="breadcrumb-item">{$pageTitle}</div>
            </nav> -->
    </header>
    <Grid noGutter style="padding: 0px 1rem;">
      <!-- <Row padding noGutter> -->
      <!-- <Column> -->

      <!-- <Breadcrumb>
                        <BreadcrumbItem>{$_('pageSpreadsheet.header.breadcrumbs.page')}</BreadcrumbItem>
                        <BreadcrumbItem>{$activeTable.name}</BreadcrumbItem>
                    </Breadcrumb> -->
      <!-- </Column> -->
      <!-- </Row> -->
      <Row>
        <Column>
          <SpreadsheetView spreadsheetRecord={$activeTable} />
        </Column>
      </Row>
    </Grid>
  {/if}
</PageWrapper>

<!-- <RecordUpsertPanel
    bind:this={tableUpsertPanel}
    collection={tables_collection}
    on:save={loadRecordList}
    on:delete={loadRecordList}
/>  -->
<style>
  .content_wrapper {
    max-width: calc(100vw - calc(300px + 3rem));
    margin: 0px auto;
    margin-top: 3rem;
  }
</style>
