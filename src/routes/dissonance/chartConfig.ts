import type { PlotOptions } from 'highcharts'
import { colors } from '../../theme/colors'
import type { DissonanceCurve } from './DissonanceCurve'

export function getChartConfig(dissonanceCurve: DissonanceCurve, interval = 0): PlotOptions {
    const intervalAmplitude = dissonanceCurve.get(interval)

    return {
        chart: {
            zoomType: 'xy',
            backgroundColor: '#00000000',
            spacing: [8, 0, 4, 0],
            height: 224,
            animation: false,
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
                return `${this.series.name} <br/> interval: ${this.x.toFixed(2)} cents <br/> dissonance: ${this.y.toFixed(2)}`
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
                visible: false,
                max: dissonanceCurve?.maxDissonance,
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
                type: 'linear',

                gridLineWidth: 1,
                gridLineColor: colors.white[25],
                gridLineDashStyle: 'dash',
                lineColor: colors.white[25],

                tickInterval: 100,
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
                label: {
                    connectorAllowed: false,
                },
                pointStart: 0,
            },
            column: {
                grouping: false,
            },
        },
        // @ts-expect-error series type is not cased properly
        series: [
            {
                yAxis: 0,
                type: 'line',
                name: 'Dissonance curve',
                color: colors.green.DEFAULT,
                pointWidth: 2,
                borderWidth: 0,
                data: dissonanceCurve?.points ?? [],
            },
            {
                // Sweep Spectrum Note Line
                yAxis: 0,
                type: 'column',
                name: 'Note line',
                color: colors.orange.DEFAULT,
                pointWidth: 2,
                borderWidth: 0,
                data: [[interval, intervalAmplitude]],
            },
            {
                // Sweep Spectrum Note Ball
                yAxis: 0,
                type: 'scatter',
                name: 'Partials',
                color: colors.orange.DEFAULT,
                marker: { symbol: 'circle', radius: 4 },
                data: [[interval, intervalAmplitude]],
            },
        ],
    }
}
