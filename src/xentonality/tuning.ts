import type { SeriesValue } from "./series"
import type { Spectrum } from "./spectrum"
import { round } from "./utils"

export type Ratio = {
    ratio: string,
    decimal: number,
}

export type Interval = Ratio & {
    ratio: string,
    decimal: number,
    repeats: number,
}

export type KeyboardLayout = Map<string, {
    frequency: number,
}>

export class Tuning {
    private _intervals: Interval[]
    private _octave: Ratio | undefined


    constructor(spectrum: Spectrum) {
        const { octave, intervals } = this.findTuning(spectrum)
        this._octave = octave
        this._intervals = intervals
    }

    public get intervals(): Interval[] {
        return this._intervals
    }

    public get octave(): Ratio | undefined {
        return this._octave
    }

    update(spectrum: Spectrum) {
        const { octave, intervals } = this.findTuning(spectrum)
        this._octave = octave
        this._intervals = intervals
    }

    public get decimalValues(): SeriesValue {
        return [1, ...this._intervals.map(interval => interval.decimal).sort((a, b) => a - b)]
    }

    /**
     * Finds index of the first interval in the array, with decimal close to provided value
     */
    private findIntervalIndexByDecimal(intervals: Ratio[], decimal: number): number {
        return intervals.findIndex(interval => Math.abs(interval.decimal - decimal) < 0.00001)
    }

    /**
    * Finds all intervals in a given series
    */
    private getAllIntervals(spectrum: Spectrum): Interval[] {
        const partials = spectrum.partials.series.value
        let intervals = [] as Interval[]

        for (let i = 0; i < partials.length; i += 1) {
            for (let j = i + 1; j < partials.length; j += 1) {
                const decimal = partials[j][0] / partials[i][0]
                const index = this.findIntervalIndexByDecimal(intervals, decimal)

                if (index !== -1) {
                    intervals[index].repeats += 1
                } else {
                    const ratio = `${partials[j]}/${partials[i]}`
                    intervals.push({ ratio, decimal, repeats: 1 })
                }
            }
        }


        return intervals.sort((a, b) => b.decimal - a.decimal)
    }

    private transposeToSameOctave(decimal: number, octave: number) {
        let result = decimal
        while (result > octave) result = result / octave

        return round(result, 5)
    }

    private packWithinOctave(intervals: Interval[], octave: number): Interval[] {
        let result = [] as Interval[]

        intervals.forEach(interval => {
            const decimal = this.transposeToSameOctave(interval.decimal, octave)

            const indexInIntervals = this.findIntervalIndexByDecimal(intervals, decimal)
            const indexInResult = this.findIntervalIndexByDecimal(result, decimal)

            if (indexInIntervals !== -1 && indexInResult === -1) {
                result.push(intervals[indexInIntervals])
            } else if (indexInResult !== -1) {
                result[indexInResult].repeats += 1
            } else {
                result.push(interval)
            }
        })

        return result
    }

    /**
    * Returns octave and corresponding intervals for the array of intervals
    */
    private findTuning(spectrum: Spectrum): { octave?: Ratio, intervals: Interval[] } {
        const intervals = this.getAllIntervals(spectrum)
        let octave = undefined
        let packedIntervals = intervals

        intervals.forEach(interval => {
            const newReducedArray = this.packWithinOctave(intervals, interval.decimal)
            if (newReducedArray.length < packedIntervals.length) {
                octave = {
                    decimal: interval.decimal,
                    ratio: interval.ratio
                }
                packedIntervals = newReducedArray
            }
        })

        return {
            octave: octave, intervals: octave
                ? packedIntervals.sort((a, b) => a.decimal - b.decimal)
                : intervals.sort((a, b) => a.decimal - b.decimal)
        }
    }

}
