<script>
    import CommonHelper from "$lib/utils/CommonHelper";
    import { TextInput } from "carbon-components-svelte";

    export let value = [];
    export let separator = ",";

    $: valueStr = (value || []).join(", ");
</script>

<TextInput
    type={$$restProps.type || "text"}
    value={valueStr}
    on:input={(e) => {
        value = CommonHelper.splitNonEmpty(e.detail, separator);
    }}
    {...$$restProps}
/>

<!-- <input
    type={$$restProps.type || "text"}
    value={valueStr}
    on:input={(e) => {
        value = CommonHelper.splitNonEmpty(e.target.value, separator);
    }}
    {...$$restProps}
/> -->
