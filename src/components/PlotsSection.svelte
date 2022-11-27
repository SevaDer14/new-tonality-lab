<script lang="ts">
    import { partials, dissonanceCurve, dissonanceCurveHighRes } from '../state/stores.js'
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { layout } from '../theme/layout'


    let spectrumChartConfig: PlotOptions
    let dissonanceCurveChartConfig: PlotOptions
    let windowWidth: number
    let windowHeight: number

    $: {
        if ($partials && $dissonanceCurve && $dissonanceCurveHighRes) {
            spectrumChartConfig = {
                chart: {
                    zoomType: 'xy',
                },
                title: {
                    text: '',
                },
                yAxis: [
                    {
                        title: { text: 'Spectrum' },
                        type: 'logarithmic',
                        gridLineWidth: 1,
                        max: 0.99,
                        minortickInterval: 0.2,
                    },
                    {
                        title: { text: 'Roughness' },
                        gridLineWidth: 0,
                        max: 2,
                        min: 0,
                        tickInterval: 0.1,
                        opposite: true,
                    },
                ],
                xAxis: [
                    {
                        title: { text: 'Ratio to fundamental' },
                        type: 'logarithmic',
                        gridLineWidth: 1,
                        min: 1 / $dissonanceCurve.pseudoOctave.ratio,
                        max: $partials[$partials.length - 1].ratio + 2,
                        startOnTick: false,
                        endOnTick: false,
                        tickInterval: 0.1,
                        tickPositions: Math.ceil($partials[$partials.length - 1].ratio) <= 40 ? Array.from(Array(Math.ceil($partials[$partials.length - 1].ratio))).map((val, index) => Math.log10(index + 1)) : undefined,
                    },
                ],
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
                        yAxis: 0,
                        type: 'column',
                        name: 'Partials',
                        color: '#1E90FF',
                        pointWidth: 0.5,
                        data: $partials.map((partial) => [partial.ratio, partial.amplitude]),
                    },
                    {
                        yAxis: 1,
                        name: 'Dissonance Curve',
                        type: 'area',
                        color: '#228B22',
                        opacity: 0.25,
                        data: $dissonanceCurve.curve.map((point) => [point.ratio, point.value]),
                    },
                ],
            }

            dissonanceCurveChartConfig = {
                chart: {
                    zoomType: 'xy',
                },
                title: {
                    text: '',
                },
                yAxis: {
                    title: { text: 'Roughness' },
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
                        data: $dissonanceCurveHighRes.curve.map((point) => [point.cents, point.value]),
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
