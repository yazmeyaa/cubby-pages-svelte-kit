<script>
    import { SchemaField } from "pocketbase";
    import Field from "$lib/components/base/Field.svelte";
    import { Toggle } from "carbon-components-svelte";

    export let field = new SchemaField();
    export let value = false;
</script>

<Field name={field.name} let:uniqueId>

    <Toggle 
        bind:toggled={value}
        id={uniqueId}
        labelA={field.name}
        labelB={field.name}
        style="margin-bottom: 2rem;"
    />

    <!-- <input type="checkbox" id={uniqueId} bind:checked={value} />
    <label for={uniqueId}>{field.name}</label> -->
</Field>
