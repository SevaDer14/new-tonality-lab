<script lang="ts">
    import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    import { partials, dissonanceCurve } from '../../state/stores.js'
    import highcharts from '../../utils/highcharts'
    import type { PlotOptions } from 'highcharts'
    import { layout } from '../../theme/layout'

    let chartContainer = null as HTMLDivElement | null
    let spectrumChartConfig: PlotOptions
    let dissonanceCurveChartConfig: PlotOptions
    let windowWidth: number
    let windowHeight: number

    $: {
        if ($partials && $dissonanceCurve) {
            spectrumChartConfig = {
                title: {
                    text: '',
                },
                yAxis: {
                    title: { text: 'Spectrum' },
                    gridLineWidth: 1,
                    min: 0,
                    max: 1,
                    tickInterval: 0.2,
                },
                xAxis: {
                    title: { text: 'Hz' },
                    gridLineWidth: 1,
                    min: $partials[0].frequency,
                    tickInterval: $partials[0].frequency,
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
                        type: 'column',
                        name: 'Partials',
                        color: 'DodgerBlue',
                        pointWidth: 0.5,
                        data: $partials.map((partial) => [partial.frequency, partial.amplitude]),
                    },
                ],
            }

            dissonanceCurveChartConfig = {
                title: {
                    text: '',
                },
                yAxis: {
                    title: { text: 'Sethares Dissonance' },
                    gridLineWidth: 1,
                    min: 0,
                    max: 1,
                    tickInterval: 0.2,
                },
                xAxis: {
                    title: { text: 'cents' },
                    gridLineWidth: 1,
                    min: 0,
                    tickInterval: 100,
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
                        type: 'line',
                        color: 'DodgerBlue',
                        data: $dissonanceCurve.curve.map((point) => [point.cents, point.value]),
                    },
                ],
            }
        }
    }
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="page">
    <SettingsDrawer />

    <div class="plots">
        <div bind:this={chartContainer} class="plot-container">
            <div
                use:highcharts={{
                    width: windowWidth - layout.menuWidth - 32,
                    height: windowHeight / 2 - 1,
                    chart: spectrumChartConfig,
                }}
            />
        </div>

        <div bind:this={chartContainer} class="plot-container">
            <div
                use:highcharts={{
                    width: windowWidth - layout.menuWidth - 32,
                    height: windowHeight / 2 - 1,
                    chart: dissonanceCurveChartConfig,
                }}
            />
        </div>
    </div>
</div>

<style>
    .plot-container {
        width: 100%;
        height: calc(50vh - 1px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page {
        display: flex;
        width: 100%;
        height: 100%;
    }
    .plots {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>
