<script lang="ts">
    import ChevronDown from '../icons/ChevronDown.svelte'

    export let title = ''
    export let size: 'lg' | 'md' | 'sm'
    let collapsed = false
</script>

<div class={`w-full border-2 border-white-65 overflow-hidden`}>
    <div class="h-9 border-b-2 border-white-65 bg-white-15 flex items-center">
        <button class="shrink-0 basis-12" on:click={() => (collapsed = !collapsed)}>
            <ChevronDown class="mx-2 transition-all ease-in-out duration-500" style={`transform: rotate(${collapsed ? 0 : 180}deg)`} />
        </button>
        <h2 class="basis-full uppercase tracking-widest">{title}</h2>
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
