<script>
    import { SchemaField } from "pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import Field from "$lib/components/base/Field.svelte";
    import { TextArea, TextInput } from "carbon-components-svelte";

    export let field = new SchemaField();
    export let value = undefined;

    let serialized = JSON.stringify(typeof value === "undefined" ? null : value, null, 2);

    $: if (value !== serialized?.trim()) {
        serialized = JSON.stringify(typeof value === "undefined" ? null : value, null, 2);
        value = serialized;
    }
</script>

<Field  name={field.name} let:uniqueId>
    <!-- <label for={uniqueId}>
        <i class={CommonHelper.getFieldTypeIcon(field.type)} />
        <span class="txt">{field.name}</span>
    </label>
    <textarea
        id={uniqueId}
        class="txt-mono"
        required={field.required}
        value={serialized}
        on:input={(e) => {
            serialized = e.target.value;
            value = e.target.value.trim(); // trim the submitted value
        }}
    /> -->

    <TextArea 
    id={uniqueId}
        class="txt-mono"
        required={field.required}
        value={serialized}
        on:input={(e) => {
            serialized = e.target.value;
            value = e.target.value.trim(); // trim the submitted value
        }}
        style="margin-bottom: 2rem;"
    >
    <svelte:fragment slot="labelText">
        <i class={CommonHelper.getFieldTypeIcon(field.type)} />
        <span class="txt">{field.name}</span>
    </svelte:fragment>
    </TextArea>
</Field>
