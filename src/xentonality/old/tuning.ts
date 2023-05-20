export type Ratio = {
    ratio: string,
    decimal: number,
}

export type Interval = Ratio & {
    repeats: number,
}

export type Tuning = {
    tuning: Interval[],
    octave?: Ratio
}


/**
 * Finds index of the first interval in the array, with decimal close to provided value
 */
export const findIntervalIndexByDecimal = (intervals: Interval[], decimal: number): number => {
    return intervals.findIndex(interval => Math.abs(interval.decimal - decimal) < 0.00001)
}


/**
 * Finds all intervals in a given series
 */
export const getAllIntervals = (series: SeriesValue): Interval[] => {
    let intervals = [] as Interval[]

    for (let i = 0; i < series.length; i += 1) {
        for (let j = i + 1; j < series.length; j += 1) {
            const decimal = series[j] / series[i]
            const index = findIntervalIndexByDecimal(intervals, decimal)

            if (index !== -1) {
                intervals[index].repeats += 1
            } else {
                const ratio = `${series[j]}/${series[i]}`
                intervals.push({ ratio, decimal, repeats: 1 })
            }
        }
    }


    return intervals.sort((a, b) => b.repeats - a.repeats)
}


/**
 * Returns octave and corresponding tuning for the array of intervals
 */
export const findTuning = (intervals: Interval[]): Tuning => {
    const transposeToSameOctave = (decimal: number, octave: number) => {
        let result = decimal
        while (result > octave) result = result / octave

        return _.round(result, 5)
    }

    const packWithinOctave = (intervals: Interval[], octave: number): Interval[] => {
        let result = [] as Interval[]

        intervals.forEach(interval => {
            const decimal = transposeToSameOctave(interval.decimal, octave)

            const indexInIntervals = findIntervalIndexByDecimal(intervals, decimal)
            const indexInResult = findIntervalIndexByDecimal(result, decimal)

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

    let octave = undefined
    let packedIntervals = intervals

    intervals.forEach(interval => {
        const newReducedArray = packWithinOctave(intervals, interval.decimal)
        if (newReducedArray.length < packedIntervals.length) {
            octave = {
                decimal: interval.decimal,
                ratio: interval.ratio
            }
            packedIntervals = newReducedArray
        }
    })

    return { octave: octave, tuning: octave ? packedIntervals : intervals }
}


// need functions for JI
export type PrimeNumbers = 2 | 3 | 5 | 7 | 11 | 13 | 17 | 19 | 23 | 29 | 31 | 37 | 41 | 43 | 47 | 53 | 59 | 61 | 67 | 71 | 73 | 79 | 83 | 89 | 97 | 101
export const createJustIntonation = (limit: PrimeNumbers): Tuning => {
    return ({
        tuning: [],
        octave: {
            decimal: 2,
            ratio: "2/1",
        }
    })
}
