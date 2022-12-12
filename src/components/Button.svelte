<script lang="ts">
    export let onClick: (e: Event) => any
    export let disabled = false
    export let color: 'green' | 'blue' | 'white' | 'yellow' | 'orange' = 'white'
    export let classes = ''
</script>

<button class={`border rounded p-1 m-1 w-28 text-${color} border-${color}-65 bg-${color}-5 ${classes}`} on:click={onClick} {disabled}>
    <slot />
</button>

<style>
    button:disabled {
        opacity: 0.5;
    }
</style>