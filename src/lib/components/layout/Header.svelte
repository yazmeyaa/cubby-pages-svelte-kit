<script lang="ts">
    import {
        Header,
        HeaderNav,
        HeaderNavMenu,
        HeaderNavItem,
        HeaderPanelDivider,
        HeaderUtilities,
        HeaderGlobalAction,
        HeaderAction,
        HeaderPanelLinks,
        HeaderPanelLink,
    } from "carbon-components-svelte";
    import Logout from "carbon-icons-svelte/lib/Logout.svelte";
    import Earth from "carbon-icons-svelte/lib/Earth.svelte";
    import Sun from "carbon-icons-svelte/lib/Sun.svelte";
    import Moon from "carbon-icons-svelte/lib/Moon.svelte";
    import Notification from "carbon-icons-svelte/lib/Notification.svelte";
    import IbmWatsonLanguageTranslator from "carbon-icons-svelte/lib/IbmWatsonLanguageTranslator.svelte";

    import { createEventDispatcher } from "svelte";

    import { locale, _ } from "svelte-i18n";
    import { admin } from "$lib/stores/admin";

    import ApiClient from "$lib/utils/ApiClient";
    import type { CarbonTheme } from "carbon-components-svelte/types/Theme/Theme.svelte"

    export let isInFrame: boolean;
    export let isSideNavOpen: boolean;
    export let currentTheme: CarbonTheme;
    const dispatch = createEventDispatcher<{changeTheme: {theme: CarbonTheme}}>();

    /**
     * @param {"white" | "g10" | "g80" | "g90" | "g100"} theme - white, g10, g80, g90, g100
     */
    function handleChangeTheme(theme: CarbonTheme) {
        console.log(theme)
        dispatch("changeTheme", { theme });
    }

    let languagePanelOpen = false;

    let accountPanelOpen = false;
</script>

<Header persistentHamburgerMenu={true} bind:isSideNavOpen>
    <div slot="platform" class="app-header" style="width:246px;">
        <img
            class="header_logo"
            src="{import.meta.env.BASE_URL}images/logo.svg"
            width="45"
            height="45"
            alt="logo"
        />
        <div><strong>CUBBY II &nbsp;</strong><small>data platform</small></div>
    </div>

    {#if !isInFrame}
        <HeaderUtilities>
            <HeaderAction bind:isOpen={languagePanelOpen} style="display: flex;justify-content:center;align-items:center;">
                <svelte:fragment slot="icon">
                    <IbmWatsonLanguageTranslator />
                </svelte:fragment>

                <HeaderPanelDivider>{$_("header.language")}</HeaderPanelDivider>

                <HeaderPanelLinks>
                    <HeaderPanelLink
                        on:click={() => {
                            $locale = "ru";
                            languagePanelOpen = false
                        }}
                    >
                        Русский
                    </HeaderPanelLink>
                    <HeaderPanelLink
                        on:click={() => {
                            $locale = "en";
                            languagePanelOpen = false
                        }}
                    >
                        English
                    </HeaderPanelLink>
                </HeaderPanelLinks>
            </HeaderAction>
            <HeaderGlobalAction
                style="display: flex;justify-content:center;align-items:center;"
                icon={currentTheme === "g80" ? Sun : Moon}
                on:click={() => {
                    handleChangeTheme(currentTheme === "g80" ? "white" : "g80");
                }}
            />

            <HeaderGlobalAction
                style="display: flex;justify-content:center;align-items:center;"
                icon={Notification}
            />

            <HeaderAction
                style="display: flex;justify-content:center;align-items:center;"
                bind:isOpen={accountPanelOpen}
            >
                <svelte:fragment slot="icon">
                    <div style="padding: 0.25rem;  overflow: hidden;">
                        <img
                            style="border-radius: 50%;"
                            src="{import.meta.env.BASE_URL}images/avatars/avatar{$admin?.avatar || 0}.svg"
                            alt="Avatar"
                        />
                    </div>
                </svelte:fragment>
                <HeaderPanelLinks>
                    <div class="header_panel_admin_info">
                        <img
                            src="{import.meta.env.BASE_URL}images/avatars/avatar{$admin?.avatar || 0}.svg"
                            alt="Avatar"
                        />
                        <span>{$admin.id}</span>
                    </div>
                    <HeaderPanelDivider />
                    <HeaderPanelLink
                        on:click={() => {
                            localStorage.removeItem("cubberAuth");
                            ApiClient.logout();
                        }}
                    >
                        Logout
                    </HeaderPanelLink>
                </HeaderPanelLinks>
            </HeaderAction>
        </HeaderUtilities>
    {/if}
</Header>

<style>
    .header_panel_admin_info {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }
    .header_panel_admin_info > img {
        border-radius: 50%;
        height: 48px;
    }
</style>
