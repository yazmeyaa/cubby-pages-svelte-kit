<script>
    import { Grid, Row, Column, Popover, Button } from "carbon-components-svelte";
    import ColorPalette from "carbon-icons-svelte/lib/ColorPalette.svelte";
    import { createEventDispatcher } from "svelte";
    import { palette } from "./palette";

    let open = false;
    let ref = null;

    const dispatch = createEventDispatcher();

    function handleColorClick(paletteKind) {
        dispatch("colorchoose", paletteKind);
        open = false;
    }
</script>

<div style="position: relative;" bind:this={ref}>
    <Button
        on:click={() => {
            open = !open;
        }}
        icon={ColorPalette}
        kind="ghost"
        iconDescription="Cell color"
    />
    <Popover
        bind:open
        align="bottom-left"
        on:click:outside={({ detail }) => {
            open = ref.contains(detail.target);
        }}
    >
        <div class="colors_grid">
            {#each palette as paletteRow}
                {#each paletteRow as paletteKind}
                    {@const background = paletteKind.background}
                    {@const color = paletteKind.color}
                    <button
                        style={`background-color: ${background};color: ${color}`}
                        class="baseButton"
                        on:click={() => handleColorClick(paletteKind)}>A</button
                    >
                {/each}
            {/each}
        </div>
    </Popover>
</div>

<style>
    .colors_grid {
        display: grid;
        padding: 16px;
        grid-template-columns: repeat(6, 1fr);
        gap: 12px;
    }

    .baseButton {
        cursor: pointer;
        aspect-ratio: 1/1;
        margin: 8px auto;
        font-size: 18px;
        width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        outline: 3px dotted rgba(255, 0, 0, 0);
        transition: all 0.3s ease-in-out;
    }
    .baseButton:hover {
        outline: 3px dotted rgba(255, 0, 0, 1);
    }
</style>
