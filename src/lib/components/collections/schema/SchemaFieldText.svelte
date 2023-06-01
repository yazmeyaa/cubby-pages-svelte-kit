<script>
    import SchemaField from "$lib/components/collections/schema/SchemaField.svelte";
    import Field from "$lib/components/base/Field.svelte";
    import { NumberInput, TextInput } from "carbon-components-svelte";

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
            <div class="col-sm-3">
                <Field name="schema.{key}.options.min" let:uniqueId>
                    <NumberInput
                        allowEmpty
                        id={uniqueId}
                        default="0"
                        step="1"
                        min="0"
                        bind:value={field.options.min}
                        hideSteppers
                        label="Min length"
                    />
                    <!-- <label for={uniqueId}>Min length</label>
                    <input type="number" id={uniqueId} step="1" min="0" bind:value={field.options.min} /> -->
                </Field>
            </div>

            <div class="col-sm-3">
                <Field name="schema.{key}.options.max" let:uniqueId>
                    <NumberInput
                        allowEmpty
                        hideSteppers
                        label="Max length"
                        id={uniqueId}
                        step="1"
                        min={field.options.min || 0}
                        bind:value={field.options.max}
                    />
                    <!-- <label for={uniqueId}>Max length</label>
                    <input
                        type="number"
                        id={uniqueId}
                        step="1"
                        min={field.options.min || 0}
                        bind:value={field.options.max}
                    /> -->
                </Field>
            </div>

            <div class="col-sm-6">
                <Field name="schema.{key}.options.pattern" let:uniqueId>
                    <TextInput
                        labelText="Regex pattern"
                        id={uniqueId}
                        placeholder={"Valid Go regular expression, eg. ^w+$"}
                        bind:value={field.options.pattern}
                    />
                    <!-- <label for={uniqueId}>Regex pattern</label>
                    <input
                        type="text"
                        id={uniqueId}
                        placeholder={"Valid Go regular expression, eg. ^w+$"}
                        bind:value={field.options.pattern}
                    /> -->
                </Field>
            </div>
        </div>
    </svelte:fragment>
</SchemaField>
