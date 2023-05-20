import { describe, expect, it } from 'vitest'
import { Series } from './series'
import { errors } from './errorMessages'
import { assertArrayFloatEquality } from './utils'

describe('Series:', () => {
    const numbers = [1, 2, 3]
    
    describe('constructor', () => {
        it('should construct series with [] value', () => {
            const series = new Series()

            expect(series.value).toEqual([])
        })

        it('should construct series with [1, 2, 3] value', () => {
            const series = new Series(numbers)

            expect(series.value).toEqual(numbers)
        })

        it('constructed series should not be a reference', () => {
            const input = [1, 2, 3]
            const series = new Series(input)
            input.reverse()

            expect(series.value).toEqual(numbers)
        })
    })

    describe('getter', () => {
        it('should return a correct value', () => {
            const series = new Series(numbers)

            expect(series.value).toEqual(numbers)
        })

        it('should return deep copy of value', () => {
            const series_1 = new Series([1, 2, 3])
            const series_2 = new Series(series_1.value)

            series_2.transform((n) => n * 2)

            expect(series_1.value).toEqual([1, 2, 3])
        })
    })

    describe('setter', () => {
        it('should set correct value', () => {
            const series = new Series(numbers)
            series.value = [10, 20, 30]

            expect(series.value).toEqual([10, 20, 30])
        })
    })

    describe('.push', () => {
        it('should push to the end of series value', () => {
            const series = new Series(numbers).push(4)

            expect(series.value).toEqual([...numbers, 4])
        })
    })

    describe('.fill', () => {
        it('should return [1, 1, 1]', () => {
            const series = new Series().fill(3, () => 1)

            expect(series.value).toEqual([1, 1, 1])
        })

        it('should return [1, 2, 3, 4, 5]', () => {
            const series = new Series().fill(5, (i) => i + 1)

            expect(series.value).toEqual([1, 2, 3, 4, 5])
        })

        it('should return [1, 2.1, 3.241]', () => {
            const series = new Series().fill(3, (i) => 2.1 ** Math.log2(i + 1))

            assertArrayFloatEquality(series.value, [1, 2.1, 3.241])
        })

        it('should throw error if length is less than zero', () => {
            expect(() => new Series().fill(-1, () => 1)).toThrowError(errors.series.lengthIsLessThanZero)
        })
    })

    describe('.transform', () => {
        it('should transform [1, 2, 3] to [1, 1, 1]', () => {
            const series = new Series(numbers).transform(() => 1)

            expect(series.value).toEqual([1, 1, 1])
        })

        it('should transform [1, 2, 3] to [100, 200, 300]', () => {
            const series = new Series([1, 2, 3]).transform((n) => n * 100)

            expect(series.value).toEqual([100, 200, 300])
        })

        it('should transform [1, 2, 3, 4, 5] to [1, 4, 9, 16, 25]', () => {
            const series = new Series([1, 2, 3, 4, 5]).transform((n, i) => n * (i + 1))

            expect(series.value).toEqual([1, 4, 9, 16, 25])
        })
    })
})





// describe('validMatrixRowLength', () => {
//     it('should return length of row if matrix has one row', () => {
//         const matrix = [[1, 2, 3, 4]]
//         const expectedOutcome = matrix[0].length

//         expect(validMatrixRowLength(matrix)).toEqual(expectedOutcome)
//     })

//     it('should return 3 if all rows have same length of 3', () => {
//         const matrix = [[1, 2, 3], [10, 20, 30], [100, 200, 300]]
//         const expectedOutcome = 3

//         expect(validMatrixRowLength(matrix)).toEqual(expectedOutcome)
//     })

//     it('should return 0 if all rows have same length of 0', () => {
//         const matrix = [[], [], []]
//         const expectedOutcome = 0

//         expect(validMatrixRowLength(matrix)).toEqual(expectedOutcome)
//     })

//     it('should return -1 if [] is provided', () => {
//         expect(validMatrixRowLength([])).toEqual(-1)
//     })

//     it('should return -1 if rows do not have the same length', () => {
//         const matrix = [[1, 2], [10, 20], [100, 200, 300]]
//         const expectedOutcome = -1

