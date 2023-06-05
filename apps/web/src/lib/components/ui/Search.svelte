<script lang="ts">
    import  ArrowRight from "carbon-icons-svelte/lib/ArrowRight.svelte";
    import Icon from "./Icon.svelte";
    import { Button, Search } from "carbon-components-svelte";

    export let search = "";
    export let searchFn: (_: string) => void;
</script>

<form on:submit|preventDefault={() => searchFn(search)} class="flex items-center" style="gap: 0px;">
    <Search bind:value={search} placeholder="Search..." />
    <!-- <input bind:value={search} placeholder="search" class="py-1 px-2 text-black" /> -->
    <Button icon={ArrowRight} type="submit" iconDescription="Search">
        
    </Button>
</form>
