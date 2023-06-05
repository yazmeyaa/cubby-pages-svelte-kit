<script lang="ts">
    // import REPL from '@snlab/florence-repl';
    import REPL from './repl/src/repl/REPL.svelte'
    import appSource from './repl/src/appSource';
    // import { browser } from 'svelte/env';

      const replFiles = [
            {
            id: 0,
            name: 'App',
                type: 'svelte',
                source: appSource.trim(),
            },
            
            {
            id: 1,
            name: 'Component1',
            type: 'svelte',
                source: '<h1>Hello</h1>',
            }
        ]
        
        let currentFileId = 0;
    // console.log(preloadPackages);

    // import DataContainer from './packages/DataContainer.js'
    // import {florence} from '@snlab/florence';

    // export const preloadable = {
    //     DataContainer,
    //     florence
    // };

</script>
<div style="width:100%;height:100%;display:flex; flex-direction:row; flex:1;overflow:hidden;">
    {#if document}
        <REPL style="width:100%;height:100%;display:block;flex-direction:row; flex:1;" {replFiles} currentFileId={currentFileId} workersDir="/workers" />
    {/if}

</div>
