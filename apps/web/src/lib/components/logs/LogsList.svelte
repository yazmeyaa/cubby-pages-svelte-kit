<script>
    import { createEventDispatcher } from "svelte";
    import ApiClient from "$lib/utils/ApiClient";
    import CommonHelper from "$lib/utils/CommonHelper";
    import SortHeader from "$lib/components/base/SortHeader.svelte";
    import FormattedDate from "$lib/components/base/FormattedDate.svelte";
    import HorizontalScroller from "$lib/components/base/HorizontalScroller.svelte";

    import { _ } from "svelte-i18n";
    import { DataTable, Toolbar, ToolbarContent } from "carbon-components-svelte";

    const dispatch = createEventDispatcher();
    const labelMethodClass = {
        get: "label-info",
        post: "label-success",
        patch: "label-warning",
        delete: "label-danger",
    };

    export let filter = "";
    export let presets = "";
    export let sort = "-rowid";

    let items = [];
    let currentPage = 1;
    let totalItems = 0;
    let isLoading = false;
    let yieldedItemsId = 0;

    $: if (typeof sort !== "undefined" || typeof filter !== "undefined" || typeof presets !== "undefined") {
        clearList();
        load(1);
    }

    $: canLoadMore = totalItems > items.length;

    export async function load(page = 1, breakTasks = true) {
        isLoading = true;

        return ApiClient.logs
            .getRequestsList(page, 30, {
                sort: sort,
                filter: [presets, filter].filter(Boolean).join("&&"),
            })
            .then(async (result) => {
                if (page <= 1) {
                    clearList();
                }

                isLoading = false;
                currentPage = result.page;
                totalItems = result.totalItems;
                dispatch("load", items.concat(result.items));

                // optimize the items listing by rendering the rows in task batches
                if (breakTasks) {
                    const currentYieldId = ++yieldedItemsId;
                    while (result.items.length) {
                        if (yieldedItemsId != currentYieldId) {
                            break; // new yeild has been started
                        }

                        items = items.concat(result.items.splice(0, 10));

                        await CommonHelper.yieldToMain();
                    }
                } else {
                    items = items.concat(result.items);
                }
            })
            .catch((err) => {
                if (!err?.isAbort) {
                    isLoading = false;
                    console.warn(err);
                    clearList();
                    ApiClient.errorResponseHandler(err, false);
                }
            });
    }


    function clearList() {
        items = [];
        currentPage = 1;
        totalItems = 0;
    }

    $: headers = [
        {
            key: "method",
            value: "Method",
            width: "100px",
        },
        {
            key: "url",
            value: "URL",
            width: "360px",
        },
        {
            key: "referer",
            value: "Referer",
            referer: "360px",
        },
        {
            key: "userIp",
            value: "User IP",
        },
        {
            key: "status",
            value: "Status",
        },
        {
            key: "created",
            value: "created",
            width: "220px",
        },
    ];

</script>

<DataTable
    {headers}
    rows={items}
    sortable
    on:click:row={(event) => {
        dispatch("select", event.detail);
    }}
>
<Toolbar>
    <ToolbarContent>
        <slot name="refreshButton" />
    </ToolbarContent>
</Toolbar>
</DataTable>


{#if items.length}
    <small class="block txt-hint txt-right m-t-sm">Showing {items.length} of {totalItems}</small>
{/if}

{#if items.length && canLoadMore}
    <div class="block txt-center m-t-xs">
        <button
            type="button"
            class="pb-btn btn-lg btn-secondary btn-expanded"
            class:btn-loading={isLoading}
            class:btn-disabled={isLoading}
            on:click={() => load(currentPage + 1)}
        >
            <span class="txt">{$_("loadMore")} ({totalItems - items.length})</span>
        </button>
    </div>
{/if}
