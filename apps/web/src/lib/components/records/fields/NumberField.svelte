<script>
    import { SchemaField } from "pocketbase";
    import CommonHelper from "$lib/utils/CommonHelper";
    import Field from "$lib/components/base/Field.svelte";
    import { NumberInput } from "carbon-components-svelte";

    export let field = new SchemaField();
    export let value = undefined;
</script>

<Field name={field.name} let:uniqueId>
    <NumberInput
        allowEmpty
        hideSteppers
        id={uniqueId}
        required={field.required}
        min={field.options?.min}
        max={field.options?.max}
        step="any"
        bind:value
        style="margin-bottom: 2rem;"
    >
        <svelte:fragment slot="label">
            <i class={CommonHelper.getFieldTypeIcon(field.type)} />
            <span class="txt">{field.name}</span>
        </svelte:fragment>
    </NumberInput>
    <!-- <label for={uniqueId}>
        <i class={CommonHelper.getFieldTypeIcon(field.type)} />
        <span class="txt">{field.name}</span>
    </label>
    <input
        type="number"
        id={uniqueId}
        required={field.required}
        min={field.options?.min}
        max={field.options?.max}
        step="any"
        bind:value
    /> -->
</Field>
