<script lang="ts">
    // Think up system of sizes for synth and blog posts
    export let minWidth = 300
    export let minHeight = 400
    export let title: string | undefined = undefined
</script>

<div class="relative border-2 border-white-65 rounded-2xl" style={`min-width: ${minWidth}px; min-height: ${minHeight}px`}>
    {#if title}
        <div class="relative top-0 left-0 rounded-t-2xl border-b-2 border-white-65 px-6 bg-white-25">
            <h2 class="uppercase tracking-widest h-10 leading-10">{title}</h2>
        </div>
    {/if}

    <div class="p-3">
        <slot />
    </div>
</div>
