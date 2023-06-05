<script>
    import { Collection, SchemaField } from "pocketbase";
    import { setErrors } from "$lib/stores/errors";
    import CommonHelper from "$lib/utils/CommonHelper";
    import IndexesList from "$lib/components/collections/IndexesList.svelte";
    import NewField from "$lib/components/collections/schema/NewField.svelte";
    import SchemaFieldText from "$lib/components/collections/schema/SchemaFieldText.svelte";
    import SchemaFieldNumber from "$lib/components/collections/schema/SchemaFieldNumber.svelte";
    import SchemaFieldBool from "$lib/components/collections/schema/SchemaFieldBool.svelte";
    import SchemaFieldEmail from "$lib/components/collections/schema/SchemaFieldEmail.svelte";
    import SchemaFieldUrl from "$lib/components/collections/schema/SchemaFieldUrl.svelte";
    import SchemaFieldEditor from "$lib/components/collections/schema/SchemaFieldEditor.svelte";
    import SchemaFieldDate from "$lib/components/collections/schema/SchemaFieldDate.svelte";
    import SchemaFieldSelect from "$lib/components/collections/schema/SchemaFieldSelect.svelte";
    import SchemaFieldJson from "$lib/components/collections/schema/SchemaFieldJson.svelte";
    import SchemaFieldFile from "$lib/components/collections/schema/SchemaFieldFile.svelte";
    import SchemaFieldRelation from "$lib/components/collections/schema/SchemaFieldRelation.svelte";

    import {_} from 'svelte-i18n'
    import { Tag } from "carbon-components-svelte";

    export let collection = new Collection();

    const fieldComponents = {
        text: SchemaFieldText,
        number: SchemaFieldNumber,
        bool: SchemaFieldBool,
        email: SchemaFieldEmail,
        url: SchemaFieldUrl,
        editor: SchemaFieldEditor,
        date: SchemaFieldDate,
        select: SchemaFieldSelect,
        json: SchemaFieldJson,
        file: SchemaFieldFile,
        relation: SchemaFieldRelation,
    };

    $: if (typeof collection.schema === "undefined") {
        collection = collection || new Collection();
        collection.schema = [];
    }

    $: nonDeletedFields = collection.schema.filter((f) => !f.toDelete) || [];

    function removeField(fieldIndex) {
        if (collection.schema[fieldIndex]) {
            collection.schema.splice(fieldIndex, 1);
            collection.schema = collection.schema;
        }
    }

    function newField(fieldType = "text") {
        const field = new SchemaField({
            name: getUniqueFieldName(),
            type: fieldType,
        });

        field.onMountSelect = true;

        collection.schema.push(field);
        collection.schema = collection.schema;
    }

    function getUniqueFieldName(base = "field") {
        let counter = "";

        while (hasFieldWithName(base + counter)) {
            ++counter;
        }

        return base + counter;
    }

    function hasFieldWithName(name) {
        return !!collection.schema.find((field) => field.name === name);
    }

    function getSchemaFieldIndex(field) {
        return nonDeletedFields.findIndex((f) => f === field);
    }

    function replaceIndexesColumn(oldName, newName) {
        if (!collection?.schema?.length || oldName === newName || !newName) {
            return;
        }

        // update indexes on renamed fields
        collection.indexes = collection.indexes.map((idx) =>
            CommonHelper.replaceIndexColumn(idx, oldName, newName)
        );
    }

    // ---------------------------------------------------------------
    // fields drag&drop handling
    // ---------------------------------------------------------------

    function onFieldDrag(event, i) {
        if (!event) {
            return;
        }

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.setData("text/plain", i);
    }

    function onFieldDrop(event, target) {
        if (!event) {
            return;
        }

        event.dataTransfer.dropEffect = "move";

        const start = parseInt(event.dataTransfer.getData("text/plain"));
        const newSchema = collection.schema;

        if (start < target) {
            newSchema.splice(target + 1, 0, newSchema[start]);
            newSchema.splice(start, 1);
        } else {
            newSchema.splice(target, 0, newSchema[start]);
            newSchema.splice(start + 1, 1);
        }

        collection.schema = newSchema;

        // reset errors since the schema keys index has changed
        setErrors({});
    }
</script>

<div class="block m-b-25">
    <p class="txt-sm">
        {$_('collectionSidebar.systemFields')}:
        <Tag size="sm" class="txt-sm">id</Tag> 
        <Tag size="sm" class="txt-sm">created</Tag>
        <Tag size="sm" class="txt-sm">updated</Tag>
        {#if collection.$isAuth}
            
            <Tag size="sm" class="txt-sm">username</Tag>
            <Tag size="sm" class="txt-sm">email</Tag>
            <Tag size="sm" class="txt-sm">emailVisibility</Tag>
            <Tag size="sm" class="txt-sm">verified</Tag>
        {/if}
        
    </p>
</div>

<div class="accordions schema-fields">
    {#each collection.schema as field, i (field)}
        <svelte:component
            this={fieldComponents[field.type]}
            key={getSchemaFieldIndex(field)}
            bind:field
            on:remove={() => removeField(i)}
            on:rename={(e) => replaceIndexesColumn(e.detail.oldName, e.detail.newName)}
            on:dragstart={(e) => onFieldDrag(e.detail, i)}
            on:drop={(e) => onFieldDrop(e.detail, i)}
        />
    {/each}
</div>

<NewField class="pb-btn pb-btn-block bx--btn" on:select={(e) => newField(e.detail)} />

<hr />

<IndexesList bind:collection />
