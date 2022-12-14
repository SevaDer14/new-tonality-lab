<script lang="ts">
    import { partials, dissonanceCurve, dissonanceCurveHighRes } from '../state/stores.js'
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'

    let spectrumChartConfig: PlotOptions
    let dissonanceCurveChartConfig: PlotOptions
    let windowWidth: number
    let windowHeight: number

    let colors = {
        transparent: 'rgba(255, 255, 255, 0)',
        white: {
            DEFAULT: 'rgba(255, 255, 255, 1)',
            '65': 'rgba(255, 255, 255, 0.65)',
            '25': 'rgba(255, 255, 255, 0.25)',
            '5': 'rgba(255, 255, 255, 0.05)',
        },
        blue: {
            DEFAULT: 'rgba(0, 189, 249, 1)',
            '65': 'rgba(0, 189, 249, 0.65)',
            '25': 'rgba(0, 189, 249, 0.25)',
            '5': 'rgba(0, 189, 249, 0.05)',
        },
        green: {
            DEFAULT: 'rgba(105, 255, 111, 1)',
            '65': 'rgba(105, 255, 111, 0.65)',
            '25': 'rgba(105, 255, 111, 0.25)',
            '5': 'rgba(105, 255, 111, 0.05)',
        },
        yellow: {
            DEFAULT: 'rgba(255, 230, 0, 1)',
            '65': 'rgba(255, 230, 0, 0.65)',
            '25': 'rgba(255, 230, 0, 0.25)',
            '5': 'rgba(255, 230, 0, 0.05)',
        },
        orange: {
            DEFAULT: 'rgba(255, 177, 61, 1)',
            '65': 'rgba(255, 177, 61, 0.65)',
            '25': 'rgba(255, 177, 61, 0.25)',
            '5': 'rgba(255, 177, 61, 0.05)',
        },
        pink: {
            DEFAULT: 'rgba(255, 61, 177, 1)',
            '65': 'rgba(255, 61, 177, 0.65)',
            '25': 'rgba(255, 61, 177, 0.25)',
            '5': 'rgba(255, 61, 177, 0.05)',
        },
    }

    const chart = {
        zoomType: 'xy',
        backgroundColor: '#00000000',
        height: 300,
        style: {
            fontFamily: 'monospace',
        },
    }

    const labels = {
        style: {
            color: colors.white[65],
        },
    }

    const titleStyles = { color: '#FFF', 'letter-spacing': '0.3rem' }

    $: {
        if ($partials && $dissonanceCurve && $dissonanceCurveHighRes) {
            spectrumChartConfig = {
                chart: {
                    zoomType: 'xy',
                    backgroundColor: '#00000000',
                    height: 370,
                    style: {
                        fontFamily: 'monospace',
                    },
                },
                title: {
                    text: '',
                },
                legend: {
                    enabled: false,
                },
                yAxis: [
                    {
                        title: { text: 'Amplitude', style: titleStyles },
                        type: 'logarithmic',
                        gridLineWidth: 1,
                        gridLineColor: colors.white[5],
                        gridLineDashStyle: 'dash',
                        max: 0.99,
                        minortickInterval: 0.1,
                        labels: labels,
                    },
                    {
                        title: { text: '' },
                        gridLineWidth: 0,
                        max: 2,
                        min: 0,
                        tickInterval: 0.1,
                        opposite: true,
                        labels: {
                            enabled: false,
                        },
                    },
                ],
                xAxis: [
                    {
                        title: { text: 'Ratio to fundamental', style: titleStyles },
                        type: 'logarithmic',
                        gridLineWidth: 1,
                        gridLineColor: colors.white[25],
                        gridLineDashStyle: 'dash',
                        min: 1 / $dissonanceCurve.pseudoOctave.ratio,
                        max: $partials[$partials.length - 1].ratio + 2,
                        startOnTick: false,
                        endOnTick: false,
                        tickInterval: 0.1,
                        tickPositions: Math.ceil($partials[$partials.length - 1].ratio) <= 20 ? Array.from(Array(Math.ceil($partials[$partials.length - 1].ratio))).map((val, index) => Math.log10(index + 1)) : undefined,
                        tickPosition: "inside",
                        labels: labels,
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
                        color: colors.green.DEFAULT,
                        pointWidth: 2,
                        borderWidth: 0,
                        data: $partials.map((partial) => [partial.ratio, partial.amplitude]),
                    },
                    {
                        yAxis: 1,
                        name: 'Dissonance Curve',
                        type: 'area',
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, colors.blue[65]],
                                [1, colors.blue[25]],
                            ],
                        },
                        opacity: 0.15,
                        data: $dissonanceCurve.curve.map((point) => [point.ratio, point.value]),
                    },
                ],
            }

            dissonanceCurveChartConfig = {
                chart: {
                    zoomType: 'xy',
                    backgroundColor: '#00000000',
                    height: 250,
                    style: {
                        fontFamily: 'monospace',
                    },
                },
                title: {
                    text: '',
                },
                legend: {
                    enabled: false,
                },
                yAxis: {
                    title: { text: 'Roughness', style: titleStyles },
                    gridLineWidth: 0,
                    gridLineColor: colors.white[25],
                    min: 0,
                    max: 1,
                    labels: {
                        enabled: true,
                        style: {
                            color: colors.white[65],
                        },
                    },
                },
                xAxis: {
                    title: { text: 'cents', style: titleStyles },
                    gridLineWidth: 1,
                    gridLineColor: colors.white[25],
                    gridLineDashStyle: 'dash',
                    min: 0,
                    tickInterval: 100,
                    tickPosition: "inside",
                    labels: labels,
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
                        color: colors.blue.DEFAULT,
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
            use:highcharts={{
                chart: spectrumChartConfig,
            }}
        />
        <div
            class="plot"
            use:highcharts={{
                chart: dissonanceCurveChartConfig,
            }}
        />
    </div>
</div>

<style>
    /* .page {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .plots {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    } */
    /* .plot {
        display: flex;
        align-items: center;
        justify-content: center;
    } */
</style>
