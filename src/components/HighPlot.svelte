<script lang="ts">
    import highcharts from '../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { layout } from '../theme/layout'

    type TAxisOptions = {
        title?: {
            text?: string
        }
        min?: number
        max?: number
        tickInterval?: number
        gridLineWidth?: number
    }

    export let options: {
        series: {
            name: string
        }
        title?: string
        yAxis: TAxisOptions
        xAxis: TAxisOptions
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
                yAxis: options.yAxis,
                xAxis: {
                    title: options.xAxis.title,
                    min: options.xAxis.min || 0.95 * data[0][0],
                    max: options.xAxis.max,
                    tickInterval: options.xAxis.tickInterval || data[0][0],
                    gridLineWidth: options.xAxis.gridLineWidth,
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
