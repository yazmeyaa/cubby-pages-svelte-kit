<script lang="ts">
  import { pageTitle, appName, hideControls } from '$lib/stores/app'
  import CommonHelper from '$lib/utils/CommonHelper'
  import {
    SideNav,
    SideNavItems,
    Content,
    Theme,
  } from 'carbon-components-svelte'
  import { links } from './links'
  import Header from '$lib/components/layout/Header.svelte'
  import NavLink from '$lib/components/layout/NavLink.svelte'
  import Toasts from '$lib/components/base/Toasts.svelte'

  let theme: CarbonTheme = 'white'
  let showAppSidebar = true
  let isSideNavOpen = false
  let isInFrame = false
  let initPromise = false

  function handleLinkClick() {
    isSideNavOpen = false
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
      {#each links as link}
        <NavLink
          on:linkClicked={handleLinkClick}
          icon={link.icon}
          linkTo={link.linkTo}
          text={link.text}
        />
      {/each}
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
