import { getSetharesDissonance, SETHARES_DISSONANCE_PARAMS, transpose, type Spectrum } from './utils'

export type DissonanceCurveOptions = Partial<typeof SETHARES_DISSONANCE_PARAMS> & {
    context: Spectrum
    complement: Spectrum
    step?: number
    rangeMin?: number
    rangeMax?: number
}

export class DissonanceCurve {
    private _data: Map<number, number> = new Map()

    public readonly rangeMin: NonNullable<DissonanceCurveOptions['rangeMin']>
    public readonly rangeMax: NonNullable<DissonanceCurveOptions['rangeMax']>
    public readonly step: NonNullable<DissonanceCurveOptions['step']>
    public readonly context: DissonanceCurveOptions['context']
    public readonly complement: DissonanceCurveOptions['complement']
    public readonly maxDissonance: number = 0
    public readonly change: number = 0

    constructor(opts: DissonanceCurveOptions) {
        const { context, complement, rangeMin, rangeMax, step, ...dissonanceParams } = opts

        this.context = context
        this.complement = complement

        this.rangeMin = rangeMin ?? 0
        this.rangeMax = rangeMax ?? 1200
        this.step = step ?? 1

        if (this.rangeMin > this.rangeMax) throw Error('rangeMin should be less or equal to rangeMax')
        if (this.step <= 0) throw Error('precision should be greater than zero')

        for (let cent = this.rangeMin; cent <= this.rangeMax; cent += this.step) {
            const dissonance = getSetharesDissonance(this.context, transpose(this.complement, cent), dissonanceParams)

            if (dissonance > this.maxDissonance) this.maxDissonance = dissonance

            this._data.set(cent, dissonance)
        }
    }

    public get points() {
        return Array.from(this._data.entries()).sort((a, b) => a[0] - b[0])
    }

    public get(cent: number) {
        return this._data.get(cent)
    }

    private getRowString(row: Array<number | string>) {
        if (row.length === 0) return ''

        let result = `${row[0]}`

        for (let i = 1; i < row.length; i += 1) {
            result += `\t${row[i]}`
        }

        return result
    }

    public toFileString() {
        if (this._data.size === 0) return ''

        const headerRow = this.getRowString(['Interval (cents)', 'Sensory dissonance'])

        let result = headerRow + '\n'

        for (const point of this.points) {
            result += this.getRowString(point)
        }

        return result
    }
}
