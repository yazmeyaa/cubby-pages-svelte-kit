<script>
    import { tick } from "svelte";
    import OverlayPanel from "$lib/components/base/OverlayPanel.svelte";
    import { confirmation, resetConfirmation } from "$lib/stores/confirmation";

    import { _ } from "svelte-i18n";
    import { Button } from "carbon-components-svelte";

    let confirmationPopup;
    let isConfirmationBusy = false;
    let confirmed = false;

    $: if ($confirmation?.text) {
        confirmed = false;
        confirmationPopup?.show();
    }
</script>

<OverlayPanel
    bind:this={confirmationPopup}
    class="confirm-popup hide-content overlay-panel-sm"
    overlayClose={!isConfirmationBusy}
    escClose={!isConfirmationBusy}
    btnClose={false}
    popup
    on:hide={async () => {
        if (!confirmed && $confirmation?.noCallback) {
            $confirmation.noCallback();
        }
        await tick();
        confirmed = false;
        resetConfirmation();
    }}
>
    <h4 class="block center txt-break" slot="header">{$confirmation?.text}</h4>

    <svelte:fragment slot="footer">
        <Button
            size="field"
            kind="secondary"
            autofocus
            disabled={isConfirmationBusy}
            on:click={() => {
                confirmed = false;
                confirmationPopup?.hide();
            }}
        >
            {$_("no")}
        </Button>
        <!-- svelte-ignore a11y-autofocus -->
        <!-- <button
            autofocus
            type="button"
            class="pb-btn pb-btn-transparent btn-expanded-sm"
            disabled={isConfirmationBusy}
            on:click={() => {
                confirmed = false;
                confirmationPopup?.hide();
            }}
        >
            <span class="txt">{$_("no")}</span>
        </button> -->
        <!-- <button
            type="button"
            class="pb-btn btn-danger btn-expanded"
            class:btn-loading={isConfirmationBusy}
            disabled={isConfirmationBusy}
            on:click={async () => {
                if ($confirmation?.yesCallback) {
                    isConfirmationBusy = true;
                    await Promise.resolve($confirmation.yesCallback());
                    isConfirmationBusy = false;
                }
                confirmed = true;
                confirmationPopup?.hide();
            }}
        >
            <span class="txt">{$_("yes")}</span>
        </button> -->
        <Button
            size="field"
            kind="primary"
            disabled={isConfirmationBusy}
            on:click={async () => {
                if ($confirmation?.yesCallback) {
                    isConfirmationBusy = true;
                    await Promise.resolve($confirmation.yesCallback());
                    isConfirmationBusy = false;
                }
                confirmed = true;
                confirmationPopup?.hide();
            }}
        >
            {$_("yes")}
        </Button>
    </svelte:fragment>
</OverlayPanel>
