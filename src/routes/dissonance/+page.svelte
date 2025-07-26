<script lang="ts">
    import { DissonanceCurve, type DissonanceCurveOptions } from './DissoannceCurve'
    import type { Spectrum } from './utils'
    import highcharts from '../../utils/highcharts.js'
    import Panel from '../../components/Panel.svelte'
    import { getChartConfig } from './chartConfig'

    let spectrum: Spectrum = [
        { freq: 400, amp: 1 },
        { freq: 800, amp: 1 / 2 },
        { freq: 1200, amp: 1 / 3 },
        { freq: 1600, amp: 1 / 4 },
        { freq: 2000, amp: 1 / 5 },
    ]

    let dissonanceOptions: DissonanceCurveOptions = {
        compliment: spectrum,
        context: spectrum,
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

<div class="grid grid-rows-2 grid-cols-3 gap-4 w-full">
    <Panel size="md" title="Spectrum" class="row-span-2" />
    <Panel size="md" title="Controls" class="col-span-2" />

    <Panel size="md" title="Dissonance curve" class="col-span-2">
        <div class="min-w-full">
            <div
                use:highcharts={{
                    chart: chartConfig,
                }}
            />
        </div>
    </Panel>
</div>
