import { errors } from "./errorMessages"
import { PointSeries, type Point, type PointSeriesValue } from "./pointSeries"
import round from "lodash/round";

export const PRECISION = 10

export type HarmonicSpectrumOptions = {
    numberOfPartials: number,
    amplitudeProfile?: number,
}

export type EdoSpectrumOptions = HarmonicSpectrumOptions & {
    steps: number,
    ratioLimit?: number
}

export class Spectrum {
    private _partials: PointSeries

    constructor(partials?: PointSeriesValue) {
        this._partials = new PointSeries(partials)
    }

    public get partials(): PointSeriesValue {
        return JSON.parse(JSON.stringify(this._partials.value))
    }

    harmonic({ numberOfPartials, amplitudeProfile = 0 }: HarmonicSpectrumOptions) {
        if (numberOfPartials < 0) throw new Error(errors.spectrum.negativeNumberOfPartials)
        if (amplitudeProfile < 0) throw new Error(errors.spectrum.negativeAmplitudeProfile)
        if (numberOfPartials !== Math.floor(numberOfPartials)) throw new Error(errors.spectrum.nonIntegerNumberOfPartials)

        const generator = (i: number) => {
            const ratio = i + 1
            const amp = this.getAmplitude(amplitudeProfile, ratio)

            return [ratio, amp] as Point
        }

        this._partials.fill(numberOfPartials, generator)

        return this
    }

    edo({ numberOfPartials, amplitudeProfile = 0, steps, ratioLimit = 1000 }: EdoSpectrumOptions) {
        if (numberOfPartials < 0) throw new Error(errors.spectrum.negativeNumberOfPartials)
        if (amplitudeProfile < 0) throw new Error(errors.spectrum.negativeAmplitudeProfile)
        if (numberOfPartials !== Math.floor(numberOfPartials)) throw new Error(errors.spectrum.nonIntegerNumberOfPartials)

        this._partials = new PointSeries()
        if (numberOfPartials === 0) return this

        let i = 1
        while (this._partials.value.length < numberOfPartials) {
            const lastPartial = this._partials.value[this._partials.value.length - 1]
            const lastPartialRatio = lastPartial ? lastPartial[0] : undefined

            const ratio = round(2 ** (Math.round(Math.log2(i) * steps) / steps), PRECISION)

            if (ratio > ratioLimit) break

            if (lastPartialRatio === undefined || ratio !== lastPartialRatio) {
                const amp = this.getAmplitude(amplitudeProfile, ratio)
                this._partials.push([ratio, amp])
            }

            if (i === 1000000) throw new Error(errors.spectrum.probableInfiniteLoop)

            i++
        }

        return this
    }

    stretch(octaveRatio: number) {
        if (octaveRatio <= 0) throw new Error(errors.spectrum.zeroOrNegativeOctaveRatio)

        const stretchX = (point: Point) => {
            point[0] = round(point[0] ** Math.log2(octaveRatio), PRECISION)
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

    shiftAndInclude(shiftRatio: number) {
        const shiftedPartials = this.partials

        for (let i = 0; i < this._partials.value.length; i++) {
            shiftedPartials[i][0] = round(shiftedPartials[i][0] * shiftRatio, PRECISION)
        }

        this.include(shiftedPartials)

        return this
    }

    tweak(tweaks: PointSeriesValue) {
        this._partials.transform((p, i) => {
            const tweak = tweaks[i]
            
            if (tweak === undefined) return p

            if (tweak[0] <= 0) throw new Error(errors.spectrum.tweakRatioLessOrEqualZero)
            if (tweak[1] < 0) throw new Error(errors.spectrum.tweakAmplitudeLessZero)


            return [round(tweak[0] * p[0], PRECISION), round(tweak[1] * p[1], PRECISION)]
        })
    }

    private getAmplitude(slope: number, ratio: number): number {
        if (ratio < 1) return 0

        return slope === 0 ? 1 : round(ratio ** (-slope), 10)
    }
}
