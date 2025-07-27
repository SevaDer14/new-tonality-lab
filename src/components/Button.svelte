<script lang="ts">
    export let onClick: (e: Event) => any
    export let disabled = false
    export let size: 'lg' | 'sm' = 'lg'
    export let variant: 'neutral' | 'primary' | 'danger' = 'neutral'

    $: sizeClass = (() => {
        if (size == 'lg') return 'w-28'
        if (size == 'sm') return 'text-xs min-w-12'
    })()

    $: variantClass = (() => {
        if (variant == 'neutral') return ''
        if (variant == 'primary') return 'text-blue border-blue-65 bg-blue-5'
        if (variant == 'danger') return 'text-pink border-pink-65 bg-pink-5'
    })()
</script>

<button class={`border rounded p-1 m-1 ${sizeClass} ${variantClass} ${$$props.class}`} on:click={onClick} {disabled}>
    <slot />
</button>

<style>
    button:disabled {
        opacity: 0.5;
    }
</style>