//         expect(validMatrixRowLength(matrix)).toEqual(expectedOutcome)
//     })

//     it('should keep input unchanged', () => {
//         const matrix = [[1, 2, 3], [4, 5, 6]]
//         const expectedOutcome = [[1, 2, 3], [4, 5, 6]]

//         validMatrixRowLength(matrix)

//         expect(matrix).toEqual(expectedOutcome)
//     })
// })


// describe('transposeMatrix', () => {
//     it('should return [] for [] input', () => {
//         const matrix = []
//         const expectedOutcome = []

//         expect(transposeMatrix(matrix)).toEqual(expectedOutcome)
//     })

//     it('should transpose square matrix', () => {
//         const matrix = [
//             [1, 2, 3],
//             [1, 2, 3],
//             [1, 2, 3],
//         ]
//         const expectedOutcome = [
//             [1, 1, 1],
//             [2, 2, 2],
//             [3, 3, 3],
//         ]

//         expect(transposeMatrix(matrix)).toEqual(expectedOutcome)
//     })

//     it('should transpose rectangle matrix', () => {
//         const matrix = [
//             [1, 2, 3, 4],
//             [1, 2, 3, 4],
//         ]
//         const expectedOutcome = [
//             [1, 1],
//             [2, 2],
//             [3, 3],
//             [4, 4],
//         ]

//         expect(transposeMatrix(matrix)).toEqual(expectedOutcome)
//     })

//     it('should throw error if rows are not the same length', () => {
//         const matrix = [
//             [1, 2, 3],
//             [1, 2, 3],
//             [1],
//         ]

//         expect(() => transposeMatrix(matrix)).toThrowError(/^Matrix rows have to have the same length or matrix cannot equal \[]!$/)
//     })

//     it('should keep input unchanged', () => {
//         const matrix = [[1, 2, 3], [4, 5, 6]]
//         const expectedOutcome = [[1, 2, 3], [4, 5, 6]]

//         transposeMatrix(matrix)

//         expect(matrix).toEqual(expectedOutcome)
//     })
// })


// describe('reduceMatrixToSeries', () => {
//     it('should return [] if matrix is []', () => {
//         const expectedOutcome = []
//         const matrix = []
//         const reducer = (acc, n) => acc + n

//         expect(reduceMatrixToSeries(matrix, reducer)).toEqual(expectedOutcome)
//     })

//     it('should return the row if matrix has only one row', () => {
//         const expectedOutcome = [1, 2, 3, 4]
//         const matrix = [[1, 2, 3, 4]]
//         const reducer = (acc, n) => acc + n

//         expect(reduceMatrixToSeries(matrix, reducer)).toEqual(expectedOutcome)
//     })

//     it('should throw error if rows have different length', () => {
//         const matrix = [[1, 2, 3], [10, 20, 30], [100]]
//         const reducer = (acc, n) => acc + n

//         expect(() => reduceMatrixToSeries(matrix, reducer)).toThrowError(/^Matrix rows have to have the same length or matrix cannot equal \[]!$/)
//     })

//     it('should sum 3 rows correctly', () => {
//         const expectedOutcome = [111, 222, 333]
//         const matrix = [[1, 2, 3], [10, 20, 30], [100, 200, 300]]
//         const reducer = (acc, n) => acc + n

//         expect(reduceMatrixToSeries(matrix, reducer)).toEqual(expectedOutcome)
//     })

//     it('should divide 2 rows correctly', () => {
//         const expectedOutcome = [10, 10, 10, 10]
//         const matrix = [[10, 20, 30, 40], [1, 2, 3, 4]]
//         const reducer = (acc, n) => acc / n

//         expect(reduceMatrixToSeries(matrix, reducer)).toEqual(expectedOutcome)
//     })

//     it('should keep input unchanged', () => {
//         const matrix = [[1, 2, 3], [4, 5, 6]]
//         const expectedOutcome = [[1, 2, 3], [4, 5, 6]]
//         const reducer = (acc, n) => acc + n

//         reduceMatrixToSeries(matrix, reducer)

