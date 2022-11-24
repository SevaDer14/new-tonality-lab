<script lang="ts">
    import { partials, dissonanceCurve } from '../state/stores.js'
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { layout } from '../theme/layout'

    // TODO: 2 diss curves 1 hi res within +- 1 p-octave, 1 low res for -1 p-octave to last octave in spectrum
    // TODO: normalise each octave independently
    // TODO: diss curve limits can be disabled, add limit bu ratio
    // TODO: show value of fundamental on both charts
    // TODO: Saving disscruve - both are in max resolution (1 point per cent)

    let spectrumChartConfig: PlotOptions
    let dissonanceCurveChartConfig: PlotOptions
    let windowWidth: number
    let windowHeight: number

    $: {
        if ($partials && $dissonanceCurve) {
            spectrumChartConfig = {
                title: {
                    text: '',
                },
                yAxis: {
                    title: { text: 'Spectrum' },
                    gridLineWidth: 1,
                    max: 1,
                    min: 0,
                    minortickInterval: 0.2,
                },
                xAxis: {
                    title: { text: 'Ratio to fundamental' },
                    gridLineWidth: 1,
                    min: 0.5,
                    max: $partials[$partials.length - 1].ratio + 2,
                    startOnTick: false,
                    endOnTick: false,
                    tickInterval: 0.1,
                    type: 'logarithmic',
                },
                plotOptions: {
                    series: {
                        type: 'line',
                        label: {
                            connectorAllowed: false,
                        },
                        pointStart: 0,
                    },
                },
                series: [
                    {
                        type: 'column',
                        name: 'Partials',
                        color: '#1E90FF',
                        pointWidth: 0.5,
                        data: $partials.map((partial) => [partial.ratio, partial.amplitude]),
                    },
                    {
                        name: 'Dissonance Curve',
                        type: 'area',
                        color: '#000000',
                        opacity: 0.25,
                        data: $dissonanceCurve.curve.map((point) => [point.ratio, point.value * 0.3]),
                    },
                ],
            }

            dissonanceCurveChartConfig = {
                title: {
                    text: '',
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
                    max: 1200,
                    tickInterval: 100,
                },
                plotOptions: {
                    series: {
                        type: 'line',
                        label: {
                            connectorAllowed: false,
                        },
                        pointStart: 0,
                    },
                },
                series: [
                    {
                        name: 'Dissonance Curve',
                        type: 'area',
                        marker: {
                            enabled: false,
                        },
                        color: '#1E90FF',
                        fillOpacity: 0.15,
                        data: $dissonanceCurve.curve.map((point) => [point.cents, point.value]),
                    },
                ],
            }
        }
    }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="page">
    <div class="plots">
        <div
            class="plot"
            use:highcharts={{
                width: windowWidth - layout.menuWidth - 32,
                height: windowHeight / 2 - 1,
                chart: spectrumChartConfig,
            }}
        />
        <div
            class="plot"
            use:highcharts={{
                width: windowWidth - layout.menuWidth - 32,
                height: windowHeight / 2 - 1,
                chart: dissonanceCurveChartConfig,
            }}
        />
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
    .plot {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
