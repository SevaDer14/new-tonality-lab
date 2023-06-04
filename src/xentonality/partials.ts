import { errors } from "./errorMessages"
import { PointSeries, type Point, type PointSeriesValue } from "./pointSeries"

export const PRECISION = 10

function round(n: number) { return parseFloat(n.toFixed(PRECISION)) }

export type SpectrumTypes = "harmonic" | "equalTemperament"

export type PartialsGenerateOptions = {
    type: SpectrumTypes,
    numberOfPartials: number,
    amplitudeProfile?: number,
    octaveRatio?: number,
    steps?: number,
    ratioLimit?: number
}

export class Partials {
    private _partials: PointSeries

    constructor(partials?: PointSeriesValue) {
        this._partials = new PointSeries(partials)
    }

    public get value(): PointSeriesValue {
        return this._partials.value
    }

    generate({ type, numberOfPartials, amplitudeProfile = 0, steps = 12, ratioLimit = 1000, octaveRatio = 2 }: PartialsGenerateOptions) {
        if (numberOfPartials < 0) throw new Error(errors.partials.negativeNumberOfPartials)
        if (amplitudeProfile < 0) throw new Error(errors.partials.negativeAmplitudeProfile)
        if (numberOfPartials !== Math.floor(numberOfPartials)) throw new Error(errors.partials.nonIntegerNumberOfPartials)
        if (octaveRatio <= 1) throw new Error(errors.partials.lessThanOneOctaveRatio)

        this._partials = new PointSeries()
        if (numberOfPartials === 0) return this

        const exponent: (i: number) => number = {
            harmonic: (i: number) => Math.log2(i),
            equalTemperament: (i: number) => Math.round(Math.log2(i) * steps) / steps
        }[type]

        let i = 1
        while (this._partials.value.length < numberOfPartials) {
            const previousPartial = this._partials.value[this._partials.value.length - 1]
            const previousPartialRatio = previousPartial ? previousPartial[0] : undefined

            const ratio = round(octaveRatio ** exponent(i))

            if (ratio > ratioLimit) break

            if (previousPartialRatio === undefined || ratio !== previousPartialRatio) {
                const amp = this.getAmplitude(amplitudeProfile, ratio)
                this._partials.push([ratio, amp])
            }

            if (i === 1000000) throw new Error(errors.partials.probableInfiniteLoop)

            i++
        }

        return this
    }

    // IDEA: I can have a library of helper functions that can be passed to transform method
    //       instead of such methods on a class
    stretch(octaveRatio: number) {
        if (octaveRatio <= 0) throw new Error(errors.partials.lessThanOneOctaveRatio)

        const stretchX = (point: Point) => {
            point[0] = round(point[0] ** Math.log2(octaveRatio))
            return point
        }

        this._partials.transform(stretchX)

        return this
    }

    include(partials: PointSeriesValue) {
        this._partials.include(partials, { mode: "partials" })

        return this
    }

    shift(shiftRatio: number) {
        this._partials.transform((p) => [p[0] * shiftRatio, p[1]])

        return this
    }

    // shiftAndInclude(shiftRatio: number) {
    //     const shiftedPartials = this.value

    //     for (let i = 0; i < this._partials.value.length; i++) {
    //         shiftedPartials[i][0] = round(shiftedPartials[i][0] * shiftRatio)
    //     }

    //     this.include(shiftedPartials)

    //     return this
    // }

    tweak(tweaks: PointSeriesValue) {
        this._partials.transform((p, i) => {
            const tweak = tweaks[i]

            if (tweak === undefined) return p

            if (tweak[0] <= 0) throw new Error(errors.partials.tweakRatioLessOrEqualZero)
            if (tweak[1] < 0) throw new Error(errors.partials.tweakAmplitudeLessZero)


            return [round(tweak[0] * p[0]), round(tweak[1] * p[1])]
        })
    }

    private getAmplitude(slope: number, ratio: number): number {
        if (ratio < 1) return 0

        return slope === 0 ? 1 : round(ratio ** (-slope))
    }
}
