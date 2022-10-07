<script lang="ts">
    import HighPlot from '../../components/HighPlot.svelte'
    import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    import { toHighchartsJSCurve } from '../../xentonality/utils'
    import { spectrum, dissonanceCurve } from '../../state/stores.js'

    const spectrumChartOptions = {
        series: {
            name: 'spectrum-1',
            type: 'line',
        },
        yAxisTitle: 'Spectrum',
        xAxisTitle: 'Hz',
    }

    const dissonanceCurveChartOptions = {
        series: {
            name: 'dissonance-curve-1',
            type: 'line',
        },
        yAxisTitle: 'Precieved Dissonance',
        xAxisTitle: 'cents',
    }
</script>

<div class="page">
    <SettingsDrawer />

    <div class="plots">
        <HighPlot options={spectrumChartOptions} data={toHighchartsJSCurve({ xUnit: 'Hz', curve: $spectrum })} />
        <HighPlot options={dissonanceCurveChartOptions} data={toHighchartsJSCurve({ xUnit: 'cents', curve: $dissonanceCurve.curve })} />
    </div>
</div>

<style>
    .page {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .plots {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>
