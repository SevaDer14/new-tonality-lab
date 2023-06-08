<script lang="ts">
    export let label = ''
    export let initialValue = ''
    export let onInput: (arg: string) => any

    let value = initialValue as string
    const id = Math.random().toString()

    const handleInput = (event: any) => {
        onInput(event.target.value)
    }
</script>

<div class={`flex items-center bg-white-5 border-b-2 border-white-25 py-1 px-2 my-4 w-full ${$$props.class}`}>
    <label class="text-xs text-white-65 whitespace-nowrap mr-4" for={id}>{label}</label>
    <input class="bg-transparent min-w-0" bind:value={value} {id} on:input={handleInput} />
</div>

<style>
    input:focus {
        outline: none;
    }
</style>
