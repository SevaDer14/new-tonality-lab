<script lang="ts">
    import { debounce } from 'lodash-es'

    export let label = ''
    export let hint = ''
    export let min: number
    export let max: number
    export let step = 1
    export let initialValue
    export let onInput: (arg: number) => any

    let value = initialValue as string
    const id = Math.random().toString()

    const handleInput = (event: any) => {
        onInput(Number(event.target.value))
    }
</script>

<label for={id}>{label}</label>
<div class="input-container">
    <input type="range" {min} {max} {step} bind:value on:input={debounce(handleInput, 200)} {id} />
    <input class="manual-input" type="number" {step} bind:value on:change={debounce(handleInput, 50)} />
</div>
<p>{hint}</p>

<style>
    p {
        margin-top: 0;
        font-size: small;
        color: rgb(0, 0, 0, 0.7);
        padding-left: 4px;
    }
    label {
        display: block;
        font-size: small;
        padding-left: 2px;
        padding-top: 6px;
    }
    .input-container {
        display: flex;
    }
    .manual-input {
        max-width: 48px;
        margin-left: 8px;
    }
</style>
