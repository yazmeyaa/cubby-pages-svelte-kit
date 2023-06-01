<script>
    import Field from "$lib/components/base/Field.svelte";
    import SchemaField from "$lib/components/collections/schema/SchemaField.svelte";
    import { NumberInput } from "carbon-components-svelte";

    export let field;
    export let key = "";

</script>

<SchemaField
    bind:field
    {key}
    on:rename
    on:remove
    on:drop
    on:dragstart
    on:dragenter
    on:dragleave
    {...$$restProps}
>
    <svelte:fragment slot="options">
        <div class="grid grid-sm">
            <div class="col-sm-6">
                <Field name="schema.{key}.options.min" let:uniqueId>
                    <NumberInput
                        allowEmpty
                        hideSteppers
                        id={uniqueId}
                        bind:value={field.options.min}
                        label="Min"
                    />
                    <!-- <label for={uniqueId}>Min</label>
                    <input type="number" id={uniqueId} bind:value={field.options.min} /> -->
                </Field>
            </div>

            <div class="col-sm-6">
                <Field name="schema.{key}.options.max" let:uniqueId>
                    <NumberInput
                        hideSteppers
                        allowEmpty
                        label="Max"
                        id={uniqueId}
                        min={field.options.min}
                        bind:value={field.options.max}
                    />
                    <!-- <label for={uniqueId}>Max</label>
                    <input
                        type="number"
                        id={uniqueId}
                        min={field.options.min}
                        bind:value={field.options.max}
                    /> -->
                </Field>
            </div>
        </div>
    </svelte:fragment>
</SchemaField>
