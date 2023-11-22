<script lang="ts">
    import { spectrum, roughness, showSweep } from '../state/stores'
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { round, type PointSeriesValue, Spectrum } from '../xentonality'
    import { colors } from '../theme/colors'
    import roughnessWorkerUrl from '../workers/roughnessWorker?url'
    import { debounce } from 'lodash'

    // const roughnessWorker = new Worker(roughnessWorkerUrl, { type: 'module' })

    // const updateRoughness = (spectrum: Spectrum) => {
    //     const payload = JSON.stringify({
    //         type: 'update',
    //         payload: {
    //             partials: spectrum.partials.series.value as Array<any>,
    //         },
    //     })

    //     roughnessWorker.postMessage(payload)
    // }

    // spectrum.subscribe(
    //     debounce(updateRoughness, 100, {
    //         leading: false,
    //         trailing: true,
    //     })
    // )

    // roughnessWorker.onmessage = (message) => {
    //     const { data } = message
    //     if (!data.type) {
    //         console.error('Invalid Roughness Worker response!')
    //         return
    //     }
    //     if (data.type === 'error') {
    //         console.error(data.payload)
    //         return
    //     }
    //     if (data.type === 'success') {
    //         $roughness = data.payload
    //         console.log($roughness)
    //     }
    // }

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
            return `${this.series.name} <br/> ratio: ${round(this.x, 2)} <br/> amp: ${round(this.y, 2)}`
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
        if ($spectrum && $roughness) {
            let maxSpectrumRatio = $spectrum.partials.series.getX().max()

            spectrumChartConfig = {
                chart: {
                    zoomType: 'xy',
                    backgroundColor: '#00000000',
                    height: 370,
                    style: {
                        fontFamily: 'monospace',
                    },
                    animation: false,
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
                        min: 1 / $spectrum.options.octaveRatio,
                        max: maxSpectrumRatio + 1,
                        startOnTick: false,
                        endOnTick: false,
                        tickInterval: 0.1,
                        tickPositions: Math.ceil(maxSpectrumRatio) <= 20 ? Array.from(Array(Math.ceil(maxSpectrumRatio))).map((val, index) => Math.log10(index + 1)) : undefined,
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
                        color: colors.green[100],
                        pointWidth: $showSweep ? 3 : 2,
                        borderWidth: 0,
                        data: $spectrum.partials.series.value,
                    },
                    // {
                    //     // Sweep Spectrum
                    //     yAxis: 0,
                    //     type: 'column',
                    //     name: 'Partials',
                    //     color: colors.orange[100],
                    //     pointWidth: 2,
                    //     borderWidth: 0,
                    //     data: $showSweep ? $sweepPartials.map((partial) => [partial.ratio, partial.amplitude]) : [],
                    // },
                    {
                        yAxis: 1,
                        name: 'Roughness',
                        type: 'area',
                        color: {
                            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                            stops: [
                                [0, colors.white[65]],
                                [1, colors.white[25]],
                            ],
                        },
                        opacity: 0.15,
                        data: $roughness.profile.value || [],
                    },
                ],
            }

            // dissonanceCurveChartConfig = {
            //     chart: {
            //         zoomType: 'xy',
            //         backgroundColor: '#00000000',
            //         height: 250,
            //         style: {
            //             fontFamily: 'monospace',
            //         },
            //     },
            //     tooltip: tooltip,
            //     title: {
            //         text: '',
            //     },
            //     legend: {
            //         enabled: false,
            //     },
            //     yAxis: {
            //         title: { text: 'Roughness', style: titleStyles },
            //         gridLineWidth: 0,
            //         gridLineColor: colors.white[25],
            //         min: 0,
            //         max: 1,
            //         labels: {
            //             enabled: true,
            //             style: {
            //                 color: colors.white[65],
            //             },
            //         },
            //     },
            //     xAxis: {
            //         title: { text: 'cents', style: titleStyles },
            //         tickInterval: round($pseudoOctave / $dissonanceCurveEDOMarks, 2),
            //         gridLineWidth: 1,
            //         gridLineColor: colors.white[25],
            //         gridLineDashStyle: 'dash',
            //         minorTickInterval: 100,
            //         minorGridLineWidth: $show12EDO ? 1 : 0,
            //         minorGridLineColor: colors.white[5],
            //         min: 0,
            //         tickPosition: 'inside',
            //         labels: labels,
            //     },
            //     plotOptions: {
            //         series: {
            //             type: 'line',
            //             label: {
            //                 connectorAllowed: false,
            //             },
            //             pointStart: 0,
            //         },
            //     },
            //     series: [
            //         {
            //             name: 'Dissonance Curve',
            //             type: 'area',
            //             marker: {
            //                 enabled: false,
            //             },
            //             color: colors.blue[100],
            //             fillOpacity: 0.15,
            //             data: $dissonanceCurveHighRes.curve.map((point) => [point.cents, point.value]),
            //         },
            //         {
            //             // Sweep Spectrum Note Line
            //             yAxis: 0,
            //             type: 'column',
            //             name: 'Partials',
            //             color: colors.orange[100],
            //             pointWidth: 2,
            //             borderWidth: 0,
            //             data: $showSweep ? [[Math.floor(ratioToCents($sweepRatio)), $dissonanceCurveHighRes.curve.find((point) => point.cents === Math.floor(ratioToCents($sweepRatio)))?.value || 0.5]] : [],
            //         },
            //         {
            //             // Sweep Spectrum Note Ball
            //             yAxis: 0,
            //             type: 'scatter',
            //             name: 'Partials',
            //             color: colors.orange[100],
            //             marker: { symbol: 'circle', radius: 4 },
            //             data: $showSweep ? [[Math.floor(ratioToCents($sweepRatio)), $dissonanceCurveHighRes.curve.find((point) => point.cents === Math.floor(ratioToCents($sweepRatio)))?.value || 0.5]] : [],
            //         },
            //     ],
            // }
        }
    }
</script>

<div>
    <div
        use:highcharts={{
            chart: spectrumChartConfig,
        }}
    />
    <!-- <div
        use:highcharts={{
            chart: dissonanceCurveChartConfig,
        }}
    /> -->
</div>
