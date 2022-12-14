import type { TPartials, TPlotPoint, TPlotCurve } from '../../src/xentonality/types';
import { setharesLoudness } from '../../src/xentonality/utils';

// Helpers
const getZeroPlot = (): TPlotCurve => {
    const result = [] as TPlotCurve

    for (let i = 0; i <= 20; i++) {
        const ratio = 1 + i * 1 / 20
        const point: TPlotPoint = { Hz: ratio * 20, ratio: ratio, cents: 1200 / 20 * i, value: 0 }
        result.push(point)
    }

    return result
}


// Partials
export const partials = ({ ratios = [], fundamental = 440, amplitude  }: { ratios?: number[], fundamental?: number, amplitude?: number, }) => (
    ratios.map((ratio, index) => {
        return {
            ratio: ratio,
            frequency: ratio * fundamental,
            amplitude: amplitude === undefined ? 1 / (index + 1) : amplitude,
            loudness: setharesLoudness(amplitude === undefined ? 1 / (index + 1) : amplitude)
        }
    }) as TPartials
)

export const noPartals = partials({ ratios: [] })



// Plots
export const zeroPlot = getZeroPlot()

export const quadraticPlot = ({ a = 1, b = 0, c = 0 }: { a?: number, b?: number, c?: number }): TPlotCurve => {
    const parabola = (x: number): number => a * x ** 2 + b * x + c

    return zeroPlot.map(point => { return { ...point, value: parabola(point.ratio) } })
}

export const linearPlot = ({ a = 1, b = 0 }: { a?: number, b?: number }): TPlotCurve => {
    const line = (x: number): number => a * x + b

    return zeroPlot.map(point => { return { ...point, value: line(point.ratio) } })
}
