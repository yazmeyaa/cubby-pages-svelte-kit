<script>
    // import SpreadsheetsSidebar from "./SpreadsheetsSidebar.svelte";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import DynaTableComponent from "./DynaTableComponent.svelte";
   
    // import { loadCollections } from "$lib/stores/collections";
    // import { Breadcrumb, BreadcrumbItem, Column, Content, Grid, Row } from "carbon-components-svelte";
    import { loadCollections } from "$lib/stores/collections";

    // console.log(());
    import { writable } from "svelte/store";
    import ApiClient    from "$lib/utils/ApiClient";

    // import CommonHelper from "$lib/utils/CommonHelper";

    import {_} from 'svelte-i18n'
    
    let topLevelPromise = async () => {
        let workbooks = await ApiClient.collection('dyna_workbooks').getList(1, 20, {}).then(e => e.items);
        return workbooks;
    };
    // loadCollections();
</script>
<PageWrapper style="margin:0px;padding:0;">
         <header class="page-header">
            <nav >
                <div class="breadcrumb-item">Dynamic Workbooks & Tables</div>
            </nav>

            <div class="inline-flex gap-5">
               
            </div>

            <div class="btns-group">
                <button type="button" class="pb-btn btn-expanded">
                    <i class="ri-add-line" />
                    <span class="txt">{$_('pageDynatable.createWorkbook')}</span>
                </button>
                <button type="button" class="pb-btn btn-expanded">
                    <i class="ri-add-line" />
                    <span class="txt">{$_('pageDynatable.createSheetInWorkbook')}</span>
                </button>
            </div>
        </header>
        <!-- <div class="clearfix" /> -->
{#await topLevelPromise}
    Loading...
{:then c } 
    <DynaTableComponent collections={c} />
{/await}
</PageWrapper>