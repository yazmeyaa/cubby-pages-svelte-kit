<script lang="ts">
  import DataBase from 'carbon-icons-svelte/lib/DataBase.svelte'
  import Cube from 'carbon-icons-svelte/lib/Cube.svelte'
  import Grid from 'carbon-icons-svelte/lib/Grid.svelte'
  import ListBulleted from 'carbon-icons-svelte/lib/ListBulleted.svelte'
  import DataTable from 'carbon-icons-svelte/lib/DataTable.svelte'
  import ChartHistogram from 'carbon-icons-svelte/lib/ChartHistogram.svelte'
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte'
  import CarbonForIbmDotcom from 'carbon-icons-svelte/lib/CarbonForIbmDotcom.svelte'
  import DataVis_3 from 'carbon-icons-svelte/lib/DataVis_3.svelte'
  import App from 'carbon-icons-svelte/lib/App.svelte'

  import { _ } from 'svelte-i18n'

  export const links = [
    {
      text: 'App',
      linkTo: 'app',
      icon: App,
    },
    {
      text: $_('navigation.collections'),
      linkTo: 'collections',
      icon: DataBase,
    },
    {
      text: $_('navigation.spreadsheets'),
      linkTo: 'spreadsheets',
      icon: DataTable,
    },
    {
      text: $_('navigation.logs'),
      linkTo: 'logs',
      icon: ChartHistogram,
    },
    {
      text: $_('navigation.settings'),
      linkTo: 'settings',
      icon: Settings,
    },
  ] as const

  // {
  //    text: "Architector",
  //    linkTo: "repl",
  //    icon: CarbonForIbmDotcom,
  // },
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
</script>

<slot links={links}>
    
</slot>