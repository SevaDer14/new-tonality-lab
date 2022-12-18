<script lang="ts">
    export let width = 300
    export let height = 400
    export let pageSection = false
    export let title: string | undefined = undefined
</script>

<div class="relative border-2 border-white-65 rounded-2xl m-3 flex flex-col w-full" style={pageSection === false ? `width: ${width}px; height: ${height}px` : `max-width: 56rem;`}>
    {#if title}
        <div class="relative top-0 left-0 rounded-t-2xl border-b-2 border-white-65 px-6 bg-white-25">
            <h2 class="uppercase tracking-widest h-10 leading-10">{title}</h2>
        </div>
    {/if}

    <div class="rich-text py-3 px-6 flex flex-col flex-grow">
        <slot />
    </div>
</div>
