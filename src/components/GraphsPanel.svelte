<script lang="ts">
    import { partials, sweepPartials, sweepRatio, showSweep, dissonanceCurve, show12EDO, dissonanceCurveHighRes, dissonanceCurveEDOMarks, pseudoOctave } from '../state/stores.js'
    import { ratioToCents } from '../xentonality/utils'
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { round } from 'lodash'

    let spectrumChartConfig: PlotOptions
    let dissonanceCurveChartConfig: PlotOptions
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

    const labels = {
        style: {
            color: colors.white[65],
        },
    }

    const titleStyles = {
        color: '#FFF',
        'letter-spacing': '0.3rem',
    }

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
                tooltip: tooltip,
                title: {
                    text: '',
                },
                legend: {
                    enabled: false,
                },
                yAxis: [
                    {
                        title: { text: 'Amplitude', style: titleStyles },
                        gridLineWidth: 1,
                        gridLineColor: colors.white[5],
                        gridLineDashStyle: 'dash',
                        max: 1,
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
                        tickPosition: 'inside',
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

            dissonanceCurveChartConfig = {
                chart: {
                    zoomType: 'xy',
                    backgroundColor: '#00000000',
                    height: 250,
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
                    tickInterval: round($pseudoOctave / $dissonanceCurveEDOMarks, 2),
                    gridLineWidth: 1,
                    gridLineColor: colors.white[25],
                    gridLineDashStyle: 'dash',
                    minorTickInterval: 100,
                    minorGridLineWidth: $show12EDO ? 1 : 0,
                    minorGridLineColor: colors.white[5],
                    min: 0,
                    tickPosition: 'inside',
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
                    {
                        // Sweep Spectrum Note Line
                        yAxis: 0,
                        type: 'column',
                        name: 'Partials',
                        color: colors.orange.DEFAULT,
                        pointWidth: 2,
                        borderWidth: 0,
                        data: $showSweep ? [[Math.floor(ratioToCents($sweepRatio)), $dissonanceCurveHighRes.curve.find((point) => point.cents === Math.floor(ratioToCents($sweepRatio)))?.value || 0.5]] : [],
                    },
                    {
                        // Sweep Spectrum Note Ball
                        yAxis: 0,
                        type: 'scatter',
                        name: 'Partials',
                        color: colors.orange.DEFAULT,
                        marker: { symbol: 'circle', radius: 4 },
                        data: $showSweep ? [[Math.floor(ratioToCents($sweepRatio)), $dissonanceCurveHighRes.curve.find((point) => point.cents === Math.floor(ratioToCents($sweepRatio)))?.value || 0.5]] : [],
                    },
                ],
            }
        }
    }
</script>

<div>
    <div
        use:highcharts={{
            chart: spectrumChartConfig,
        }}
    />
    <div
        use:highcharts={{
            chart: dissonanceCurveChartConfig,
        }}
    />
</div>
