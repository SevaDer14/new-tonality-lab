<script lang="ts">
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { layout } from '../theme/layout'

    export let options: {
        series: {
            name: string
        }
        title?: string
        yAxisTitle: string
        xAxisTitle: string
    }
    export let data: number[][]

    let config: PlotOptions
    let chartContainer = null as HTMLDivElement | null
    let windowWidth: number
    let windowHeight: number

    $: {
        if (data) {
            config = {
                title: {
                    text: options.title,
                },
                yAxis: {
                    title: {
                        text: options.yAxisTitle,
                    },
                },
                xAxis: {
                    title: {
                        text: options.xAxisTitle,
                    },
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
                        data: data,
                        ...options.series,
                    },
                ],
            }
        }
    }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div bind:this={chartContainer} class="plot-container">
    <div class="chart" use:highcharts={{ width: windowWidth - layout.menuWidth - 32, height: windowHeight / 2 - 1, chart: config }} />
</div>

<style>
    .plot-container {
        width: 100%;
        height: calc(50vh - 1px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
