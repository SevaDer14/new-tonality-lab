<script lang="ts">
    import { DissonanceCurve, type DissonanceCurveOptions } from './DissonanceCurve'
    import type { Spectrum } from './utils'
    import highcharts from '../../utils/highcharts.js'
    import Panel from '../../components/Panel.svelte'
    import { getChartConfig } from './chartConfig'
    import NumberInput from '../../components/NumberInput.svelte'

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

    let dissonanceOptions: DissonanceCurveOptions = {
        context,
        complement,
        rangeMin: -4800,
        rangeMax: 4800,
        step: 1,
        s1: 0.021,
        s2: 19,
        b1: 3.5,
        b2: 5.75,
        x_star: 0.24,
    }

    const dissonanceCurve = new DissonanceCurve(dissonanceOptions)
    const chartConfig = getChartConfig(dissonanceCurve)
</script>

<div class="grid grid-rows-2 grid-cols-2 gap-4 w-full">
    <Panel size="md" title="Table" class="row-span-2" collapsible={false} />
    <Panel size="md" title="Spectrum" class="col-span-1" collapsible={false} />

    <Panel size="md" title="Dissonance curve" class="col-span-1" collapsible={false}>
        <div class="min-w-full">
            <NumberInput label="x" value={2} valueRange={10} min={0}/>
            <div
                use:highcharts={{
                    chart: chartConfig,
                }}
            />
        </div>
    </Panel>
</div>
