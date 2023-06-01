<script lang="ts">
    import { storeView, storeViewReload } from "$lib/store/store";
    import { Button } from "carbon-components-svelte";

    let endpoint = storeView.view;

    const submit = (e: Event) => {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const endpoint = formData.get("endpoint") as string;

        storeView.view = endpoint;
        storeViewReload.update((n) => !n);
    };

    const reset = () => {
        storeView.view = "";
        storeViewReload.update((n) => !n);
    };
</script>

<form on:submit|preventDefault={submit} on:reset|preventDefault={reset}>
    <p>View Endpoint</p>
    <input type="text" placeholder="endpoint" name="endpoint" bind:value={endpoint} />

    <div class="border-t border-black p-1 my-1 flex justify-between gap-1">
        <Button size="small" type="submit">View</Button>
        <Button size="small" type="reset" kind="secondary">Reset</Button>
    </div>
</form>
