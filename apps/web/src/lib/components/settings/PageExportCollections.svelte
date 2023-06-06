<script>
    import {pb as ApiClient} from "$lib/pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import { pageTitle } from "$lib/stores/app";
    import { addInfoToast } from "$lib/stores/toasts";
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";
    import CodeBlock from "$lib/components/base/CodeBlock.svelte";
    import SettingsSidebar from "$lib/components/settings/SettingsSidebar.svelte";

    import { _ } from "svelte-i18n";
    import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";

    $pageTitle = "Export collections";

    const uniqueId = "export_" + CommonHelper.randomString(5);

    let previewContainer;
    let collections = [];
    let isLoadingCollections = false;

    $: schema = JSON.stringify(collections, null, 4);

    loadCollections();

    async function loadCollections() {
        isLoadingCollections = true;

        try {
            collections = await ApiClient.collections.getFullList(100, {
                $cancelKey: uniqueId,
                sort: "updated",
            });
            // delete timestamps
            for (let collection of collections) {
                delete collection.created;
                delete collection.updated;
            }
        } catch (err) {
            ApiClient.errorResponseHandler(err);
        }

        isLoadingCollections = false;
    }

    function download() {
        CommonHelper.downloadJson(collections, "pb_schema");
    }

    function copy() {
        CommonHelper.copyToClipboard(schema);
        addInfoToast("The configuration was copied to your clipboard!", 3000);
    }
</script>

<SettingsSidebar />

<PageWrapper>
    <header class="page-header">
        <Breadcrumb>
            <BreadcrumbItem>{$_("pageSettings.header.breadcrumbs.page")}</BreadcrumbItem>
            <BreadcrumbItem>{$_("pageSettings.export.header.breadcrumbs.title")}</BreadcrumbItem>
        </Breadcrumb>
    </header>

    <div style="padding: 1rem;">
        <div>
            {#if isLoadingCollections}
                <div class="loader" />
            {:else}
                <div class="content txt-xl m-b-base">
                    <p>
                        {$_("pageSettings.export.pageDescription")}
                    </p>
                </div>

                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <div
                    bind:this={previewContainer}
                    tabindex="0"
                    class="export-preview"
                    on:keydown={(e) => {
                        // select all
                        if (e.ctrlKey && e.code === "KeyA") {
                            e.preventDefault();
                            const selection = window.getSelection();
                            const range = document.createRange();
                            range.selectNodeContents(previewContainer);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }}
                >
                    <button
                        type="button"
                        class="pb-btn btn-sm pb-btn-transparent fade copy-schema"
                        on:click={() => copy()}
                    >
                        <span class="txt">{$_("copy")}</span>
                    </button>

                    <CodeBlock content={schema} />
                </div>

                <div class="flex m-t-base">
                    <div class="flex-fill" />
                    <button type="button" class="pb-btn btn-expanded" on:click={() => download()}>
                        <i class="ri-download-line" />
                        <span class="txt">{$_("pageSettings.export.downloadJSON")}</span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</PageWrapper>

<style>
    .export-preview {
        position: relative;
        height: 500px;
    }
    .export-preview .copy-schema {
        position: absolute;
        right: 15px;
        top: 15px;
    }
</style>
