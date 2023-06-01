<script lang="ts">
    import type Drawflow from "drawflow";
    import type { DrawflowNode } from "drawflow";
    import type { requestData } from "$lib/models/nodes/request";
    import NodeSave from "../ui/NodeSave.svelte";
    import { Checkbox, TextArea, TextInput } from "carbon-components-svelte";

    export let node: DrawflowNode;
    export let editor: Drawflow;

    let data: requestData;
    const getData = (nodeV: DrawflowNode) => {
        data = nodeV.data as requestData;
    };

    $: getData(node);

    const submit = (e: Event) => {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const v = Object.assign({}, data);

        v.url = formData.get("url") as string;
        v.method = formData.get("method") as string;
        v.auth = formData.get("auth") as string;
        v.payload_nil = formData.get("payload_nil") != null;
        v.skip_verify = formData.get("skip_verify") != null;
        v.pool_client = formData.get("pool_client") != null;
        v.headers = formData.get("headers") as string;
        v.retry_codes = formData.get("retry_codes") as string;
        v.retry_decodes = formData.get("retry_decodes") as string;
        v.tags = formData.get("tags") as string;

        editor.updateNodeDataFromId(node.id, v);
    };

    const reset = () => {
        data = editor.getNodeFromId(node.id).data;
    };
</script>

<form on:submit|preventDefault={submit} on:reset|preventDefault={reset}>
    <p class="title-node">Request - {node.id}</p>
    <!-- <p>Info for UI</p> -->
    <TextInput labelText="Info for UI" type="text" placeholder="info" name="info" bind:value={data.info} />
    <!-- <p>Enter request url</p> -->
    <TextInput
        labelText="Enter request url"
        type="url"
        placeholder="https://createmyissue.com"
        name="url"
        bind:value={data.url}
    />
    <!-- <p>Enter method</p> -->
    <TextInput
        labelText="Enter method"
        type="text"
        placeholder="POST"
        name="method"
        bind:value={data.method}
    />
    <!-- <p>Enter method</p> -->
    <TextInput labelText="Enter method" type="text" placeholder="myauth" name="auth" bind:value={data.auth} />
    <!-- <label>
        <span>Payload set to nil</span>
        <input type="checkbox" name="payload_nil" data-action="checkbox" bind:checked={data.payload_nil} />
    </label> -->
    <Checkbox labelText="Payload set to nil" name="payload_nil" bind:checked={data.payload_nil} />
    <!-- <label>
        <span>Skip verify certificate</span>
        <input type="checkbox" name="skip_verify" data-action="checkbox" bind:checked={data.skip_verify} />
    </label> -->
    <Checkbox labelText="Skip verify certificate" name="skip_verify" bind:checked={data.skip_verify} />
    <!-- <label>
        <span>Use pooled client</span>
        <input type="checkbox" name="pool_client" data-action="checkbox" bind:checked={data.pool_client} />
    </label> -->
    <Checkbox labelText="Use pooled client" name="pool_client" bind:checked={data.pool_client} />
    <!-- <details>
        <summary>Enter additional headers</summary>
        <textarea placeholder="json/yaml key:value" bind:value={data.headers} />
    </details> -->
    <details>
        <summary>Enter additional headers</summary>
        <TextArea
            labelText="Enter additional headers"
            placeholder="json/yaml key:value"
            bind:value={data.headers}
        />
    </details>
    <details>
        <summary>Retry with status codes</summary>
        <!-- <p>Enabled Status Codes</p> -->
        <TextInput
            labelText="Enabled Status Codes"
            type="text"
            placeholder="Ex: 401, 403"
            name="retry_codes"
            bind:value={data.retry_codes}
        />
        <!-- <p>Disabled Status Codes</p> -->
        <TextInput
            labelText="Disabled Status Codes"
            type="text"
            placeholder="Ex: 500"
            name="retry_decodes"
            bind:value={data.retry_decodes}
        />
    </details>
    <!-- <p>Enter tags</p> -->
    <TextInput labelText="Enter tags" type="text" placeholder="tags" name="tags" bind:value={data.tags} />
    <NodeSave />
</form>
