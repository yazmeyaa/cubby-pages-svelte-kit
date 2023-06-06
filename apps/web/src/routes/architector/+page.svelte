<script lang="ts">
  // @ts-nocheck

  import { Editor } from 'bytemd'
  import breaks from '@bytemd/plugin-breaks'
  import frontmatter from '@bytemd/plugin-frontmatter'
  import gemoji from '@bytemd/plugin-gemoji'
  import gfm from '@bytemd/plugin-gfm'
  import highlight from '@bytemd/plugin-highlight'
  import math from '@bytemd/plugin-math'
  import mediumZoom from '@bytemd/plugin-medium-zoom'
  import mermaid from '@bytemd/plugin-mermaid'
  import 'bytemd/dist/index.css'
  import { TreeView } from 'carbon-components-svelte'

  import { onMount } from 'svelte'
  import type { PageData } from './$types'

  export let data: PageData

  console.log(data)
  let treeViewData = data.treeViewData

  let children = [...treeViewData]
  let selectedIds = []
  let activeId = ''
  let expandedIds = ['0']

  async function getFilePlainText(url) {
    const response = await fetch(url)
    const plainText = await response.text()
    return plainText
  }

  let value = ''
  let plugins = [
    gfm(),
    breaks(),
    frontmatter(),
    gemoji(),
    highlight(),
    math(),
    mediumZoom(),
    mermaid(),
  ]

  function searchTree(nodes, matchingId) {
    for (let i = 0; i < nodes.length; i++) {
      const element = nodes[i]

      if (element.id === matchingId) {
        return element
      } else if (element.children != null) {
        const result = searchTree(element.children, matchingId)
        if (result !== null) {
          return result
        }
      }
    }

    return null
  }

  async function handleNodeClick(event) {
    const node = event.detail

    const requiredNode = searchTree(treeViewData, node.id)
    if (requiredNode.type !== 'file') return
    const text = await getFilePlainText(requiredNode.path)

    value = text
  }
</script>

<div class="container">
  <div class="files_tree_container">
    <TreeView
      bind:expandedIds
      bind:selectedIds
      bind:children
      bind:activeId
      on:select={handleNodeClick}
      labelText="Files"
    />
  </div>
  <Editor
    bind:value
    on:change={(e) => {
      value = e.detail.value
    }}
    {plugins}
  />
</div>

<style lang="scss">
  .container {
    width: 100%;
    display: flex;
    margin-top: 3rem; /* 3 rem -- because of its a standart height of CDS header */

    .files_tree_container {
      width: calc(300px - 3rem);
    }
  }
</style>
