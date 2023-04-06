import _ from "lodash"

export type Point2D = [number, number]

export type Series = number[]

export type PointSeries = Point2D[]

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

export type Matrix = number[][]


/**
 * Creates a series with numbers generated from index up to a given length that must be greater or equal zero. 
 * Generator function has access to current index and should return a value that will be placed in series at that index.
 * @param length - length of resulting series 
 * @param generator - (index: number) => number 
 */
export const createSeries = (length: number, generator: (index: number) => number): Series => {
    if (length < 0) throw new Error("Series length must be greater or equal zero!")

    return Array.from(Array(length), (v, i) => generator(i))
}


/**
 * Transforms series by applying transformation function to every number in series.
 * Transformation function has access to current number and its index and should return a number that will replace the one at current index.
 * @param series - ascending sorted number[] 
 * @param transformation - (n: number, index: number) => number 
 */
export const transformSeries = (series: Series, transformation: (n: number, i: number) => number): Series => {
    return series.map(transformation)
}


/**
 * Returns length of matrix row if all rows have the same length
 * Returns -1 if otherwise or if matrix has no rows
 * @param matrix - number[][]
 */
export const validMatrixRowLength = (matrix: Matrix): number => {
    return matrix.length === 0
        ? -1
        : matrix.reduce(
            (seriesLength, currentSeries) => currentSeries.length === seriesLength ? seriesLength : -1,
            matrix[0].length
        )
}


/**
 * Transposes 2D matrix. Matrix rows have to have the same length or matrix cannot equal []!
 * @param matrix - number[][]
 */
export const transposeMatrix = (matrix: Matrix): Matrix => {
    if (matrix.length === 0) return []

    const rowLength = validMatrixRowLength(matrix)
    if (rowLength === -1) throw new Error('Matrix rows have to have the same length or matrix cannot equal []!');

    return matrix[0].map((col, i) => matrix.map(row => row[i]))
}


/**
 * Reduces matrix by performing an expression on numbers at the same index for all rows.
 * Rows have to have the same length or matrix cannot equal []!
 * 
 * Example: you can use that to get a series which elements are products of summation of numbers in two series.
 * _______________________________
 * For two series = [ [ 1, 1, 1 ] , [ 2, 2, 2 ] ]
 * 
 * and reducer = ( acc, n ) => acc + n, 
 * 
 * result will be [ 3, 3, 3 ]
 * @param series - series to be reduced
 * @param reducer - (acc: number, curr: number) => number
 */
export const reduceMatrixToSeries = (matrix: Matrix, reducer: (acc: number, curr: number) => number): Series => {
    if (matrix.length < 2) return matrix.flat()
    const transposedSeries = transposeMatrix(matrix) as Matrix

    let result = []

    for (let i = 0; i < transposedSeries.length; i += 1) {
        result[i] = transposedSeries[i].reduce(reducer)
    }

    return result
}


/**
 * Merges matrix rows into single series so numbers are in ascending order.
 * @param removeDuplicates - if set to true will remove duplicates in resulting series, default value is false 
 */
export const mergeRows = (matrix: Matrix, options?: { removeDuplicates: boolean }): Series => {
    const removeDuplicates = options ? options.removeDuplicates : false

    if (matrix.length === 0) return [] as Series

    const result = matrix.flat().sort((a, b) => a - b)

    return removeDuplicates === true ? result.filter((n, i, arr) => n !== arr[i - 1]) : result
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
export const getAllIntervals = (series: Series): Interval[] => {
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


/**
 * Returns series of 2D points
 * @param length - length of resulting series 
 * @param generator - (index: number) => Point2D 
 */
export const createPointSeries = (length: number, generator: (index: number) => Point2D): PointSeries => {
    return Array.from(Array(length), (v, i) => generator(i))
}


/**
 * Adds column to the matrix. Column has to have the same length as other columns in the matrix!
 * @param matrix - matrix (of type number[][]) to add column to
 * @param column - column (of type number[]) to add to the matrix 
*/
export const addColumn = (matrix: Matrix, column: Series): Matrix => {
    if (column.length === 0) return matrix

    if (column.length !== matrix.length) throw new Error('Column has to have the same length as other columns in the matrix!');

    return matrix.map((col, i) => [...col, column[i]])
}


/**
 * Merges two number series into one 2D point series.
 * -----------------
 * Example: 
 * for seriesX = [1, 2, 3], seriesY = [10, 20, 30]
 * result = [[1, 10], [2, 20], [3, 30]]
*/
export const toPointSeries = (seriesX: Series, seriesY: Series): PointSeries => {
    const pointSeriesLength = validMatrixRowLength([seriesX, seriesY])

    if (pointSeriesLength === -1) throw new Error('Series in toPointSeries have to have the same length!');

    if (pointSeriesLength === 0) return [] as PointSeries

    return seriesX.map((valueX, i) => [valueX, seriesY[i]])
}


/**
 * Splits 2D point series into two number series that represent values for X and Y axis.
 * -----------------
 * Example: 
 * for pointSeries = [[1, 10], [2, 20], [3, 30]]
 * result = [[1, 2, 3], [10, 20, 30]]
*/
export const splitPointSeries = (pointSeries: PointSeries): [Series, Series] => {
    const seriesX: Series = []
    const seriesY: Series = []

    pointSeries.forEach(point => {
        seriesX.push(point[0])
        seriesY.push(point[1])
    })

    return [seriesX, seriesY]
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
// rewrite dissonance and spectrum functions using series
