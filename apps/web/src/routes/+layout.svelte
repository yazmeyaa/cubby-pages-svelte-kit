<script lang="ts">
  import '$lib/scss/main.scss'
  import 'carbon-components-svelte/css/all.css'
  import '$lib/i18n'
  import { pageTitle, appName, hideControls } from '$lib/stores/app'
  import { browser } from '$app/environment'
  import CommonHelper from '$lib/utils/CommonHelper'
  import { pb } from '$lib/pocketbase'
  import {
    SideNav,
    SideNavItems,
    Content,
    Theme,
  } from 'carbon-components-svelte'
  import Links from './Links.svelte'
  import Header from '$lib/components/layout/Header.svelte'
  import NavLink from '$lib/components/layout/NavLink.svelte'
  import Toasts from '$lib/components/base/Toasts.svelte'
  import { onMount } from 'svelte'
  import {user} from '$lib/stores/user'

  import type { PageData } from './$types'

  export let data: PageData

  let theme: CarbonTheme = 'white'
  let showAppSidebar = true
  let isSideNavOpen = false
  let isInFrame = false
  let initPromise = false

  function handleLinkClick() {
    isSideNavOpen = false
  }

  function handleChangeTheme(event: CustomEvent<{ theme: CarbonTheme }>) {
    theme = event.detail.theme
  }

  $: console.log($user)

  $: showAppSidebar = true

  onMount(() => {
    if(!data.auth) goto('/login')
  })

  import '$lib/scss/main.scss'
  import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte'
  import { goto } from '$app/navigation'
</script>

<svelte:head>
  <title
    >{CommonHelper.joinNonEmpty([$pageTitle, $appName, 'Cubby'], ' - ')}</title
  >
</svelte:head>

<Theme bind:theme persist persistKey="__carbon-theme" />

{#if showAppSidebar}
  <SideNav bind:isOpen={isSideNavOpen} rail expansionBreakpoint={4096}>
    <SideNavItems>
      <Links let:links>
        {#each links as link}
          <NavLink
            on:linkClicked={handleLinkClick}
            icon={link.icon}
            linkTo={link.linkTo}
            text={link.text}
          />
        {/each}
      </Links>
    </SideNavItems>
  </SideNav>
{/if}

<Content style="padding: 0px; height:100%">
  <div class="container">
    {#if !isInFrame}
      <div id="left_app_sidebar" />
    {/if}
    {#await initPromise then value}
      <Toasts />
      <slot />
    {/await}
  </div>
</Content>

{#if showAppSidebar}
  <Header
    on:changeTheme={handleChangeTheme}
    {isInFrame}
    bind:isSideNavOpen
    currentTheme={theme}
  />
{/if}

<style>
  @import 'carbon-components-svelte/css/all.css';

  .container {
    display: flex;
    height: 100%;
    overflow: hidden;
    max-height: 100%;
    overflow: hidden;
    /* max-height: 90vh; */
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
    /* height: 90vh; */
    /* width: calc(300px); */
    overflow: hidden;
    /* height: 100%; */
  }

  /* #main_content {
        /* padding-left: 0px !important;
        margin-bottom: 0;
        overflow: hidden; 
    }

    .main {
        grid-area: main;
        overflow: scroll;
    }
    .main.main-full {
        grid-column-start: left;
        grid-column-end: main;
    } */
</style>
