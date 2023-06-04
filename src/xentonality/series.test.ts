import { describe, expect, it } from 'vitest'
import { Series } from './series'
import { errors } from './errorMessages'


export const assertArrayFloatEquality = (arr1: number[], arr2: number[]) => {
    arr1.forEach((n, i) => {
        expect(n).toBeCloseTo(arr2[i])
    })
}

describe('Series:', () => {
    describe('constructor', () => {
        it('should construct series with [] value', () => {
            const series = new Series()

            expect(series.value).toEqual([])
        })

        it('should construct series with [1, 2, 3] value', () => {
            const series = new Series([1, 2, 3])

            expect(series.value).toEqual([1, 2, 3])
        })

        it('constructed series should not be a reference', () => {
            const series_1 = new Series([1, 2, 3])
            const series_2 = new Series(series_1.value)

            series_2.transform((p) => p * 2)

            expect(series_1.value).toEqual([1, 2, 3])
        })
    })

    describe('getter', () => {
        it('should return a correct value', () => {
            const series = new Series([1, 2, 3])

            expect(series.value).toEqual([1, 2, 3])
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
            const series = new Series([1, 2, 3])
            series.value = [10, 20, 30]

            expect(series.value).toEqual([10, 20, 30])
        })
    })

    describe('.push', () => {
        it('should push to the end of series value', () => {
            const series = new Series([1, 2, 3]).push(4)

            expect(series.value).toEqual([1, 2, 3, 4])
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
            const series = new Series([1, 2, 3]).transform(() => 1)

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
