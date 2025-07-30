<script lang="ts">
    import CONST from './const'
    import { DissonanceCurve } from './DissonanceCurve'
    import highcharts from '../../utils/highcharts.js'
    import { getDissonanceChartConfig } from './getDissonanceChartConfig'
    import type { Partial } from 'new-tonality-web-synth'
    import NumberInput from '../../components/NumberInput.svelte'
    import { transpose } from './utils'
    import Checkbox from '../../components/Checkbox.svelte'

    export let context: Partial[]
    export let complement: Partial[]
    export let interval: number

    let perspective: 'staicCurve' | 'staticInterval' = 'staticInterval'

    $: int = perspective === 'staticInterval' ? 0 : interval
    $: myComplement = perspective === 'staticInterval' ? complement : transpose(complement, -interval)

    let rangeMin = CONST.DISSONANCE_PARAMS.rangeMin
    let rangeMax = CONST.DISSONANCE_PARAMS.rangeMax
    let step = CONST.DISSONANCE_PARAMS.step
    let x_star = CONST.DISSONANCE_PARAMS.x_star
    let s1 = CONST.DISSONANCE_PARAMS.s1
    let s2 = CONST.DISSONANCE_PARAMS.s2
    let b1 = CONST.DISSONANCE_PARAMS.b1
    let b2 = CONST.DISSONANCE_PARAMS.b2

    $: dissonanceCurve = new DissonanceCurve({ context, complement: myComplement, rangeMin, rangeMax, step, s1, s2, b1, b2, x_star })
    $: dissonanceChartConfig = getDissonanceChartConfig(dissonanceCurve, int)

    $: {
        if (int < rangeMin) rangeMin = int
        if (int > rangeMax) rangeMax = int
    }

    function handlePerspectiveChange(checked: boolean) {
        if (checked) {
            perspective = 'staicCurve'
        } else {
            perspective = 'staticInterval'
        }
    }
</script>

<div class="min-w-full">
    <div class="flex flex-wrap border-b">
        <NumberInput label="min" whole defaultValue={rangeMin} bind:value={rangeMin} valueRange={1000} min={-4800} max={4800} />
        <NumberInput label="max" whole defaultValue={rangeMax} bind:value={rangeMax} valueRange={1000} min={-4800} max={4800} />
        <NumberInput label="step" whole defaultValue={CONST.DISSONANCE_PARAMS.step} bind:value={step} valueRange={10} min={0.1} />
        <div class="ml-auto mr-4">
            <Checkbox label="Fixed" checked={perspective === 'staicCurve'} onChange={handlePerspectiveChange} />
        </div>
    </div>
    <div
        use:highcharts={{
            chart: dissonanceChartConfig,
        }}
    />
    <div class="flex flex-wrap border-t">
        <NumberInput label="x*" defaultValue={CONST.DISSONANCE_PARAMS.x_star} bind:value={x_star} valueRange={0.1} min={0} />
        <NumberInput label="s1" defaultValue={CONST.DISSONANCE_PARAMS.s1} bind:value={s1} valueRange={0.01} />
        <NumberInput label="s2" defaultValue={CONST.DISSONANCE_PARAMS.s2} bind:value={s2} valueRange={10} />
        <NumberInput label="b1" defaultValue={CONST.DISSONANCE_PARAMS.b1} bind:value={b1} valueRange={1} />
        <NumberInput label="b2" defaultValue={CONST.DISSONANCE_PARAMS.b2} bind:value={b2} valueRange={1} />
    </div>
</div>
