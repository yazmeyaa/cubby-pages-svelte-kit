<script>
    import "./scss/main.scss";

    import Router, { replace, link, location } from "svelte-spa-router";
    import routes from "./routes";
    import ApiClient from "@/utils/ApiClient";
    import CommonHelper from "@/utils/CommonHelper";

    import Toasts from "@/components/base/Toasts.svelte";

    import Confirmation from "@/components/base/Confirmation.svelte";
    import { pageTitle, appName, hideControls, appTheme } from "@/stores/app";
    import { admin } from "@/stores/admin";
    import { setErrors } from "@/stores/errors";
    import { resetConfirmation } from "@/stores/confirmation";
    import TinyMCE from "@tinymce/tinymce-svelte";

    import Header from "@/components/layout/Header.svelte";
    import NavLink from "@/components/layout/NavLink.svelte";

    import { SideNav, SideNavItems, Content, Theme } from "carbon-components-svelte";
    import DataBase from "carbon-icons-svelte/lib/DataBase.svelte";
    import Cube from "carbon-icons-svelte/lib/Cube.svelte";
    import Grid from "carbon-icons-svelte/lib/Grid.svelte";
    import ListBulleted from "carbon-icons-svelte/lib/ListBulleted.svelte";
    import DataTable from "carbon-icons-svelte/lib/DataTable.svelte";
    import ChartHistogram from "carbon-icons-svelte/lib/ChartHistogram.svelte";
    import Settings from "carbon-icons-svelte/lib/Settings.svelte";

    let oldLocation = undefined;
    let menu;
    let showAppSidebar = false;
    let active_folders;
    let navigating;
    let initPromise;
    let Auth;
    let isTinyMCEPreloaded = false;

    $: if ($admin?.id) {
        loadSettings();
    }

    function handleRouteLoading(e) {
        if (e?.detail?.location === oldLocation) {
            return; // not an actual change
        }

        showAppSidebar = !!e?.detail?.userData?.showAppSidebar;

        oldLocation = e?.detail?.location;

        // resets
        $pageTitle = "";
        setErrors({});
        resetConfirmation();
    }

    function handleRouteFailure() {
        replace("/");
    }

    async function loadSettings() {
        if (!$admin?.id) {
            return;
        }

        try {
            const settings = await ApiClient.settings.getAll({
                $cancelKey: "initialAppSettings",
            });
            $appName = settings?.meta?.appName || "";
            $hideControls = !!settings?.meta?.hideControls;
        } catch (err) {
            if (!err?.isAbort) {
                console.warn("Failed to load app settings.", err);
            }
        }
    }

    function logout() {
        ApiClient.logout();
    }

    //export let menu;

    import { Breadcrumb, BreadcrumbItem, SkeletonText } from "carbon-components-svelte";
    import { LocalStorage, Toggle } from "carbon-components-svelte";

    //import { navigating } from '$app/stores';
    //import { page } from "$app/stores";
    //import { writable,  } from 'svelte/store';

    //let active_folders = writable([]);
    let page;
    let theme = "g90";
    let isSideNavOpen = true;
    let isAuth = false;
    let isInFrame = false;
    //$: currentSection = "/" + $page.url.pathname.split('/')[1];
    // $: document.documentElement.setAttribute("active_folders", $active_folders );

    function handleChangeTheme(event) {
        $appTheme = event.detail.theme;
        theme = event.detail.theme;
    }
</script>

<svelte:head>
    <title>{CommonHelper.joinNonEmpty([$pageTitle, $appName, "Cubby"], " - ")}</title>
</svelte:head>

<Theme bind:theme persist persistKey="__carbon-theme" />

<Header on:changeTheme={handleChangeTheme} {isInFrame} />

<SideNav bind:isOpen={isSideNavOpen} rail>
    <SideNavItems>
        <NavLink icon={DataBase} linkTo="collections" text="Collections" />
        <NavLink icon={Cube} linkTo="cubes" text="Cubes" />
        <NavLink icon={Grid} linkTo="querygrid" text="Query Grid" />
        <NavLink icon={ListBulleted} linkTo="hierarchy" text="Hierarchy" />
        <NavLink icon={DataTable} linkTo="spreadsheets" text="Spreadsheets" />
        <NavLink icon={ChartHistogram} linkTo="logs" text="Logs" />
        <NavLink icon={Settings} linkTo="settings" text="Settings" />
    </SideNavItems>
</SideNav>

<!-- <div class={!isInFrame ? "main" : "main main-full"}> -->
<Content style="padding: 0px; height: calc(100% - 3rem);">
    <div class="container">
        {#if !isInFrame}
            <!-- * Тут портал для рендера компонентов из роутера. -->
            <div id="left_app_sidebar" />
        {/if}
        {#await initPromise then value}
            <Router {routes} on:routeLoading={handleRouteLoading} on:conditionsFailed={handleRouteFailure} />
            <Toasts />
        {/await}
    </div>
</Content>
<!-- </div> -->
<!-- </div> -->

<Confirmation />

{#if showAppSidebar && !isTinyMCEPreloaded}
    <div class="tinymce-preloader hidden">
        <TinyMCE
            scriptSrc="{import.meta.env.BASE_URL}libs/tinymce/tinymce.min.js"
            conf={CommonHelper.defaultEditorOptions()}
            on:init={() => {
                isTinyMCEPreloaded = true;
            }}
        />
    </div>
{/if}

<style>
    @import "carbon-components-svelte/css/all.css";

    .container {
        display: flex;
        height: 100%;
        /* display: grid;
        width: 100vw;
        height: 100vh;

        grid-template-areas:
            "header header"
            "left main";
        /* grid-template-columns: 300px 4fr; */
        /* grid-template-rows: 48px 1fr; */
    }

    #left_app_sidebar {
        height: 100%;
    }
    #left_app_sidebar > div {
        background-color: red;
    }

    #main_content {
        padding-left: 0px !important;
    }

    .main {
        grid-area: main;
        overflow: scroll;
    }
    .main.main-full {
        grid-column-start: left;
        grid-column-end: main;
    }
</style>
