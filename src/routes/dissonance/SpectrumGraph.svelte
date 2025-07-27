<script lang="ts">
    import { colors } from '../../theme/colors.js'
    import highcharts from '../../utils/highcharts.js'
    import type { PlotOptions } from 'highcharts'
    import type { Spectrum } from './utils.js'

    export let context: Spectrum
    export let complement: Spectrum

    let spectrumChartConfig: PlotOptions

    function spectrumToData(spectrum: Spectrum) {
        return spectrum.map((p) => [p.freq, p.amp])
    }

    $: {
        const series = [
            {
                yAxis: 0,
                type: 'column',
                name: 'context',
                color: colors.green[65],
                pointWidth: 4,
                borderWidth: 0,
                data: spectrumToData(context),
            },
            {
                yAxis: 0,
                type: 'column',
                name: 'complement',
                color: colors.orange.DEFAULT,
                pointWidth: 2,
                borderWidth: 0,
                data: spectrumToData(complement),
            },
        ]

        const maxFreq = Math.max(context.at(-1)?.freq ?? 0, complement.at(-1)?.freq ?? 0)
        const maxAmp = Math.max(context.at(-1)?.amp ?? 0, complement.at(-1)?.amp ?? 0)

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
                    // @ts-expect-error does not correctly infer the type for 'this'
                    return `${this.series.name} <br/> freq: ${this.x.toFixed(2)} <br/> amp: ${this.y.toFixed(2)}`
                },
            },
            title: {
                text: '',
            },
            legend: {
                enabled: true,
                floating: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                itemStyle: {
                    color: 'white',
                },
            },
            yAxis: [
                {
                    max: Math.ceil(maxAmp) || 1,
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
                    // min: 0.45,
                    // max: maxFreq ? maxFreq + 2 : 5.5,
                    startOnTick: false,
                    endOnTick: false,
                    // tickInterval: 0.1,
                    // tickPositions: maxFreq > 0 && Math.ceil(maxFreq) <= 2000 ? Array.from(Array(Math.ceil(maxFreq))).map((val, index) => Math.log10(index + 1)) : undefined,
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
                },
            },
            // @ts-expect-error does not correctly infer the type for 'this'
            series,
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
