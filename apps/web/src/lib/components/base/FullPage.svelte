<script lang='ts'>
    import PageWrapper from "$lib/components/base/PageWrapper.svelte";

    export let nobranding = false;

    export let fullSize: boolean
</script>

<PageWrapper class={"full-page" + fullSize ? "login_page_full_size" : ""} center>
    <div class={"wrapper wrapper-sm m-b-xl panel-wrapper"} >
        {#if !nobranding}
            <div class="block txt-center m-b-lg">
                <figure class="logo">
                    <img
                        src="{import.meta.env.BASE_URL}images/logo.svg"
                        alt="PocketBase logo"
                        width="140"
                        height="140"
                    />
                    <!-- <span class="txt">Cubby</span> -->
                </figure>
            </div>
            <div class="clearfix" />
        {/if}

        <slot />
    </div>
</PageWrapper>

<style>
    .panel-wrapper {
        animation: slideIn 200ms;
    }
</style>
