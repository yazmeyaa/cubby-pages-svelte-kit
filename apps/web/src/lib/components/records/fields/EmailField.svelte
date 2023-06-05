<script>
    import { SchemaField } from "pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import Field from "$lib/components/base/Field.svelte";
    import { TextInput } from "carbon-components-svelte";

    export let field = new SchemaField();
    export let value = undefined;
</script>

<Field  name={field.name} let:uniqueId>
    <!-- <label for={uniqueId}>
        <i class={CommonHelper.getFieldTypeIcon(field.type)} />
        <span class="txt">{field.name}</span>
    </label>
    <input type="email" id={uniqueId} required={field.required} bind:value /> -->
    <TextInput id={uniqueId} required={field.required} bind:value style="margin-bottom: 2rem;">
        <svelte:fragment slot="labelText">
            <i class={CommonHelper.getFieldTypeIcon(field.type)} />
            <span class="txt">{field.name}</span>
        </svelte:fragment>
    </TextInput>
</Field>
