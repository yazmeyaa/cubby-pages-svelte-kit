import DataBase from "carbon-icons-svelte/lib/DataBase.svelte";
import Cube from "carbon-icons-svelte/lib/Cube.svelte";
import Grid from "carbon-icons-svelte/lib/Grid.svelte";
import ListBulleted from "carbon-icons-svelte/lib/ListBulleted.svelte";
import DataTable from "carbon-icons-svelte/lib/DataTable.svelte";
import ChartHistogram from "carbon-icons-svelte/lib/ChartHistogram.svelte";
import Settings from "carbon-icons-svelte/lib/Settings.svelte";
import CarbonForIbmDotcom from "carbon-icons-svelte/lib/CarbonForIbmDotcom.svelte";
import DataVis_3 from "carbon-icons-svelte/lib/DataVis_3.svelte";
import App from "carbon-icons-svelte/lib/App.svelte";

export const links = [
    {
        text: "App",
        linkTo: "app",
        icon: App,
    },
    // {
    //    text: "Architector",
    //    linkTo: "repl",
    //    icon: CarbonForIbmDotcom,
    // },
    {
        // text: $_("navigation.collections"),
        text: "Collections",
        linkTo: "collections",
        icon: DataBase,
    },
    // {
    //     text: $_("navigation.cubes"),
    //     linkTo: "cubes",
    //     icon: Cube,
    // },
    // {
    //     text: "Query Grid",
    //     linkTo: "querygrid",
    //     icon: Grid,
    // },
    // {
    //     text: $_("navigation.hierarchyes"),
    //     linkTo: "hierarchy",
    //     icon: ListBulleted,
    // },
    {
        // text: $_("navigation.spreadsheets"),
        text: "Sheets",
        linkTo: "spreadsheets",
        icon: DataTable,
    },
    // {
    //     text: "Flow",
    //     linkTo: "control-flow",
    //     icon: DataVis_3,
    // },
    // {
    //     text: $_("navigation.dynatables"),
    //     linkTo: "dynatable",
    //     icon: DataFormat,
    // },
    {
        // text: $_("navigation.logs"),
        text: "Logs",
        linkTo: "logs",
        icon: ChartHistogram,
    },
    {
        text: "Settings",
        linkTo: "settings",
        icon: Settings,
    },
];