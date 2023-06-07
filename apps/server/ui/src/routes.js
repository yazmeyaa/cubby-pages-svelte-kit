import { replace } from "svelte-spa-router";
import { wrap } from "svelte-spa-router/wrap";
import ApiClient from "@/utils/ApiClient";
import PageIndex from "@/components/PageIndex.svelte";
import PageLogs from "@/components/logs/PageLogs.svelte";
import PageRecords from "@/components/records/PageRecords.svelte";
import PageTables from "@/components/tables/PageTables.svelte";
import PageAdmins from "@/components/admins/PageAdmins.svelte";
import PageAdminLogin from "@/components/admins/PageAdminLogin.svelte";
import PageApplication from "@/components/settings/PageApplication.svelte";
import PageMail from "@/components/settings/PageMail.svelte";
import PageStorage from "@/components/settings/PageStorage.svelte";
import PageAuthProviders from "@/components/settings/PageAuthProviders.svelte";
import PageTokenOptions from "@/components/settings/PageTokenOptions.svelte";
import PageExportCollections from "@/components/settings/PageExportCollections.svelte";
import PageImportCollections from "@/components/settings/PageImportCollections.svelte";
import PageHierarchy from "@/components/hierarchy/PageHierarchy.svelte";
// import PageQueryGrid         from '@/components/querygrid/PageQueryGrid.svelte'
// import PageCubes             from '@/components/cubes/PageCubes.svelte'
import CubeIndex from "@/components/cubes/CubeIndex.svelte";
import PageSpreadsheets from "@/components/spreadsheets/PageSpreadsheets.svelte";
import PagePivot from "@/components/pivot/PagePivot.svelte";
import PageOLAP from "@/components/olaps/CubeOLAPIndex.svelte";

const baseConditions = [
    async (details) => {
        const realQueryParams = new URLSearchParams(window.location.search);

        if (details.location !== "/" && realQueryParams.has(import.meta.env.PB_INSTALLER_PARAM)) {
            return replace("/");
        }

        return true;
    },
];

const routes = {
    "/login": wrap({
        component: PageAdminLogin,
        conditions: baseConditions.concat([(_) => !ApiClient.authStore.isValid]),
        userData: { showAppSidebar: false },
    }),

    "/request-password-reset": wrap({
        asyncComponent: () => import("@/components/admins/PageAdminRequestPasswordReset.svelte"),
        conditions: baseConditions.concat([(_) => !ApiClient.authStore.isValid]),
        userData: { showAppSidebar: false },
    }),

    "/confirm-password-reset/:token": wrap({
        asyncComponent: () => import("@/components/admins/PageAdminConfirmPasswordReset.svelte"),
        conditions: baseConditions.concat([(_) => !ApiClient.authStore.isValid]),
        userData: { showAppSidebar: false },
    }),

    "/collections": wrap({
        component: PageRecords,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),
    "/spreadsheets": wrap({
        component: PageSpreadsheets,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/hierarchy": wrap({
        component: PageHierarchy,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/querygrid": wrap({
        component: CubeIndex,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),
    "/pivot": wrap({
        component: PagePivot,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/logs": wrap({
        component: PageLogs,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings": wrap({
        component: PageApplication,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/admins": wrap({
        component: PageAdmins,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/mail": wrap({
        component: PageMail,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/storage": wrap({
        component: PageStorage,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/auth-providers": wrap({
        component: PageAuthProviders,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/tokens": wrap({
        component: PageTokenOptions,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/export-collections": wrap({
        component: PageExportCollections,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/settings/import-collections": wrap({
        component: PageImportCollections,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    "/olap/": wrap({
        component: PageOLAP,
        conditions: baseConditions.concat([(_) => ApiClient.authStore.isValid]),
        userData: { showAppSidebar: true },
    }),

    // ---------------------------------------------------------------
    // Records email confirmation actions
    // ---------------------------------------------------------------

    // @deprecated
    "/users/confirm-password-reset/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmPasswordReset.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),
    "/auth/confirm-password-reset/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmPasswordReset.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),

    // @deprecated
    "/users/confirm-verification/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmVerification.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),
    "/auth/confirm-verification/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmVerification.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),

    // @deprecated
    "/users/confirm-email-change/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmEmailChange.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),
    "/auth/confirm-email-change/:token": wrap({
        asyncComponent: () => import("@/components/records/PageRecordConfirmEmailChange.svelte"),
        conditions: baseConditions,
        userData: { showAppSidebar: false },
    }),

    // catch-all fallback
    "*": wrap({
        component: PageIndex,
        userData: { showAppSidebar: false },
    }),
};

export default routes;
