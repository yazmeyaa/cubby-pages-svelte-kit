<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
</script>

<style>
  .add-new {
    display: flex;
    position: relative;
    min-height: 30px;
    margin-top: -10px;
    /* line-height: 0.2; */
    /* min-height: 20px; */
    align-self: baseline;
    align-content: baseline;
    /* position: relative; */
    /* line-height: 1; */
    margin-left: 10px;
    border-left: 1px #dddddd solid;
    padding-left: 10px;
	}

  svg {
		position: relative;
		overflow: hidden;
    /* min-height: 30px; */
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;
    transform: translateY(-1px);

		stroke: #999;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
  }
  
  svg:hover {
    /* stroke: blue; */
  }
</style>

<div
  class="add-new"
>

	<svg 
    width="20"
    height="20"
    viewBox="0 0 24 24"
    on:click={e => { dispatch('click', e) }}
  >

		<line x1='12' y1='5' x2='12' y2='19' />
		<line x1='5' y1='12' x2='19' y2='12' />

	</svg>

</div>