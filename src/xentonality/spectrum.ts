import { errors } from "./errorMessages"
import { Partials, type PartialsGenerateOptions } from "./partials"
import type { PointSeriesValue } from "./pointSeries"
import { PointSeries } from "./pointSeries"


export type SpectrumOptions = Required<PartialsGenerateOptions>

// TODO: tweaks not tested
export class Spectrum {
    private _options: SpectrumOptions
    private _nonTweakedPartials: Partials
    private _tweaks: PointSeriesValue
    private _partials: Partials

    public get partials() {
        return this._partials;
    }

    public get options() {
        return this._options;
    }

    public get tweaks() {
        return this._tweaks;
    }

    public get nonTweakedPartials() {
        return this._nonTweakedPartials;
    }

    constructor(options: SpectrumOptions, tweaks?: PointSeriesValue) {
        if (tweaks !== undefined && tweaks.length !== options.numberOfPartials) throw new Error(errors.spectrum.tweaksShouldHaveTheSameLengthAsSpectrum)

        this._options = options
        this._nonTweakedPartials = new Partials().generate(options)

        this._tweaks = tweaks || new PointSeries().fill(this._options.numberOfPartials, () => [1, 1]).value

        this._partials = this.applyTweaks()
    }

    tweak(newTweaks: PointSeriesValue) {
        if (newTweaks.length !== this._nonTweakedPartials.series.value.length) throw new Error(errors.spectrum.tweaksShouldHaveTheSameLengthAsSpectrum)

        this._tweaks = newTweaks
        this._partials = this.applyTweaks()

        return this
    }

    recalculate(newOptions: Partial<SpectrumOptions>) {
        Object.assign(this._options, newOptions)
        this._nonTweakedPartials.generate(this._options)

        this._nonTweakedPartials.series.value.forEach((partial, index) => {
            if (this._tweaks[index] === undefined) {
                this._tweaks.push([1, 1])
            }
        })

        this._partials = this.applyTweaks()

        return this
    }

    private applyTweaks(): Partials {
        return new Partials(this._nonTweakedPartials.series.value).tweak(this._tweaks)
    }
}