//         expect(matrix).toEqual(expectedOutcome)
//     })
// })


// describe('mergeRows', () => {
//     it('should return [] if matrix is []', () => {
//         const expectedOutcome = []
//         const matrix = []

//         expect(mergeRows(matrix)).toEqual(expectedOutcome)
//     })

//     it('should return the row if matrix has only one row', () => {
//         const expectedOutcome = [1, 2, 3]
//         const matrix = [[1, 2, 3]]

//         expect(mergeRows(matrix)).toEqual(expectedOutcome)
//     })

//     it('should return row with no duplicates if matrix has only one row and removeDuplicates flag is true', () => {
//         const expectedOutcome = [1, 2, 3]
//         const matrix = [[1, 1, 2, 2, 3, 3]]

//         expect(mergeRows(matrix, { removeDuplicates: true })).toEqual(expectedOutcome)
//     })

//     it('should merge 3 rows, sort with ascending order and keep duplicates', () => {
//         const expectedOutcome = [0, 0.5, 1, 1, 2, 3, 4, 4, 20]
//         const matrix = [[0, 1], [1, 2, 4, 20], [0.5, 3, 4]]

//         expect(mergeRows(matrix)).toEqual(expectedOutcome)
//     })

//     it('should merge 3 rows, sort with ascending order and remove duplicates', () => {
//         const expectedOutcome = [0, 0.5, 1, 2, 3, 4, 20]
//         const matrix = [[0, 1], [1, 2, 4, 20], [0.5, 3, 4]]

//         expect(mergeRows(matrix, { removeDuplicates: true })).toEqual(expectedOutcome)
//     })

//     it('should keep input unchanged', () => {
//         const matrix = [[1, 2, 3], [4, 5, 6]]
//         const expectedOutcome = [[1, 2, 3], [4, 5, 6]]

//         mergeRows(matrix, { removeDuplicates: true })

//         expect(matrix).toEqual(expectedOutcome)
//     })
// })


// describe('findIntervalIndexByDecimal', () => {
//     const input = [
//         {
//             ratio: '2:1',
//             decimal: 2,
//             repeats: 4,
//         },
//         {
//             ratio: '4:3',
//             decimal: 1.33,
//             repeats: 3,
//         },
//         {
//             ratio: '3:2',
//             decimal: 1.5,
//             repeats: 2,
//         }
//     ]

//     it('should find correct index', () => {
//         expect(findIntervalIndexByDecimal(input, 1.33)).toEqual(1)
//     })

//     it('should return -1 if interval is not found', () => {
//         expect(findIntervalIndexByDecimal(input, 5)).toEqual(-1)
//     })

//     it('should return -1 for empty input', () => {
//         expect(findIntervalIndexByDecimal([], 1.33)).toEqual(-1)
//     })
// })


// describe('getAllIntervals', () => {
//     it('should return [] for empty series', () => {
//         const series = []
//         const expectedOutcome = []

//         expect(getAllIntervals(series)).toEqual(expectedOutcome)
//     })

//     it('should return [] for series with one number', () => {
//         const series = [1]
//         const expectedOutcome = []

//         expect(getAllIntervals(series)).toEqual(expectedOutcome)
//     })

//     it('should find all intervals for [1, 2, 3]', () => {
//         const series = [1, 2, 3]
//         const expectedOutcome = [
//             {
//                 repeats: 1,
//                 decimal: 2,
//                 ratio: "2/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3,
//                 ratio: "3/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5,
//                 ratio: "3/2",
//             },
//         ]

//         expect(getAllIntervals(series)).toEqual(expectedOutcome)
//     })

//     it('should find all intervals for [1, 2, 3, 4]', () => {
//         const series = [1, 2, 3, 4]
//         const expectedOutcome = [
//             {
//                 repeats: 2,
//                 decimal: 2,
//                 ratio: "2/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3,
//                 ratio: "3/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 4,
//                 ratio: "4/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5,
//                 ratio: "3/2",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.3333333333333333,
//                 ratio: "4/3",
//             },
//         ]

