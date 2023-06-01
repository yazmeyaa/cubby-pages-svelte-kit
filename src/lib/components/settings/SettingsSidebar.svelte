<script>
    import { link } from "svelte-spa-router";
    import PortalToAppLeftSidebar from "$lib/components/base/PortalToAppLeftSidebar.svelte";
    import active from "svelte-spa-router/active";

    import { _ } from "svelte-i18n";

    import Home from "carbon-icons-svelte/lib/Home.svelte";
    import Email from "carbon-icons-svelte/lib/Email.svelte";
    import BlockStorageAlt from "carbon-icons-svelte/lib/BlockStorageAlt.svelte";
    import Export from "carbon-icons-svelte/lib/Export.svelte";
    import Download from "carbon-icons-svelte/lib/Download.svelte";
    import Locked from "carbon-icons-svelte/lib/Locked.svelte";
    import IbmCloudHyperProtectCryptoServices from "carbon-icons-svelte/lib/IbmCloudHyperProtectCryptoServices.svelte";
    import UserAdmin from "carbon-icons-svelte/lib/UserAdmin.svelte";

</script>

<PortalToAppLeftSidebar>
    <aside class="page-sidebar settings-sidebar">
        <div class="sidebar-content">
            <div class="sidebar-title">{$_("pageSettings.sidebar.system")}</div>
            <a href="/settings" class="sidebar-list-item" use:active={{ path: "/settings" }} use:link>
                <Home width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.application")}</span>
            </a>
            <a
                href="/settings/mail"
                class="sidebar-list-item"
                use:active={{ path: "/settings/mail/?.*" }}
                use:link
            >
                <Email width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.mail")}</span>
            </a>
            <a
                href="/settings/storage"
                class="sidebar-list-item"
                use:active={{ path: "/settings/storage/?.*" }}
                use:link
            >
                <BlockStorageAlt width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.files")}</span>
            </a>

            <div class="sidebar-title">
                <span class="txt">{$_("pageSettings.sidebar.sync")}</span>
            </div>
            <a
                href="/settings/export-collections"
                class="sidebar-list-item"
                use:active={{ path: "/settings/export-collections/?.*" }}
                use:link
            >
                <Export width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.export")}</span>
            </a>
            <a
                href="/settings/import-collections"
                class="sidebar-list-item"
                use:active={{ path: "/settings/import-collections/?.*" }}
                use:link
            >
                <Download width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.import")}</span>
            </a>

            <div class="sidebar-title">{$_("pageSettings.sidebar.authentication")}</div>
            <a
                href="/settings/auth-providers"
                class="sidebar-list-item"
                use:active={{ path: "/settings/auth-providers/?.*" }}
                use:link
            >
                <Locked width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.providers")}</span>
            </a>
            <a
                href="/settings/tokens"
                class="sidebar-list-item"
                use:active={{ path: "/settings/tokens/?.*" }}
                use:link
            >
                <IbmCloudHyperProtectCryptoServices width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.tokens")}</span>
            </a>
            <a
                href="/settings/admins"
                class="sidebar-list-item"
                use:active={{ path: "/settings/admins/?.*" }}
                use:link
            >
                <UserAdmin width="20px" height="20px" />
                <span class="txt">{$_("pageSettings.sidebar.admins")}</span>
            </a>
        </div>
    </aside>
</PortalToAppLeftSidebar>
