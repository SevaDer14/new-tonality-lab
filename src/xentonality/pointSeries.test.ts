import { describe, expect, it } from 'vitest'
import { PointSeries, type Point, type PointSeriesValue } from './pointSeries'
import { errors } from './errorMessages'
import { assertPointSeriesFloatEquality } from './utils'
import { Series } from './series'

describe('PointSeries:', () => {
    const points_1: Point[] = [[1, 1], [2, 2], [3, 3]]
    const points_2: Point[] = [[10, 10], [20, 20], [30, 30]]

    describe('constructor', () => {
        it('should construct point series with [] value', () => {
            const pointSeries = new PointSeries()

            expect(pointSeries.value).toEqual([])
        })

        it('should construct series with [[1, 1], [2, 2], [3, 3]] value', () => {
            const pointSeries = new PointSeries(points_1)

            expect(pointSeries.value).toEqual(points_1)
        })
    })

    describe('getter', () => {
        it('should return correct value of the series', () => {
            const pointSeries = new PointSeries(points_1)

            expect(pointSeries.value).toEqual(points_1)
        })

        it('should return deep copy value', () => {
            const series_1 = new PointSeries([[1, 1], [2, 1], [3, 1]])
            const series_2 = new PointSeries(series_1.value)

            series_2.transform((p) => p.reverse() as Point)

            expect(series_1.value).toEqual([[1, 1], [2, 1], [3, 1]])
        })
    })

    describe('setter', () => {
        it('should set correct value', () => {
            const series = new PointSeries(points_1)
            series.value = points_2

            expect(series.value).toEqual(points_2)
        })
    })

    describe('.push', () => {
        it('should push to the end of series value', () => {
            const pointSeries = new PointSeries(points_1).push([4, 4])

            expect(pointSeries.value).toEqual([...points_1, [4, 4]])
        })
    })


    describe('.sort', () => {
        it('should sort series value by x-axis in ascending order', () => {
            const points_1: PointSeriesValue = [[3, 1], [2, 2], [1, 3]]
            const pointSeries = new PointSeries(points_1).sort()

            expect(pointSeries.value).toEqual([[1, 3], [2, 2], [3, 1]])
        })
    })

    describe('.include', () => {
        it('should return empty series if both series are empty', () => {
            const pointSeries = new PointSeries().include([])

            expect(pointSeries.value).toEqual([])
        })

        it('should return series1 if including empty series', () => {
            const pointSeries = new PointSeries(points_1).include([])

            expect(pointSeries.value).toEqual(points_1)
        })

        it('should return series2 if including it into empty series', () => {
            const pointSeries = new PointSeries([]).include(points_2)

            expect(pointSeries.value).toEqual(points_2)
        })

        it('should return series1 if including it into itself', () => {
            const pointSeries = new PointSeries(points_1).include(points_1)

            expect(pointSeries.value).toEqual(points_1)
        })

        it('should return series1 if series2 is the same', () => {
            const series_1 = new PointSeries(points_1)
            const series_copy = new PointSeries(series_1.value)
            const result = series_1.include(series_copy.value)

            expect(result.value).toEqual(points_1)
        })

        it('should include series2 to the end of series1', () => {
            const pointSeries = new PointSeries(points_1).include(points_2)

            expect(pointSeries.value).toEqual([[1, 1], [2, 2], [3, 3], [10, 10], [20, 20], [30, 30]])
        })

        it('should not change series that is included', () => {
            const series_1 = new PointSeries([[1, 1], [2, 2], [3, 3]])
            const series_2 = new PointSeries([[10, 10], [20, 20], [30, 30]])

            series_1.include(series_2.value)

            expect(series_2.value).toEqual([[10, 10], [20, 20], [30, 30]])
        })

        it('should include two series and sort them', () => {
            const series1: PointSeriesValue = [[5, 3], [2, 7], [6.4, 0], [1.1, 4]]
            const series2: PointSeriesValue = [[1, 5], [12.1, 3], [6.3, 5]]

            const pointSeries = new PointSeries(series1).include(series2)

            expect(pointSeries.value).toEqual([[1, 5], [1.1, 4], [2, 7], [5, 3], [6.3, 5], [6.4, 0], [12.1, 3]])
        })

        it('should include two series without duplicates and sort them', () => {
            const series1: PointSeriesValue = [[1, 1], [2, 1], [3, 1]]
            const series2: PointSeriesValue = [[1, 1], [2.1, 1], [3.2, 1]]

            const pointSeries = new PointSeries(series1).include(series2)

            expect(pointSeries.value).toEqual([[1, 1], [2, 1], [2.1, 1], [3, 1], [3.2, 1]])
        })

        it('mode = "partials" should choose the point with largest Y if point with same X is present', () => {
            const series1: PointSeriesValue = [[1, 1], [2, 0.5], [3, 0.33], [4, 0.6]]
            const series2: PointSeriesValue = [[1.1, 0.1], [2.2, 1], [3, 1], [4, 0.5]]

            const pointSeries = new PointSeries(series1).include(series2, { mode: "partials" })

            expect(pointSeries.value).toEqual([[1, 1], [1.1, 0.1], [2, 0.5], [2.2, 1], [3, 1], [4, 0.6]])
        })
    })

    describe('.fill', () => {
        it('should return [[1, 1], [1, 1], [1, 1]]', () => {
            const series = new PointSeries().fill(3, () => [1, 1])

            expect(series.value).toEqual([[1, 1], [1, 1], [1, 1]])
        })

        it('should return [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]', () => {
            const series = new PointSeries().fill(5, (i) => [i, i + 1])

            expect(series.value).toEqual([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]])
        })

        it('should return [[0, 1], [2, 2.1], [4, 3.241]]', () => {
            const series = new PointSeries().fill(3, (i) => [i * 2, 2.1 ** Math.log2(i + 1)])

            assertPointSeriesFloatEquality(series.value, [[0, 1], [2, 2.1], [4, 3.241]])
        })

        it('should throw error if length is less than zero', () => {
            expect(() => new PointSeries().fill(-1, () => [1, 1])).toThrowError(errors.series.lengthIsLessThanZero)
        })
    })

    describe('.transform', () => {
        it('should transform [[1, 1], [1, 1], [1, 1]]', () => {
            const series = new PointSeries(points_1).transform(() => [1, 1])

            expect(series.value).toEqual([[1, 1], [1, 1], [1, 1]])
        })

        it('should transform to [[10, 100], [20, 200], [30, 300]]', () => {
            const series = new PointSeries(points_1).transform((point) => [point[0] * 10, point[1] * 100])

            expect(series.value).toEqual([[10, 100], [20, 200], [30, 300]])
        })
    })

    describe('.merge', () => {
        it('should merge to [] if both series are empty', () => {
            const series = new PointSeries().merge([], [])

            expect(series.value).toEqual([])
        })

        it('should merge to [[0, 5], [1, 3], [2, 7]]', () => {
            const series = new PointSeries().merge([0, 1, 2], [5, 3, 7])

            expect(series.value).toEqual([[0, 5], [1, 3], [2, 7]])
        })

        it('should throw error if series are of different lengths', () => {
            expect(() => new PointSeries().merge([0, 1, 2], [5, 3])).toThrowError(errors.series.lengthsAreNotEqual)
        })
    })

    describe('.split', () => {
        it('should return two empty Series if value is []', () => {
            const result = new PointSeries().split()

            expect(result).toEqual([new Series(), new Series()])
        })

        it('should return two Series with values [1, 2, 3]', () => {
            const result = new PointSeries(points_1).split()

            expect(result).toEqual([new Series([1, 2, 3]), new Series([1, 2, 3]),])
        })
    })
})