//         expect(getAllIntervals(series)).toEqual(expectedOutcome)
//     })


//     it('should find all intervals for [1, 2.1, 3.2]', () => {
//         const series = [1, 2.1, 3.2]
//         const expectedOutcome = [
//             {
//                 repeats: 1,
//                 decimal: 2.1,
//                 ratio: "2.1/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3.2,
//                 ratio: "3.2/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5238095238095237,
//                 ratio: "3.2/2.1",
//             },
//         ]

//         expect(getAllIntervals(series)).toEqual(expectedOutcome)
//     })

//     it('should keep input series unchanged', () => {
//         const series = [1, 2.1, 3.2]
//         const expectedOutcome = [1, 2.1, 3.2]

//         getAllIntervals(series)

//         expect(series).toEqual(expectedOutcome)
//     })
// })


// describe('findTuning', () => {
//     it('finds tuning and the octave = 2/1 for harmonic series', () => {
//         const expectedOutcome = {
//             octave: {
//                 decimal: 2,
//                 ratio: "2/1",
//             },
//             tuning: [
//                 {
//                     repeats: 1,
//                     decimal: 2,
//                     ratio: "2/1",
//                 },
//                 {
//                     repeats: 2,
//                     decimal: 1.5,
//                     ratio: "3/2",
//                 },
//             ]
//         }
//         const intervals = [
//             {
//                 repeats: 1,
//                 decimal: 2,
//                 ratio: "2/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3,
//                 ratio: "3/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5,
//                 ratio: "3/2",
//             },
//         ]

//         expect(findTuning(intervals)).toEqual(expectedOutcome)
//     })

//     it('does not find octave for harmonic series with some partials missing', () => {
//         const intervals = [
//             {
//                 repeats: 1,
//                 decimal: 2,
//                 ratio: "2/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 5,
//                 ratio: "5/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5,
//                 ratio: "3/2",
//             },
//         ]

//         const expectedOutcome = { tuning: intervals }

//         expect(findTuning(intervals)).toEqual(expectedOutcome)
//     })

//     it('does not find octave for randomly inharmonic series', () => {
//         const intervals = [
//             {
//                 repeats: 1,
//                 decimal: 2.1,
//                 ratio: "2.1/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 4.9,
//                 ratio: "4.9/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 1.5,
//                 ratio: "3/2",
//             },
//         ]

//         const expectedOutcome = { tuning: intervals }

//         expect(findTuning(intervals)).toEqual(expectedOutcome)
//     })

//     it('finds pseudo-octave 2.1 for stretched series', () => {
//         const expectedOutcome = {
//             octave: {
//                 decimal: 2.1,
//                 ratio: "2.1/1",
//             },
//             tuning: [
//                 {
//                     repeats: 1,
//                     decimal: 2.1,
//                     ratio: "2.1/1",
//                 },
//                 {
//                     repeats: 2,
//                     decimal: 1.542857142857143,
//                     ratio: "3.24/2.1",
//                 },
//             ]
//         }

//         const intervals = [
//             {
//                 repeats: 1,
//                 decimal: 2.1,
//                 ratio: "2.1/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3.24,
//                 ratio: "3.24/1",
//             },
//             {
//                 repeats: 1,
//                 decimal: 3.24 / 2.1,
//                 ratio: "3.24/2.1",
//             },
//         ]

//         expect(findTuning(intervals)).toEqual(expectedOutcome)
//     })
// })

// describe('splitPointSeries', () => {
//     it('splitPointSeries should split a point series into two separate series', () => {
//         const pointSeries: PointSeries = [[1, 2], [2, 3], [3, 4], [4, 5]]
//         const [seriesX, seriesY] = splitPointSeries(pointSeries)
//         expect(seriesX).toEqual([1, 2, 3, 4])
//         expect(seriesY).toEqual([2, 3, 4, 5])
//     })

//     it('splitPointSeries should return empty series if given an empty point series', () => {
//         const pointSeries: [number, number][] = []
//         const [seriesX, seriesY] = splitPointSeries(pointSeries)
//         expect(seriesX).toEqual([])
//         expect(seriesY).toEqual([])
//     })

