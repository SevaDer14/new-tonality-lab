<script lang="ts">
    import { DissonanceCurve } from './DissonanceCurve'
    import type { Spectrum } from './utils'
    import highcharts from '../../utils/highcharts.js'
    import Panel from '../../components/Panel.svelte'
    import { getChartConfig } from './chartConfig'
    import NumberInput from '../../components/NumberInput.svelte'
    import SpectrumGraph from './SpectrumGraph.svelte'
    import SpectrumControl from './SpectrumControl.svelte'

    let context: Spectrum = [
        { freq: 400, amp: 1 },
        { freq: 800, amp: 1 / 2 },
        { freq: 1200, amp: 1 / 3 },
        { freq: 1600, amp: 1 / 4 },
        { freq: 2000, amp: 1 / 5 },
    ]

    let complement: Spectrum = [
        { freq: 400, amp: 1 },
        { freq: 800, amp: 1 / 2 },
        { freq: 1200, amp: 1 / 3 },
        { freq: 1600, amp: 1 / 4 },
        { freq: 2000, amp: 1 / 5 },
    ]

    const DEFAULT_DISSONANCE_PARAMS = {
        rangeMin: 0,
        rangeMax: 1200,
        step: 1,
        s1: 0.021,
        s2: 19,
        b1: 3.5,
        b2: 5.75,
        x_star: 0.24,
    }

    let rangeMin = DEFAULT_DISSONANCE_PARAMS.rangeMin
    let rangeMax = DEFAULT_DISSONANCE_PARAMS.rangeMax
    let step = DEFAULT_DISSONANCE_PARAMS.step
    let x_star = DEFAULT_DISSONANCE_PARAMS.x_star
    let s1 = DEFAULT_DISSONANCE_PARAMS.s1
    let s2 = DEFAULT_DISSONANCE_PARAMS.s2
    let b1 = DEFAULT_DISSONANCE_PARAMS.b1
    let b2 = DEFAULT_DISSONANCE_PARAMS.b2

    $: dissonanceCurve = new DissonanceCurve({ context, complement, rangeMin, rangeMax, step, s1, s2, b1, b2, x_star })
    $: chartConfig = getChartConfig(dissonanceCurve)
</script>

<div class="grid grid-rows-2 grid-cols-3 gap-4 w-full">
    <Panel size="md" title="Table" class="row-span-2" collapsible={false}>
        <SpectrumControl title="Context" bind:spectrum={context} />
        <SpectrumControl title="Complement"bind:spectrum={complement} />
    </Panel>
    <Panel size="md" title="Spectrum" class="col-span-2" collapsible={false}>
        <SpectrumGraph {complement} {context} />
    </Panel>

    <Panel size="md" title="Dissonance curve" class="col-span-2" collapsible={false}>
        <div class="min-w-full">
            <div class="flex flex-wrap border-b">
                <NumberInput label="min" defaultValue={DEFAULT_DISSONANCE_PARAMS.rangeMin} bind:debouncedValue={rangeMin} valueRange={1000} min={-4800} max={4800} />
                <NumberInput label="max" defaultValue={DEFAULT_DISSONANCE_PARAMS.rangeMax} bind:debouncedValue={rangeMax} valueRange={1000} min={-4800} max={4800} />
                <NumberInput label="step" defaultValue={DEFAULT_DISSONANCE_PARAMS.step} bind:debouncedValue={step} valueRange={10} min={0.1} />
            </div>
            <div
                use:highcharts={{
                    chart: chartConfig,
                }}
            />
            <div class="flex flex-wrap border-t">
                <NumberInput label="x*" defaultValue={DEFAULT_DISSONANCE_PARAMS.x_star} bind:debouncedValue={x_star} valueRange={0.1} min={0} />
                <NumberInput label="s1" defaultValue={DEFAULT_DISSONANCE_PARAMS.s1} bind:debouncedValue={s1} valueRange={0.01} />
                <NumberInput label="s2" defaultValue={DEFAULT_DISSONANCE_PARAMS.s2} bind:debouncedValue={s2} valueRange={10} />
                <NumberInput label="b1" defaultValue={DEFAULT_DISSONANCE_PARAMS.b1} bind:debouncedValue={b1} valueRange={1} />
                <NumberInput label="b2" defaultValue={DEFAULT_DISSONANCE_PARAMS.b2} bind:debouncedValue={b2} valueRange={1} />
            </div>
        </div>
    </Panel>
</div>
