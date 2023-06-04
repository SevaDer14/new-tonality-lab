import { Partials, type PartialsGenerateOptions } from "./partials"


export type SpectrumOptions = Required<PartialsGenerateOptions>

export class Spectrum {
    private _partials: Partials
    private _options: SpectrumOptions

    public get partials() {
        return this._partials.value;
    }

    public get options() {
        return this._options;
    }

    constructor(options: SpectrumOptions) {
        this._options = options
        this._partials = new Partials().generate(options)
    }

    recalculate(newOptions: Partial<SpectrumOptions>) {
        Object.assign(this._options, newOptions)
        this._partials.generate(this._options)

        return this
    }
}
