<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Editor from './codemirror/Editor.svelte'
  import Tabs from './tabs/Tabs.svelte'
  import getFileIndex from '../../utils/getFileIndex.js'

  import {_} from 'svelte-i18n'

  const dispatch = createEventDispatcher()

  export let replFiles
  export let currentFileId
  export let fontSize
  export let bundling

  $ :currentFileIndex = getFileIndex(replFiles, currentFileId)
  $: currentFile = replFiles[currentFileIndex]

  function updateCurrentFile (newCode) {
    replFiles[currentFileIndex].source = newCode.detail
  }
</script>

<style>
  .input-container {
    height: 100%; 
    /* margin-top: 20px; */
    /* width: 100%; */
     flex:0.5;
     min-width: 800px;
    border-bottom: 2px solid #ddd;
    position: relative;
    /* font-size: 90%; */
  }

  .flex {
    /* display: flex; */
    display: block;
   
    width:100%;
    flex-direction: column;
    /* height: 100%; */
    overflow: hidden;
  }

  .recompile-button-container {
    display: flex;
    justify-content: center;
  }

  .recompile-button {
    position: absolute;
    /* margin: 0px auto; */
    /* top: -55px; */
    height: 40px;
    top:0px;
    left:-100px;
    /* border:none; */
    outline: none!important;
    padding: 10px 22px;
   background: var(--cds-link-02);
   color: white;
   font-weight: bold;
   /* font-size: 13px; */
   max-height: 33px;
   min-height: 33px;
    display: flex;
    /* align-items: center; */
    /* justify-content: center; */
    /* border-radius: 5px 5px 0px 0px; */
    z-index: 2;
    left:-220px;
  }

  .recompile-button:hover {
    /* background-color: #FCFCFC; */
    cursor: pointer;
  }

  .recompile-button:disabled,
  .recompile-button[disabled] {
    cursor: not-allowed;
    /* background: var(--cds-brand-01); */
    background: var(--cds-inverse-link);
    /* background-color: #eee; */
  }
</style>

<div class="input-container">

  <div class="flex">
      <Tabs
      bind:replFiles
      bind:currentFileId
    />

    <div style="">
      <Editor 
        {currentFile}
        
        on:change={updateCurrentFile}
        {fontSize}
      />
    </div>

  </div>

  <div class="recompile-button-container">
    <button 
      class="recompile-button"
      disabled={bundling}
      on:click={() => dispatch('bundle')}
    >
      {$_('pageDynatable.recompileSaveAndRun')}
    </button>
  </div>

</div>
