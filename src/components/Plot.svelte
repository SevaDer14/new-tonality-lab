<script lang="ts">
    import type { TPlotCurve } from '../xentonality/types'
    import type { ChartData } from 'chart.js'
    import Chart from 'chart.js/auto'
    import { afterUpdate, onMount } from 'svelte'
    import { colors } from '../theme/colors'

    export let data: string

    let barChartElement: HTMLCanvasElement
    let plotData: ChartData
    let chart: any

    plotData = {
        datasets: [
            {
                label: 'Sensory Dissonance',
                pointRadius: 0,
                borderColor: colors.blue,
                data: JSON.parse(data).curve.map((point) => {
                    return { x: point.cents, y: point.value }
                }),
            },
        ],
    }

    $: {
        if (chart) {
            chart.data.datasets[0].data = JSON.parse(data).curve.map((point) => {
                return { x: point.cents, y: point.value }
            })
            chart.update()
        }
    }

    onMount(async () => {
        chart = new Chart(barChartElement, {
            type: 'line',
            data: plotData,
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                },
            },
        })
    })
</script>

<div class="plot">
    <canvas bind:this={barChartElement} />
</div>

<style>
    .plot {
        width: 100%;
        height: calc(50vh - 1px);
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid lightgrey;
    }
</style>
