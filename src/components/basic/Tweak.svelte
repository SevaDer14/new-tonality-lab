<script lang="ts">
    import Range from './Range.svelte'
    import Checkbox from './Checkbox.svelte'
    import { round, type Point } from '../../xentonality'

    export let index: number
    export let disabled: boolean | undefined
    export let initialValue: Point
    export let ratio: number
    export let onRatioChange: ((value: number) => void) | undefined
    export let amplitude: number
    export let onAmplitudeChange: ((value: number) => void) | undefined

    let tweakValue = initialValue

    const handleRatioChange = (value: number) => {
        tweakValue[0] = value
        if (onRatioChange) onRatioChange(value)
    }

    const handleAmplitudeChange = (value: number) => {
        tweakValue[1] = value
        if (onAmplitudeChange) onAmplitudeChange(value)
    }
</script>

<div class="flex" style="min-width: 250px">
    <p class="mt-5 mr-1 text-xs flex">
        <Checkbox
            class="my-0 -mr-1 items-baseline"
            checked={true}
            onChange={(checked) => {
                disabled = !checked
                if (onAmplitudeChange) onAmplitudeChange(checked === false ? 0 : tweakValue[1] || 1)
            }}
        />
        {index}:
    </p>
    <fieldset class="bg-white-5 mb-2 p-4 rounded-2xl relative w-full">
        <legend class="w-full whitespace-nowrap text-xs text-white-65 mb-4 relative top-5 flex justify-between">
            <p class="flex">
                <span class={tweakValue[0] === 1 ? '' : tweakValue[0] > 1 ? 'greater' : 'lower'}>
                    {`r: ${tweakValue[0] !== undefined ? round(ratio * tweakValue[0], 2) : ''}`}
                </span>
                {round(ratio, 2)}
            </p>
            <p class="flex">
                <span class={tweakValue[1] === 1 ? '' : tweakValue[1] > 1 ? 'greater' : 'lower'}>
                    {`a: ${tweakValue[1] !== undefined ? round(amplitude * tweakValue[1], 2) : ''}`}
                </span>
                {round(amplitude, 2)}
            </p>
        </legend>

        {#if onRatioChange !== undefined}
            <Range class="py-0" label="Ratio" {disabled} min={0.1} max={1.5} step={0.005} initialValue={initialValue[0]} onInput={handleRatioChange} />
        {/if}
        {#if onAmplitudeChange !== undefined}
            <Range class="py-0" label="Amplitude" {disabled} min={0} max={1 / amplitude} step={0.01} initialValue={initialValue[1]} onInput={handleAmplitudeChange} />
        {/if}
    </fieldset>
</div>

<style>
    p > span {
        padding-right: 8px;
    }

    .greater {
        color: rgba(105, 255, 111, 0.65);
    }

    .lower {
        color: rgba(255, 230, 0, 0.65);
    }
</style>
