<script lang="ts">
  import '$lib/scss/main.scss'
  import "carbon-components-svelte/css/all.css";
  import "$lib/i18n"
  import { pageTitle, appName, hideControls } from '$lib/stores/app'
  import {browser} from '$app/environment'
  import CommonHelper from '$lib/utils/CommonHelper'
  import {pb} from '$lib/pocketbase'
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
  import {onMount} from 'svelte'


  onMount(() => {
    console.log(pb)
  })

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


  import '$lib/scss/main.scss'
  import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte'
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
      <Links let:links={links}>

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
</style>
