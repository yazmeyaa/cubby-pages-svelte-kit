<script>
	import { fade, slide } from 'svelte/transition'

	export let kind
	export let details = null
  export let truncate = false
</script>

<style>
	.message {
    position: absolute;
		width: calc(100% - 42px);
   		top:29px;
		color: white;
		padding: 12px 16px 12px 24px;
		font: 800 12px/1.7 var(--font);
		margin: 0;
		border-radius: 6px;
		left: 20px;
		/* border-top: 1px solid white; */
		box-sizing: border-box;
		font-family: monospace;
		mix-blend-mode: hard-light;
		/* opacity: 0.0; */
		text-shadow: 1px 2px 10px black;
	}

	

	.truncate {
		white-space: pre;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	p {
		margin: 0;
	}

	.error {
		background-color: var(--cds-danger-01);
	}

	.warning {
		background-color: var(--cds-warning-01);
	}

	.info {
		background-color: var(--cds-ui-01);
		mix-blend-mode: overlay;
		transition: all ease-in-out 1.3s !important;
		opacity: 1.0;
	}
</style>

<div 
  in:fade={{delay: 150, duration: 100}}
  out:fade={{duration: 500}}
  class="message {kind}"
  class:truncate
>
	
  {#if details}
		
    <p>
     {#each details.message.split('\n') as line}
      {line} <br />
     {/each}
    </p>

	{:else}

		<slot />

	{/if}

</div>