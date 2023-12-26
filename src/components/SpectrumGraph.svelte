<script lang="ts">
    import { spectrum } from '../state/stores.js'
    import type { Partial } from '../synth/types.js'
    import { colors, colorSeries } from '../theme/colors.js'
    import highcharts from '../utils/highcharts.js'
    import type { PlotOptions } from 'highcharts'

    let spectrumChartConfig: PlotOptions

    function partialsToPlotData(partials: Partial[]) {
        return partials.map((partial) => [partial.rate, partial.amplitude])
    }

    $: {
        if ($spectrum) {
            const data = $spectrum.map((layer) => partialsToPlotData(layer.partials))
            const series = data.map((points, index) => ({
                yAxis: 0,
                type: 'column',
                name: `Layer-${index}`,
                color: colors[colorSeries[index]]?.DEFAULT ?? colors.green.DEFAULT,
                pointWidth: 2,
                borderWidth: 0,
                data: points,
            }))
            const maxRate = data.reduce((acc, points) => {
                const rates = points.map((point) => point[0])
                return Math.max(...rates, acc)
            }, 0)
            const maxAmplitude = data.reduce((acc, points) => {
                const rates = points.map((point) => point[1])
                return Math.max(...rates, acc)
            }, 0)

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
                tooltip: {
                    backgroundColor: '#FFFFFF09',
                    borderRadius: 10,
                    borderWidth: 1,
                    style: {
                        color: '#FFFFFF',
                    },
                    formatter: function (): string {
                        return `${this.series.name} <br/> x: ${this.x.toFixed(2)} <br/> value: ${this.y.toFixed(2)}`
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
                        max: Math.ceil(maxAmplitude) || 1,
                        visible: false,
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
                        min: 0.45,
                        max: maxRate ? maxRate + 2 : 5.5,
                        startOnTick: false,
                        endOnTick: false,
                        tickInterval: 0.1,
                        tickPositions: maxRate > 0 && Math.ceil(maxRate) <= 20 ? Array.from(Array(Math.ceil(maxRate))).map((val, index) => Math.log10(index + 1)) : undefined,
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
                        animation: false,
                        label: {
                            connectorAllowed: false,
                        },
                        pointStart: 0,
                    },
                    column: {
                        grouping: false,
                    }
                },
                series,
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
