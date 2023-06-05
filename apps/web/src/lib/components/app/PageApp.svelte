<script>
//    import PageWrapper from "$lib/components/base/PageWrapper.sv import { script } from "$lib/models/nodes/script";
import { admin as loggedAdmin } from "$lib/stores/admin";
</script>

{#if $loggedAdmin.id === 'ryf4opekrm5e9u8'}
<iframe
        src="http://localhost:5174"
        style="width: 100%; height: calc(100%); border: none;"
        title="App"
        sandbox="allow-forms
        allow-popups
        allow-same-origin
        allow-scripts
        allow-storage-access-by-user-activation
        allow-top-navigation-by-user-activation"
    />
{:else}
    <iframe
        src="http://localhost:5173"
        style="width: 100%; height: calc(100%); border: none;"
        title="App"
        sandbox="allow-forms
        allow-popups
        allow-same-origin
        allow-scripts
        allow-storage-access-by-user-activation
        allow-top-navigation-by-user-activation"
    />
{/if}
