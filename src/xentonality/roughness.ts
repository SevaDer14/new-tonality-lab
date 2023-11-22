import { round } from "./utils"
import { PointSeries, type PointSeriesValue } from "./pointSeries"
import { Tuning, type Ratio } from "./tuning"
import { Partials } from "./partials"

export type RoughnessConstructorOptions = {
    partials: PointSeriesValue,
    sweep?: PointSeriesValue,
    limits?: [number, number],
    fundamental?: number,
    numberOfPoints?: number
}

type RoughnessState = Required<RoughnessConstructorOptions> & {
    pseudoOctave: Ratio,
    profile: PointSeries,
}

export class Roughness {
    private _partials: PointSeriesValue
    private _sweep: PointSeriesValue
    private _pseudoOctave: Ratio
    private _numberOfPoints: number
    private _limits: [number, number]
    private _profile: PointSeries
    private _fundamental: number

    constructor(options: RoughnessConstructorOptions) {
        const { partials, sweep, fundamental, pseudoOctave, numberOfPoints, limits, profile } = this.init(options)

        this._partials = partials
        this._sweep = sweep
        this._fundamental = fundamental
        this._pseudoOctave = pseudoOctave
        this._numberOfPoints = numberOfPoints
        this._limits = limits
        this._profile = profile
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

    update(options: RoughnessConstructorOptions) {
        const { partials, sweep, fundamental, pseudoOctave, numberOfPoints, limits, profile } = this.init(options)
        this._partials = partials
        this._sweep = sweep
        this._fundamental = fundamental
        this._pseudoOctave = pseudoOctave
        this._numberOfPoints = numberOfPoints
        this._limits = limits
        this._profile = profile
    }

    private init(options: RoughnessConstructorOptions): RoughnessState {
        const partials = options.partials
        const sweep = options.sweep ?? options.partials
        const fundamental = options.fundamental ?? 261.63
        const pseudoOctave = new Tuning(partials).octave ?? { decimal: 2, ratio: "2:1" }
        const numberOfPoints = options.numberOfPoints ?? 2000
        const limits = options.limits ?? [1 / pseudoOctave.decimal, pseudoOctave.decimal ** 2]
        const profile = this.roughnessProfile({ limits, numberOfPoints, fundamental, sweep, partials })

        return {
            partials,
            sweep,
            fundamental,
            pseudoOctave,
            numberOfPoints,
            limits,
            profile,
        }
    }

    private roughnessProfile = ({ limits, numberOfPoints, fundamental, sweep, partials }: Pick<RoughnessState, "limits" | "numberOfPoints" | "fundamental" | "sweep" | "partials">): PointSeries => {
        const profile = new PointSeries()

        const sweepStep = (limits[1] - limits[0]) / numberOfPoints
        const staticPartials = partials.map(point => {
            point[0] *= fundamental
            return point
        })

        for (let i = 0; i <= numberOfPoints; i++) {
            const currentStep = limits[0] + sweepStep * i

            const sweepPartials = staticPartials.map(point => {
                point[0] *= currentStep
                return point
            })

            const combinedPartials = [staticPartials, sweepPartials].flat().sort((a, b) => a[0] - b[0])

            const roughness = this.roughness(combinedPartials, fundamental)

            profile.push([currentStep, roughness])
        }

        profile.normalize()

        return profile
    }

    private roughness(partials: PointSeriesValue, fundamental: number) {
        let roughness = 0

        for (let i = 0; i < partials.length; i++) {
            for (let j = i + 1; j < partials.length; j++) {
                const minLoudness = this.loudness(Math.min(partials[i][1], partials[j][1]))
                if (minLoudness === 0) continue

                const minFrequency = partials[i][0] * fundamental
                if (minFrequency === 0) continue

                const frequencyDifference = (partials[j][0] - partials[i][0]) * fundamental
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