//     it('splitPointSeries should return series with single element if given a point series with only one point', () => {
//         const pointSeries: PointSeries = [[1, 2]]
//         const [seriesX, seriesY] = splitPointSeries(pointSeries)
//         expect(seriesX).toEqual([1])
//         expect(seriesY).toEqual([2])
//     })
// })

// describe('toPointSeries', () => {
//     it('should correctly convert two series into a point series', () => {
//         const seriesX = [1, 2, 3, 4]
//         const seriesY = [2, 3, 4, 5]
//         const pointSeries = toPointSeries(seriesX, seriesY)
//         expect(pointSeries).toEqual([[1, 2], [2, 3], [3, 4], [4, 5]])
//     })

//     it('should throw an error if the input series have different lengths', () => {
//         const seriesX = [1, 2, 3]
//         const seriesY = [2, 3, 4, 5]
//         expect(() => {
//             toPointSeries(seriesX, seriesY)
//         }).toThrowError('Series in toPointSeries have to have the same length!')
//     })

//     it('should return an empty point series if given empty input series', () => {
//         const seriesX: number[] = []
//         const seriesY: number[] = []
//         const pointSeries = toPointSeries(seriesX, seriesY)
//         expect(pointSeries).toEqual([])
//     })

//     it('should correctly convert series with single elements into a point series', () => {
//         const seriesX = [1]
//         const seriesY = [2]
//         const pointSeries = toPointSeries(seriesX, seriesY)
//         expect(pointSeries).toEqual([[1, 2]])
//     })
// })

// describe('addColumn', () => {
//     it('should correctly add a column to a matrix', () => {
//         const matrix = [
//             [1, 2, 3],
//             [4, 5, 6],
//             [7, 8, 9],
//         ]
//         const column = [10, 11, 12]
//         const result = addColumn(matrix, column)
//         expect(result).toEqual([
//             [1, 2, 3, 10],
//             [4, 5, 6, 11],
//             [7, 8, 9, 12],
//         ])
//     })

//     it('should correctly add a column to a matrix of row length is different', () => {
//         const matrix = [
//             [1, 2],
//             [4, 5],
//             [7, 8],
//         ]
//         const column = [10, 11, 12]
//         const result = addColumn(matrix, column)
//         expect(result).toEqual([
//             [1, 2, 10],
//             [4, 5, 11],
//             [7, 8, 12],
//         ])
//     })

//     it('should return the original matrix if the column is empty', () => {
//         const matrix = [
//             [1, 2, 3],
//             [4, 5, 6],
//             [7, 8, 9],
//         ]
//         const column: number[] = []
//         const result = addColumn(matrix, column)
//         expect(result).toEqual(matrix)
//     })

//     it('should throw an error if the column has different length than other columns of the matrix', () => {
//         const matrix = [
//             [1, 2, 3],
//             [4, 5, 6],
//             [7, 8, 9],
//         ]
//         const column = [10, 11]
//         expect(() => {
//             addColumn(matrix, column)
//         }).toThrowError('Column has to have the same length as other columns in the matrix!')
//     })
// })

// describe('createPointSeries', () => {
//     it('should create a point series of the specified length', () => {
//         const length = 5
//         const generator = (index: number) => [index, index * 2] as Point2D
//         const result = createPointSeries(length, generator)
//         expect(result).toEqual([
//             [0, 0],
//             [1, 2],
//             [2, 4],
//             [3, 6],
//             [4, 8],
//         ])
//     })

//     it('should create an empty point series if length is 0', () => {
//         const length = 0
//         const generator = (index: number) => [index, index * 2] as Point2D
//         const result = createPointSeries(length, generator)
//         expect(result).toEqual([])
//     })

//     it('should create a point series with all zeroes if the generator function returns [0, 0]', () => {
//         const length = 5
//         const generator = (index: number) => [0, 0] as Point2D
//         const result = createPointSeries(length, generator)
//         expect(result).toEqual([
//             [0, 0],
//             [0, 0],
//             [0, 0],
//             [0, 0],
//             [0, 0],
//         ])
//     })
// })


