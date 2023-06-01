export default `
<script>
  import { scaleLinear } from 'd3-scale'

  import { Graphic, x2, x2s, Point, YAxis, Grid, YGridLines, Label, XAxis, XGridLines, Section, Rectangle,  createZoomHandler, createPanHandler } from "@snlab/florence@v0.3.5";
  let zoomIdentity = { x: 0, y: 0, kx: 2, ky: 2 }
  let blockReindexing = false

  const setZoomIdentity = zoomId => { zoomIdentity = zoomId }
  const setBlockReindexing = bool => { blockReindexing = bool }

  const pan = createPanHandler(zoomIdentity, {
    setZoomIdentity,
    setBlockReindexing,
    extentX: [-100, 100],
    extentY: [-100, 100]
  })

  const zoom = createZoomHandler(zoomIdentity, {
    setZoomIdentity,
    minZoom: 0.2,
    maxZoom: 3
  })

  import Component from './Component1.svelte';

  function handleClick() {
    alert("clicked");
  }


  const colors = ['red', 'blue', 'green', 'orange', 'yellow', 'purple']
  let columns = 2
</script>

<div>
  <label for="cols-slider">Columns:</label>
  <input type="range" min="1" max="3" bind:value={columns} name="cols-slider" />
</div>


<br />
<Graphic width={200} height={200}>

  <Grid numberOfCells={colors.length} {columns} let:cells>

    {#each colors as color, i}
      
      <Rectangle {...cells[i]} fill={color} />

    {/each}

  </Grid>

</Graphic>

<Graphic
  width={1500}
  padding={25}
  height={1500}
  scaleX={scaleLinear().domain([0, 100])}
  scaleY={scaleLinear().domain([0, 50])}
  {blockReindexing}
>
<Section
    scaleX={[0, 10]}
    scaleY={[0, 10]}
    {zoomIdentity}
    {...pan.handlers}
  >
  <YGridLines count={100} opacity={1.0} width={0.1} />
  <XGridLines count={50} extra={true} opacity={1.0} width={0.1} />
  <YAxis flip={true}  />
  <XAxis flip={true}  />

  <Rectangle x1={0} x2={2} fill="blue" opacity={0.3} />
  <Rectangle x1={2} x2={4} fill="red" opacity={0.3} />

  <Rectangle onClick={handleClick} x1={10} x2={14} y1={2} y2={4} style="cursor:pointer;"
    fill="rgba(0,0,0,0.2)" borderWidth="1px"
  />
</Section>
</Graphic>
`

