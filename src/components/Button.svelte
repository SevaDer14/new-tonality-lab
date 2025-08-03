<script lang="ts">
    import { colors, type Color } from '../theme/colors'

    export let onClick: (e: Event) => any
    export let disabled = false
    export let size: 'lg' | 'sm' | 'xs' = 'lg'
    export let color: Color = 'white'

    $: sizeClass = (() => {
        if (size == 'lg') return 'px-1 py-1 w-28'
        if (size == 'sm') return 'px-1 py-1 text-xs'
        if (size == 'xs') return 'px-1 py-0 text-xs max-w-fit'
    })()
</script>

<button
    class={`mx-1 border rounded opacity-80 hover:opacity-100 ${sizeClass} ${$$props.class}`}
    style="color: {colors[color].DEFAULT}; border-color: {colors[color][65]}"
    on:click={onClick}
    {disabled}
>
    <slot />
</button>

<style>
    button:disabled {
        opacity: 0.5;
    }
</style>
