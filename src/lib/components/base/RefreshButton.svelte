<script>
    import { createEventDispatcher, onMount } from "svelte";
    import tooltip from "$lib/actions/tooltip";

    import {_} from 'svelte-i18n'

    const dispatch = createEventDispatcher();

    let tooltipData = { text: $_("refreshButton"), position: "right" };
    export { tooltipData as tooltip };

    let refreshTimeoutId = null;

    function refresh() {
        dispatch("refresh");

        // clear tooltip
        const oldTooltipData = tooltipData;
        tooltipData = null;

        clearTimeout(refreshTimeoutId);
        refreshTimeoutId = setTimeout(() => {
            refreshTimeoutId = null;
            tooltipData = oldTooltipData;
        }, 150);
    }

    onMount(() => {
        return () => clearTimeout(refreshTimeoutId);
    });
</script>

<button
    type="button"
    aria-label="Refresh"
    class="pb-btn pb-btn-transparent pb-btn-circle"
    class:refreshing={refreshTimeoutId}
    use:tooltip={tooltipData}
    on:click={refresh}
>
    <i class="ri-refresh-line" />
</button>

<style>
    @keyframes refresh {
        100% {
            transform: rotate(180deg);
        }
    }
    pb-btn.refreshing i {
        animation: refresh 150ms ease-out;
    }
</style>
