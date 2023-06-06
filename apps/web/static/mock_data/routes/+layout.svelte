<script lang="ts" context="module">

  import {
      //   afterNavigate,
      //   beforeNavigate,
      //   disableScrollHandling,
      goto,
      //   invalidate,
      //   invalidateAll,
      //   prefetch,
      //   prefetchRoutes
  } from '$app/navigation';


  
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SkipToContent,
    HeaderPanelDivider,
    Content,
    Theme,
    Grid,
    Row,
    Column,
    HeaderUtilities,
    HeaderGlobalAction,
  } from "carbon-components-svelte";

  import Auth from "../lib/svxcomponents/Auth.svelte";

  import Logout from "carbon-icons-svelte/lib/Logout.svelte";
  import { browser } from "$app/environment"
  import { TreeView } from "carbon-components-svelte";



  let isSideNavOpen = true;
  let isAuth = false;
  let isInFrame = false;


    
    async function initConnectionWithAuth() {
        if (browser) {
            isAuth = localStorage.getItem("cubberAuth") ? true : false;
            authCreds = JSON.parse(localStorage.getItem("cubberAuth") || "{}");
            
            return true
        }
  }
  
  let initPromise = initConnectionWithAuth();



</script>

<script lang="ts">
    export let menu = [];
    
    
    import {onMount} from 'svelte';
  

    import { Breadcrumb, BreadcrumbItem, SkeletonText } from "carbon-components-svelte";
    import { LocalStorage, Toggle } from "carbon-components-svelte";

    import { navigating } from '$app/stores';
    import { page } from "$app/stores";
    import { writable,  } from 'svelte/store';

    let active_folders = writable([]);
    let mmenu = writable([]);
    let theme = "g10";
  

    // onMount(() => {
    //   let filterRequired = localStorage.get("fuck");

    //   let cc = menu.map((eee) => (
    //         {
    //           ...eee,
    //           children: eee.children.filter((e) => (filterRequired !== null && e.id.endsWith(`${filterRequired}/`))
    //           }),
    //       )
            
    //       // menu.set(menu);
    //       console.log(cc);
          
    //       });
      

    //     mmenu.set(menu)
      
    //     console.log(cc);
    //       })

    mmenu.set(menu);

    $: currentSection = "/" + $page.url.pathname.split('/')[1];
    // $: document.documentElement.setAttribute("active_folders", $active_folders );
</script>


<Theme bind:theme persist persistKey="__carbon-theme" />

<div class="container">
  
<div class="left">
     {#if isAuth}
         {#await initPromise then value}
        <TreeView
            bind:expandedIds={$active_folders}
            on:select={(e) => {
                // console.log(e.detail);
                if (e.detail.leaf) {
                    goto(e.detail.id);
                } else {
                  // console.log($active_folders);
                  if ($active_folders.includes(e.id)) {
                    active_folders.update(v => v.filter(ee => ee ===  e.detail.id));
                  } else {
                    active_folders.update(v => [...v, e.detail.id]);
                  }
                }
            }}
            bind:children={$mmenu}
        />
        {/await}
     
      {/if}
  </div>
  <div class={"main": "main main-full"}>
  
  <Content>
    {#await initPromise then value}
      {#if !isAuth}
        <h1>Добро пожаловать!</h1>
        <br />
        <p>Для работы с документами необходими авторизоваться в Cubby IV</p>
        <Auth />
      {:else}
       <Grid fullWidth>
          {#if !isInFrame}<Row>
              <Column>
                <Breadcrumb noTrailingSlash>
                  <BreadcrumbItem>Начало</BreadcrumbItem>
                  {#each $page.url.pathname.split('/').slice(1) as sp }
                      <BreadcrumbItem>{decodeURI(sp)}</BreadcrumbItem>
                  {/each}
                </Breadcrumb>
                <br />
              </Column>
      </Row>{/if}
      </Grid>
      <Grid fullWidth>
          <Row>
              <Column>
              <slot />
              </Column>
        </Row>
        <Row style="opacity:0.2; margin-top:20px;">
          <Column>
              {#if $navigating}
                  <SkeletonText paragraph lines={8} />
              {:else}
                  загружено.
              {/if}
          </Column>
      </Row>
      </Grid>
      {/if}
    {/await}
  </Content>

  </div>
</div>


<style lang="scss">
  @import "carbon-components-svelte/css/all.css";
  .container {
    display: grid;
    width: 100vw;
    height: 100vh;
    
    grid-template-areas: "header header"
    "left main";
    grid-template-columns: 250px 4fr;
    grid-template-rows: 40px;
  }
  .container > div {
    /* border: 1px dashed #888; */
  }
  .header {
    grid-area: header;
  }
  .left {
    grid-area: left;
    background: var(--cds-ui-01, #ffffff);
    overflow: scroll;
  }

  .main {
    grid-area: main;
    overflow: scroll;
    
  }
  .main.main-full {
    grid-column-start : left;
    grid-column-end: main;
  }
  
  
</style>