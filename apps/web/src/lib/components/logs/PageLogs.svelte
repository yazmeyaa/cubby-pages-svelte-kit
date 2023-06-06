<script>
    import { pageTitle } from "$lib/stores/app";
    import Field from "$lib/components/base/Field.svelte";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import Searchbar from "$lib/components/base/Searchbar.svelte";
    import RefreshButton from "$lib/components/base/RefreshButton.svelte";
    import LogsList from "$lib/components/logs/LogsList.svelte";
    import LogsChart from "$lib/components/logs/LogsChart.svelte";
    import LogViewPanel from "$lib/components/logs/LogViewPanel.svelte";

    import { _ } from "svelte-i18n";
    import { Breadcrumb, BreadcrumbItem, Button, Toggle } from "carbon-components-svelte";

    import Reset from 'carbon-icons-svelte/lib/Reset.svelte'
  import { browser } from "$app/environment"

    const ADMIN_LOGS_LOCAL_STORAGE_KEY = "includeAdminLogs";

    $pageTitle = "Request logs";

    let logPanel;
    let filter = "";
    let includeAdminLogs = browser &&  window.localStorage?.getItem(ADMIN_LOGS_LOCAL_STORAGE_KEY) << 0;
    let refreshToken = 1;

    $: presets = !includeAdminLogs ? 'auth!="admin"' : "";

    $: if (browser && (typeof includeAdminLogs !== "undefined" && window.localStorage) ) {
        browser && window.localStorage.setItem(ADMIN_LOGS_LOCAL_STORAGE_KEY, includeAdminLogs << 0);
    }

    function refresh() {
        refreshToken++;
    };
</script>

<PageWrapper>
    <div class="page-header-wrapper m-b-0">
        <header style="display: flex; align-items: center; height: 40px;margin-left: 1rem; box-sizing:border-box">
            <!-- <nav >
                <div class="breadcrumb-item">{$_("pageLogs.header")}</div>
            </nav> -->
            <Breadcrumb>
                <BreadcrumbItem>{$_("pageLogs.header")}</BreadcrumbItem>
            </Breadcrumb>


            <div class="flex-fill" />

            <div class="inline-flex">
                <Field class="form-field form-field-toggle m-0" let:uniqueId>
                    <input type="checkbox" id={uniqueId} bind:checked={includeAdminLogs} />
                    <label for={uniqueId}>{$_("pageLogs.includeAdminRequests")}</label>

                </Field>
            </div>
        </header>

        <Searchbar
            value={filter}
            placeholder={$_("pageLogs.search.placeholder")}
            extraAutocompleteKeys={[
                "method",
                "url",
                "remoteIp",
                "userIp",
                "referer",
                "status",
                "auth",
                "userAgent",
            ]}
            on:submit={(e) => (filter = e.detail)}
        />

        <div class="clearfix" />

        {#key refreshToken}
            <LogsChart bind:filter {presets} />
        {/key}
    </div>

    {#key refreshToken}
        <LogsList bind:filter {presets} on:select={(e) => logPanel?.show(e?.detail)}>
            <svelte:fragment slot="refreshButton">
                <Button on:click={() => refresh()} kind="ghost" iconDescription={$_('pageRecords.table.toolbar.refresh.description')} tooltipPosition="left" icon={Reset} />
            </svelte:fragment>
        </LogsList>
    {/key}
</PageWrapper>

<LogViewPanel bind:this={logPanel} />
