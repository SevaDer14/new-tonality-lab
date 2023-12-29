<script lang="ts">
    import Range from './Range.svelte'
    import type { Tweak } from '../xentonality/spectrum'

    type MinMax = { min?: number; max?: number }

    export let disabled: boolean | undefined
    export let initialValue: Tweak | undefined = undefined
    export let value: Tweak = initialValue || { rate: 0, amplitude: 0, phase: 0 }
    export let rateLimits: MinMax | undefined
    export let amplitudeLimits: MinMax | undefined
    export let onRateChange: ((value: number) => void) | undefined
    export let onAmplitudeChange: ((value: number) => void) | undefined
    export let color: string | undefined = undefined

    const handleRatioChange = (value: number) => {
        if (onRateChange) onRateChange(value)
    }

    const handleAmplitudeChange = (value: number) => {
        if (onAmplitudeChange) onAmplitudeChange(value)
    }
</script>

<div class="flex" style="min-width: 250px">
    <fieldset class="bg-white-5 mb-2 px-4 py-2 rounded-2xl relative w-full">
        {#if onRateChange !== undefined}
            <Range class="py-0" label="Rate" {disabled} min={rateLimits?.min !== undefined ? rateLimits?.min : -1} max={rateLimits?.max !== undefined ? rateLimits?.max : 1} step={0.01} value={value?.rate} onInput={handleRatioChange} {color} />
        {/if}
        {#if onAmplitudeChange !== undefined}
            <Range class="py-0" label="Amplitude" {disabled} min={amplitudeLimits?.min !== undefined ? amplitudeLimits?.min : -1} max={amplitudeLimits?.max !== undefined ? amplitudeLimits?.max : 1} step={0.01} value={value?.amplitude} onInput={handleAmplitudeChange} {color} />
        {/if}
    </fieldset>
</div>

<style>
</style>
