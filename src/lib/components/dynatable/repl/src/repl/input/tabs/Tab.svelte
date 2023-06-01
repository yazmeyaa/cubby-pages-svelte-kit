<script>
  import { createEventDispatcher } from 'svelte'
  import TabNameEditor from './TabNameEditor.svelte'
  import getFileName from '../../../utils/getFileName.js'
  import getFileIndex from '../../../utils/getFileIndex.js'

  export let replFile
  export let usedFileNames
  export let active

  $: fileName = getFileName(replFile)

  const dispatch = createEventDispatcher()

  let iconsVisible = false
</script>

<style>
  .button {
	
	display: flex;
    position: relative;
    /* line-height: 0.2; */
	min-height: 30px;
	align-self: baseline;
	align-content: baseline;
    /* font-family: "Courier New"; */
    /* font-size: 14px; */
	/* min-height: 30px; */
	/* border-right: 1px solid var(--cds-ui-04); */
    /* border-left: 2px #dddddd solid; */
    cursor: pointer;
	padding: 10px 20px;
		background: var(--cds-ui-01);
  }

  .button.active {
    color: var(--cds-link-02);
	background: var(--cds-ui-03);
  }
  
  .uneditable {
    /* padding: 10px 20px; */
  }

	/* .button.active .editable {
		cursor: text;
	}

	.button.active .remove {
		display: block;
	} */

	/* .button.drag-over {
		background: #67677814;
	}

	.button.drag-over {
		cursor: move;
	} */

	/* .drag-handle {
		cursor: move;
		width: 5px;

		position: absolute;
		left: 5px;
		top: 9px;
		--drag-handle-color: #dedede;
		background: linear-gradient(to right,
			var(--drag-handle-color) 1px, white 1px,
			white 2px, var(--drag-handle-color) 2px,
			var(--drag-handle-color) 3px, white 3px,
			white 4px, var(--drag-handle-color) 4px
		);
	} */
</style>

<div
	id={fileName}
	class="button"
	role="button"
	class:active
	on:click={e => { dispatch('select', replFile.id) }}
	on:dblclick={e => e.stopPropagation()}
	on:dragstart={e => { dispatch('dragstart', e) }}
	on:dragover={e => { dispatch('dragover', e)}}
	on:dragleave={e => { dispatch('dragleave', e)}}
	on:drop={e => { dispatch('dragend', e)}}
  on:mouseenter={e => { iconsVisible = true }}
  on:mouseleave={e => { iconsVisible = false }}
>

  <!-- <i class="drag-handle"></i> -->

	{#if fileName === 'App.svelte'}

		<div class="uneditable">
			App.svelte
		</div>

  {:else}

		<TabNameEditor 
      bind:replFile
      {usedFileNames}
      {iconsVisible}
      on:remove={() => { dispatch('remove', replFile) }}
    />

	{/if}
</div>