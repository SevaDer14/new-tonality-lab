<script lang="ts">
    import { round } from 'lodash'
    import Range from './Range.svelte'
    import type { Tweak } from '../xentonality/spectrum'

    type MinMax = { min?: number; max?: number }

    export let disabled: boolean | undefined
    export let initialValue: Tweak | undefined
    export let rateLimits: MinMax | undefined
    export let amplitudeLimits: MinMax | undefined
    export let rate: number
    export let onRateChange: ((value: number) => void) | undefined
    export let amplitude: number
    export let onAmplitudeChange: ((value: number) => void) | undefined

    let rateTweakValue = initialValue?.rate
    let amplitudeTweakValue = initialValue?.amplitude

    const handleRatioChange = (value: number) => {
        rateTweakValue = value
        if (onRateChange) onRateChange(value)
    }

    const handleAmplitudeChange = (value: number) => {
        amplitudeTweakValue = value
        if (onAmplitudeChange) onAmplitudeChange(value)
    }
</script>

<div class="flex" style="min-width: 250px">
    <fieldset class="bg-white-5 mb-2 p-4 rounded-2xl relative w-full">
        <legend class="w-full whitespace-nowrap text-xs text-white-65 mb-4 relative top-5 flex justify-between">
            <p class="flex">
                <span class={!rateTweakValue ? '' : rateTweakValue > 0 ? 'greater' : 'lower'}>
                    {`r: ${rateTweakValue ? round(rate + rateTweakValue, 2) : ''}`}
                </span>
                {round(rate, 2)}
            </p>
            <p class="flex">
                <span class={!amplitudeTweakValue ? '' : amplitudeTweakValue > 0 ? 'greater' : 'lower'}>
                    {`a: ${amplitudeTweakValue ? round(amplitude + amplitudeTweakValue, 2) : ''}`}
                </span>
                {round(amplitude, 2)}
            </p>
        </legend>

        {#if onRateChange !== undefined}
            <Range class="py-0" label="Rate" {disabled} min={rateLimits?.min !== undefined ? rateLimits?.min : -1} max={rateLimits?.max !== undefined ? rateLimits?.max : 1} step={0.01} initialValue={initialValue?.rate} onInput={handleRatioChange} />
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
