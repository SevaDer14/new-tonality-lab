<script lang="ts">
    export let onClick: (e: Event) => any
    export let disabled = false
</script>

<button class={`border rounded p-1 m-1 w-28 ${$$props.class}`} on:click={onClick} {disabled}>
    <slot />
</button>

<style>
    button:disabled {
        opacity: 0.5;
    }
</style>
