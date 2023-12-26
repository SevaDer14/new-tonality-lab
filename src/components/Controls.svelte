<script lang="ts">
    export let title: string | undefined = undefined
</script>

<div class={`px-2 border-white-25 border-r h-full flex-shrink-0 w-80 ${$$props.class}`}>
    <div class="py-4 h-full px-3 flex flex-col overflow-y-auto">
        {#if title !== undefined}
            <h3 class="uppercase text-white-65 tracking-widest h-10 leading-10 font-bold">{title}</h3>
        {/if}
        <slot />
    </div>
</div>

<style>
</style>
