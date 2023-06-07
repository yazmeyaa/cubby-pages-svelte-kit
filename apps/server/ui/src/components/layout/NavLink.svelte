<script>
    import { SideNavLink } from "carbon-components-svelte";
    import { replace, location } from "svelte-spa-router";
    export let text;
    export let linkTo;
    // export let remixIconClassName;
    export let icon;
</script>

<SideNavLink
    {text}
    href={`/#/${linkTo}`}
    isSelected={$location === `/${linkTo}`}
    on:click={(e) => {
        e.preventDefault();
        replace(`/${linkTo}`);
    }}
    {icon}
/>
