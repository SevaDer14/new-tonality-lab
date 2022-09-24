<script lang="ts">
    import type { ChartData } from 'chart.js'
    import Chart from 'chart.js/auto'
    import { onMount } from 'svelte'

    type TChartOptions =
        | {
              label?: string
              color?: string
              axes?: {
                  x?: {
                      units?: string
                      label?: string
                  }
                  y?: {
                      units?: string
                      label?: string
                  }
              }
          }
        | undefined

    export let data: { x: number; y: number }[]
    export let options: TChartOptions = undefined

    let barChartElement: HTMLCanvasElement
    let plotData: ChartData
    let chart: any

    plotData = {
        datasets: [
            {
                label: options?.label,
                pointRadius: 0,
                borderColor: options?.color || '#000',
                data: data,
            },
        ],
    }

    $: {
        if (chart) {
            chart.data.datasets[0].data = data
            chart.update()
        }
    }

    onMount(async () => {
        chart = new Chart(barChartElement, {
            type: 'line',
            data: plotData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: options?.axes?.x?.label !== undefined,
                            text: options?.axes?.x?.label,
                        },
                    },
                    y: {
                        title: {
                            display: options?.axes?.x?.label !== undefined,
                            text: options?.axes?.y?.label,
                        },
                    },
                },
                layout: {
                    padding: 32,
                },
            },
        })
    })
</script>

<div class="plot-container">
    <canvas bind:this={barChartElement} />
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
