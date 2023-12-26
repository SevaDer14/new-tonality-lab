<script lang="ts">
    export let label = ''
    export let min: number
    export let max: number
    export let step = 1
    export let initialValue: number | undefined
    export let onInput: (arg: number) => any
    export let disabled = false
    export let color = "rgb(0, 189, 249)"

    let backgroundSize: string
    let value = initialValue || 0
    const id = Math.random().toString()

    $: {
        if (value !== undefined) {
            const val = Number(value)
            backgroundSize = val < min ? '0% 100%' : val > max ? '100% 100%' : `${((val - min) * 100) / (max - min)}% 100%`
        }
    }

    const handleInput = (event: any) => {
        onInput(Number(event.target.value))
    }
</script>

<div class={`flex py-2 ${$$props.class}`} style={`--input-color: ${color}; ${disabled ? "opacity: 0.25; pointer-events: none" : "opacity: 1"}`}>
    <div class="flex flex-col max-w-full grow h-8">
        <label class="text-white-65 text-xs whitespace-nowrap" for={id}>{label}</label>
        <input class="mt-1" style={`background-size: ${backgroundSize}`} type="range" {min} {max} {step} {disabled} bind:value on:input={handleInput} {id} />
    </div>
    <input class="w-12 ml-1 bg-transparent pt-3 leading-4" type="number" {step} {disabled} bind:value on:change={handleInput} />
</div>

<style>
    input[type='range'] {
        -webkit-appearance: none;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.25);
        background-image: linear-gradient(var(--input-color), var(--input-color));
        background-repeat: no-repeat;
    }
    input[type='range']:focus {
        outline: none;
    }
    input[type='range']::-webkit-slider-runnable-track {
        height: 4px;
        cursor: pointer;
        background: none;
        opacity: 0.9;
    }
    input[type='range']::-webkit-slider-thumb {
        border: none;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        background: #ffffff;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -3px;
    }
    input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type='number']:focus {
        outline: none;
    }

    input[type='range']::-moz-range-track {
        height: 4px;
        cursor: pointer;
        background: none;
        opacity: 0.9;
    }
    input[type='range']::-moz-range-thumb {
        border: none;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        background: #ffffff;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -3px;
    }
</style>
