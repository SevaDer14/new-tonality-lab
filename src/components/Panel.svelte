<script lang="ts">
    import ChevronDown from '../icons/ChevronDown.svelte'

    export let title = ''
    export let size: 'full' | 'lg' | 'md' | 'sm'
    export let collapsible = true

    let collapsed = false
</script>

<div class={`w-full border-2 border-white-65 overflow-hidden select-none ${$$props.class}`}>
    <div class="h-9 border-b-2 border-white-65 bg-white-15 flex items-center">
        {#if collapsible}
            <button class="shrink-0 basis-12" on:click={() => (collapsed = !collapsed)}>
                <ChevronDown class="mx-2 transition-all ease-in-out duration-500" style={`transform: rotate(${collapsed ? 0 : 180}deg)`} />
            </button>
        {/if}
        <h2 class="basis-full uppercase tracking-widest pl-4">{title}</h2>
        <slot name="actions" />
    </div>
    <div class={`w-full overflow-x-auto overflow-y-hidden flex transition-all duration-500 ease-in-out ${size} ${$$props.class}`} class:collapsed>
        <slot />
    </div>
</div>

<style>
    .collapsed {
        height: 0px !important;
    }
    .full {
        height: 100%;
    }
    .lg {
        height: 464px;
    }
    .md {
        height: 274px;
    }
    .sm {
        height: 154px;
    }
</style>
