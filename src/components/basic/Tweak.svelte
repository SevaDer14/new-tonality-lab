<script lang="ts">
    import type { TTweak, TMinMax } from 'src/xentonality/types'
    import Range from './Range.svelte'
    export let index: number
    export let ratio: number
    export let disabled: boolean | undefined
    export let initialValue: TTweak | undefined
    export let ratioLimits: TMinMax | undefined
    export let amplitudeLimits: TMinMax | undefined
    export let onRatioChange: ((value: number) => void) | undefined
    export let amplitude: number
    export let onAmplitudeChange: ((value: number) => void) | undefined
</script>

<div class="flex">
    <p class="mt-5 mr-2 text-xs">{index}:</p>
    <fieldset class="bg-white-5 mb-2 p-4 rounded-2xl relative w-full">
        <legend class="w-full text-xs text-white-65 mb-4 relative top-5 flex justify-between">
            <p class="flex">{`ratio: ${ratio}`}</p>
            <p class="flex">{`amp: ${amplitude}`}</p>
        </legend>

        {#if onRatioChange !== undefined}
            <Range class="py-0" label="Ratio" {disabled} min={ratioLimits?.min !== undefined ? ratioLimits?.min : -1} max={ratioLimits?.max !== undefined ? ratioLimits?.max : 1} step={0.01} initialValue={initialValue?.ratio} onInput={onRatioChange} />
        {/if}
        {#if onAmplitudeChange !== undefined}
            <Range class="py-0" label="Amplitude" {disabled} min={amplitudeLimits?.min !== undefined ? amplitudeLimits?.min : -1} max={amplitudeLimits?.max !== undefined ? amplitudeLimits?.max : 1} step={0.01} initialValue={initialValue?.amplitude} onInput={onAmplitudeChange} />
        {/if}
    </fieldset>
</div>
