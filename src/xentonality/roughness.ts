import { round } from "./utils"
import { PointSeries } from "./pointSeries"
import { Tuning, type Ratio } from "./tuning"
import { Partials } from "./partials"

type RoughnessConstructorOptions = {
    partials: Partials,
    sweep?: Partials,
    limits?: [number, number],
    fundamental?: number,
    numberOfPoints?: number
}

export class Roughness {
    private _partials: Partials
    private _sweep: Partials
    private _pseudoOctave: Ratio
    private _numberOfPoints: number
    private _limits: [number, number]
    private _profile: PointSeries
    private _fundamental: number

    constructor({ partials, sweep, limits, fundamental, numberOfPoints }: RoughnessConstructorOptions) {
        this._partials = new Partials(partials.series.value)
        this._sweep = new Partials((sweep ?? partials).series.value)
        this._fundamental = fundamental ?? 261.63
        this._pseudoOctave = new Tuning(partials).octave ?? { decimal: 2, ratio: "2:1" }
        this._numberOfPoints = numberOfPoints ?? 2000

        if (limits === undefined) {
            const lowLimit = 1 / this._pseudoOctave.decimal
            const highLimit = this._pseudoOctave.decimal ** 2
            limits = [lowLimit, highLimit]
        }

        this._limits = limits

        this._profile = this.roughnessProfile()
    }

    public get profile() {
        return this._profile;
    }

    public get limits() {
        return this._limits;
    }

    public get sweep() {
        return this._sweep;
    }

    public get partials() {
        return this._partials;
    }

    public get fundamental() {
        return this._fundamental;
    }

    public set fundamental(fundamental: number) {
        this._fundamental = fundamental;
    }

    private roughnessProfile = (): PointSeries => {
        const profile = new PointSeries()

        const sweepStep = (this.limits[1] - this.limits[0]) / this._numberOfPoints
        const staticPartials = new Partials(this._partials.series.value).shift(this._fundamental)

        for (let i = 0; i <= this._numberOfPoints; i++) {
            const currentStep = this.limits[0] + sweepStep * i

            const sweepPartials = new Partials(this._sweep.series.value).shift(this._fundamental * currentStep)

            const roughness = this.roughness(sweepPartials.include(staticPartials.series.value))

            profile.push([currentStep, roughness])
        }

        profile.normalize()

        return profile
    }

    private roughness(partials: Partials) {
        let roughness = 0
        const partialSeries = partials.series.value

        for (let i = 0; i < partialSeries.length; i++) {
            for (let j = i + 1; j < partialSeries.length; j++) {
                const minLoudness = this.loudness(Math.min(partialSeries[i][1], partialSeries[j][1]))
                if (minLoudness === 0) continue

                const minFrequency = partialSeries[i][0] * this._fundamental
                if (minFrequency === 0) continue

                const frequencyDifference = (partialSeries[j][0] - partialSeries[i][0]) * this._fundamental
                if (frequencyDifference === 0) continue


                // Plompt & Levelt roughness calculation
                const coefficient = frequencyDifference / (0.021 * minFrequency + 19)
                roughness += minLoudness * (Math.exp(-0.84 * coefficient) - Math.exp(-1.38 * coefficient))
            }
        }

        return roughness
    }

    private loudness(amplitude: number): number {
        return round(0.25 * 2 ** Math.log10(2E8 * amplitude))
    }
}
