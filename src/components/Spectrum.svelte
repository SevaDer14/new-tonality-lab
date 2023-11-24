<script lang="ts">
    import { partials, sweepPartials, sweepRatio, showSweep, dissonanceCurve, show12EDO, dissonanceCurveHighRes, dissonanceCurveEDOMarks, pseudoOctave } from '../state/stores.js'
    import { ratioToCents } from '../xentonality/utils.js'
    import highcharts from '../utils/highcharts.js'
    import type { PlotOptions } from 'highcharts'
    import { round } from 'lodash'

    let spectrumChartConfig: PlotOptions
    let tooltip = {
        backgroundColor: '#FFFFFF09',
        borderRadius: 10,
        borderWidth: 1,
        style: {
            color: '#FFFFFF',
        },
        formatter: function (): string {
            return `${this.series.name} <br/> x: ${round(this.x, 2)} <br/> value: ${round(this.y, 2)}`
        },
    }

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

    $: {
        if ($partials && $dissonanceCurve && $dissonanceCurveHighRes) {
            spectrumChartConfig = {
                chart: {
                    zoomType: 'xy',
                    backgroundColor: '#00000000',
                    spacing: [8, 0, 4, 0],
                    height: 274,
                    style: {
                        fontFamily: 'monospace',
                    },
                },
                tooltip: tooltip,
                title: {
                    text: '',
                },
                legend: {
                    enabled: false,
                },
                yAxis: [
                    {
                        max: 1,
                        visible: false,
                        labels: {
                            enabled: false,
                        },
                    },
                    {
                        visible: false,
                        max: 2,
                        min: 0,
                        labels: {
                            enabled: false,
                        },
                    },
                ],
                xAxis: [
                    {
                        title: {
                            text: '',
                            style: {
                                color: 'transparent',
                            },
                        },
                        type: 'logarithmic',
                        gridLineWidth: 1,
                        gridLineColor: colors.white[25],
                        gridLineDashStyle: 'dash',
                        lineColor: colors.white[25],
                        min: 1 / $dissonanceCurve.pseudoOctave.ratio,
                        max: $partials[$partials.length - 1].ratio + 2,
                        startOnTick: false,
                        endOnTick: false,
                        tickInterval: 0.1,
                        tickPositions: Math.ceil($partials[$partials.length - 1].ratio) <= 20 ? Array.from(Array(Math.ceil($partials[$partials.length - 1].ratio))).map((val, index) => Math.log10(index + 1)) : undefined,
                        tickPosition: 'inside',
                        labels: {
                            style: {
                                color: colors.white[65],
                            },
                        },
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
                        // Main Spectrum
                        yAxis: 0,
                        type: 'column',
                        name: 'Partials',
                        color: colors.green.DEFAULT,
                        pointWidth: $showSweep ? 3 : 2,
                        borderWidth: 0,
                        data: $partials.map((partial) => [partial.ratio, partial.amplitude]),
                    },
                    {
                        // Sweep Spectrum
                        yAxis: 0,
                        type: 'column',
                        name: 'Partials',
                        color: colors.orange.DEFAULT,
                        pointWidth: 2,
                        borderWidth: 0,
                        data: $showSweep ? $sweepPartials.map((partial) => [partial.ratio, partial.amplitude]) : [],
                    },
                    {
                        yAxis: 1,
                        name: 'Dissonance Curve',
                        type: 'area',
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, colors.white[65]],
                                [1, colors.white[25]],
                            ],
                        },
                        opacity: 0.15,
                        data: $dissonanceCurve.curve.map((point) => [point.ratio, point.value]),
                    },
                ],
            }
        }
    }
</script>

<div class="min-w-full">
    <div
        use:highcharts={{
            chart: spectrumChartConfig,
        }}
    />
</div>
