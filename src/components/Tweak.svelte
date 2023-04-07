<script lang="ts">
    import { round } from 'lodash'
    import type { TTweak, TMinMax } from 'src/xentonality/types'
    import Range from './Range.svelte'
    import Checkbox from './Checkbox.svelte'

    export let index: number
    export let disabled: boolean | undefined
    export let initialValue: TTweak | undefined
    export let ratioLimits: TMinMax | undefined
    export let amplitudeLimits: TMinMax | undefined
    export let ratio: number
    export let onRatioChange: ((value: number) => void) | undefined
    export let amplitude: number
    export let onAmplitudeChange: ((value: number) => void) | undefined

    let ratioTweakValue = initialValue?.ratio
    let amplitudeTweakValue = initialValue?.amplitude

    const handleRatioChange = (value: number) => {
        ratioTweakValue = value
        if (onRatioChange) onRatioChange(value)
    }

    const handleAmplitudeChange = (value: number) => {
        amplitudeTweakValue = value
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
                if (onAmplitudeChange) onAmplitudeChange(checked === false ? -amplitude : amplitudeTweakValue || 0)
            }}
        />
        {index}:
    </p>
    <fieldset class="bg-white-5 mb-2 p-4 rounded-2xl relative w-full">
        <legend class="w-full whitespace-nowrap text-xs text-white-65 mb-4 relative top-5 flex justify-between">
            <p class="flex">
                <span class={!ratioTweakValue ? '' : ratioTweakValue > 0 ? 'greater' : 'lower'}>
                    {`r: ${ratioTweakValue ? round(ratio + ratioTweakValue, 2) : ''}`}
                </span>
                {round(ratio, 2)}
            </p>
            <p class="flex">
                <span class={!amplitudeTweakValue ? '' : amplitudeTweakValue > 0 ? 'greater' : 'lower'}>
                    {`a: ${amplitudeTweakValue ? round(amplitude + amplitudeTweakValue, 2) : ''}`}
                </span>
                {round(amplitude, 2)}
            </p>
        </legend>

        {#if onRatioChange !== undefined}
            <Range class="py-0" label="Ratio" {disabled} min={ratioLimits?.min !== undefined ? ratioLimits?.min : -1} max={ratioLimits?.max !== undefined ? ratioLimits?.max : 1} step={0.01} initialValue={initialValue?.ratio} onInput={handleRatioChange} />
        {/if}
        {#if onAmplitudeChange !== undefined}
            <Range class="py-0" label="Amplitude" {disabled} min={amplitudeLimits?.min !== undefined ? amplitudeLimits?.min : -1} max={amplitudeLimits?.max !== undefined ? amplitudeLimits?.max : 1} step={0.01} initialValue={initialValue?.amplitude} onInput={handleAmplitudeChange} />
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
