<script lang="ts">
    import Portal from "svelte-portal";
</script>

<Portal target="#left_app_sidebar" >
    <div class="left" class:hidden={!$$slots.default}>
        <slot />
    </div>
</Portal>

<style>

    .left {
        height: 100%;
        /* border-right: 1px solid var(--cds-text-03); */  
        /* margin-left: 48px; */
        flex-shrink: 0;
        width: calc(300px - 3rem);
        /* grid-area: left; */
        /* background: var(--cds-ui-01, #ffffff); */
        /* overflow: scroll; */
    }
    .hidden {
        display: hidden;
    }
</style>