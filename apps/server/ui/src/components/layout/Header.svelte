<script>
    import {
        Header,
        HeaderNav,
        HeaderNavMenu,
        HeaderNavItem,
        HeaderPanelDivider,
        HeaderUtilities,
        HeaderGlobalAction,
    } from "carbon-components-svelte";
    import Logout from "carbon-icons-svelte/lib/Logout.svelte";
    import { createEventDispatcher } from "svelte";
    import ApiClient from '@/utils/ApiClient'

    const dispatch = createEventDispatcher();

    /**
     * @param {"white" | "g10" | "g80" | "g90" | "g100"} theme - white, g10, g80, g90, g100
     */
    function handleChangeTheme(theme) {
        dispatch("changeTheme", { theme });
    }

    export let isInFrame;
</script>

<Header persistentHamburgerMenu={false}>
    <div slot="platform" class="app-header">
        <img
            class="header_logo"
            src="{import.meta.env.BASE_URL}images/logo.svg"
            width="45"
            height="45"
            alt="logo"
        />
        <div><strong>CUBBY II &nbsp;</strong><small>data platform</small></div>
    </div>

    <HeaderNav>
        {#if !isInFrame}
            <HeaderNavMenu text="Рабочие области">
                <HeaderNavItem href="/" text="default" />
            </HeaderNavMenu>
        {/if}

        <HeaderNavMenu text="Интерфейс">
            <HeaderNavItem
                text="Светлый: белый"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("white");
                    // theme = "white";
                }}
            />
            <HeaderNavItem
                text="Светлый: серый"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("g10");
                    // theme = "g10";
                }}
            />
            <HeaderNavItem
                text="Тёмный: серый"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("g80");
                    // theme = "g80";
                }}
            />
            <HeaderNavItem
                text="Тёмный: тёмно-серый"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("g90");
                    // theme = "g90";
                }}
            />
            <HeaderNavItem
                text="Тёмный: чёрный"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("g100");
                    // theme = "g100";
                }}
            />
            <HeaderPanelDivider />
            <HeaderNavItem
                text="Тёмный: чёрный"
                on:click={(e) => {
                    e.preventDefault();
                    handleChangeTheme("g100");
                    // theme = "g100";
                }}
            />
        </HeaderNavMenu>
    </HeaderNav>
    {#if !isInFrame}
        <HeaderUtilities>
            <HeaderGlobalAction
                aria-label="Выйти"
                icon={Logout}
                on:click={() => {
                    // localStorage.removeItem("cubberAuth");
                    ApiClient.logout()

                    setTimeout(() => {
                        document.location.reload();
                    }, 1000);
                    // goto('/', {
                    //     replaceState: true
                    // })
                }}
            />
        </HeaderUtilities>
    {/if}
</Header>
