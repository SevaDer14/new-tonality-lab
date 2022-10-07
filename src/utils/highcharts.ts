import type { Options, ChartCallbackFunction } from 'highcharts';
import Highcharts from 'highcharts';

type TChartConfig = {
    width: number,
    height: number,
    chart?: ChartCallbackFunction
}

export default (node: Options, config: TChartConfig) => {
    const redraw = true;
    const oneToOne = true;
    const chart = Highcharts.chart(node, config.chart);

    return {
        update(config) {
            chart.update(config.chart, redraw, oneToOne);
            chart.setSize(config.width, config.height, true)
        },
        destroy() {
            chart.destroy();
        }
    };
}