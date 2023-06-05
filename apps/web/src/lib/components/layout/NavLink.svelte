<script lang="ts">
    import { SideNavLink } from "carbon-components-svelte";
    // import { replace, location } from "svelte-spa-router";
    import { createEventDispatcher } from "svelte";
    import { goto } from "$app/navigation"
    import {  } from '@sveltejs/kit'


    export let text: string;
    export let linkTo: string;
    export let icon: typeof import("svelte").SvelteComponent;

    const dispatch = createEventDispatcher();

    function handleLinkClick(event: MouseEvent) {
        event.preventDefault();
        dispatch("linkClicked");
        goto(`/${linkTo}`);
    }
</script>

<SideNavLink
    {text}
    href={`/#/${linkTo}`}
    isSelected={false}
    on:click={handleLinkClick}
    {icon}
/>
