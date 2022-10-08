<script lang="ts">
    import HighPlot from '../../components/HighPlot.svelte'
    import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    import { toHighchartsJSCurve } from '../../xentonality/utils'
    import { spectrum, dissonanceCurve } from '../../state/stores.js'

    const spectrumChartProps = {
        series: {
            name: 'spectrum-1',
            type: 'line',
        },
        yAxis: {
            title: { text: 'Spectrum' },
            gridLineWidth: 1,
            min: 0,
            max: 1,
            tickInterval: 0.2,
        },
        xAxis: {
            title: { text: 'Hz' },
            gridLineWidth: 1,
        },
    }

    const dissonanceCurveChartOptions = {
        series: {
            name: 'dissonance-curve-1',
            type: 'line',
        },
        yAxis: {
            title: { text: 'Sethares Dissonance' },
            gridLineWidth: 1,
            min: 0,
            max: 1,
            tickInterval: 0.2,
        },
        xAxis: {
            title: { text: 'cents' },
            gridLineWidth: 1,
            min: 0,
            tickInterval: 100,
        },
    }
</script>

<div class="page">
    <SettingsDrawer />

    <div class="plots">
        <HighPlot options={spectrumChartProps} data={toHighchartsJSCurve({ xUnit: 'Hz', curve: $spectrum })} />
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
