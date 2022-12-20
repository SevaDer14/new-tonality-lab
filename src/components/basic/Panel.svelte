<script lang="ts">
    export let title: string | undefined = undefined
    export let maxContentHeight: string | undefined = undefined
</script>

<div class={`relative p-3 flex 2xl:basis-1/5 md:basis-1/2 basis-full flex-grow ${$$props.class}`} style={$$props.style}>
    <div class={`border-2 border-white-65 rounded-2xl min-w-full flex-col ${$$props.class}`}>
        {#if title}
            <div class="relative top-0 left-0 rounded-t-2xl border-b-2 border-white-65 px-6 bg-white-25">
                <h2 class="uppercase tracking-widest h-10 leading-10">{title}</h2>
            </div>
        {/if}

        <div class="rich-text py-3 px-6 flex flex-col flex-grow overflow-y-auto" style={`max-height: ${maxContentHeight}`}>
            <slot />
        </div>
    </div>
</div>
