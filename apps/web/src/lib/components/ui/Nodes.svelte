<script lang="ts">
  import type Drawflow from "drawflow";
  import type { DrawflowNode } from "drawflow";

  import Endpoint from "$lib/components/nodes/Endpoint.svelte";
  import Template from "$lib/components/nodes/Template.svelte";
  import Request from "$lib/components/nodes/Request.svelte";
  import Script from "$lib/components/nodes/Script.svelte";
  import ForLoop from "$lib/components/nodes/ForLoop.svelte";
  import IfCase from "$lib/components/nodes/IfCase.svelte";
  import Control from "$lib/components/nodes/Control.svelte";
  import Respond from "$lib/components/nodes/Respond.svelte";
  import Wait from "$lib/components/nodes/Wait.svelte";
  import Log from "$lib/components/nodes/Log.svelte";
  import Email from "$lib/components/nodes/Email.svelte";
  import Note from "$lib/components/nodes/Note.svelte";
  import Hub from "$lib/components/nodes/Hub.svelte";

  import NodeView from "$lib/components/ui/NodeView.svelte";

  export let node: DrawflowNode;
  export let editor: Drawflow;
  export let nodeUnselected: () => void;
</script>

{#if node == null}
  <NodeView />
{/if}
{#if node?.name == "endpoint"}
  <Endpoint {node} {editor} />
{/if}
{#if node?.name == "template"}
  <Template {node} {editor} />
{/if}
{#if node?.name == "request"}
  <Request {node} {editor} />
{/if}
{#if node?.name == "script"}
  <Script {node} {editor} {nodeUnselected} />
{/if}
{#if node?.name == "forLoop"}
  <ForLoop {node} {editor} />
{/if}
{#if node?.name == "ifCase"}
  <IfCase {node} {editor} />
{/if}
{#if node?.name == "control"}
  <Control {node} {editor} />
{/if}
{#if node?.name == "respond"}
  <Respond {node} {editor} />
{/if}
{#if node?.name == "log"}
  <Log {node} {editor} />
{/if}
{#if node?.name == "email"}
  <Email {node} {editor} />
{/if}
{#if node?.name == "note"}
  <Note {node} {editor} />
{/if}
{#if node?.name == "wait"}
  <Wait {node} {editor} />
{/if}
{#if node?.name == "hub"}
  <Hub {node} {editor} />
{/if}
