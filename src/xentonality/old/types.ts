export type TPartial = { ratio: number, frequency: number, amplitude: number, loudness: number }

export type TPartials = Array<TPartial>

export type TSpectrumType = 'harmonic' | 'stretched' | 'edo'

export type TSpectrum = {
    partials: TPartials,
    intrinsicDissonance?: number,
    dissonanceCurve?: unknown,
    harmonicDissonanceCurve?: unknown,
    relatedScale?: unknown
}



export type TPointX = { cents: number, Hz: number, ratio: number }

export type TPointY = { value: number }

export type TPlotPoint = TPointX & TPointY

export type TPlotCurve = TPlotPoint[]

export type TDissonanceCurve = { curve: TPlotCurve, pseudoOctave: TPointX }

export type TMinMax = { min?: number, max?: number }

export type TSweepType = 'same' | 'harmonic'

export type TTweak = { ratio: number, amplitude: number }

export type TTweaks = TTweak[]

export type TDissonanceCurveOptions = {
    partials: TPartials,
    numberOfPoints: number,
    sweepStep: Pick<TPointX, "cents">,
    sweepType?: TSweepType, // TODO not tested
    sweepHarmonicPartials?: number, // TODO not tested
    startPoint: Pick<TPointX, "cents">,
    detrended?: boolean,
    normalized?: boolean
}

export type TDissonanceCurveMultipleOctavesOptions = {
    partials: TPartials,
    pseudoOctave?: TPointX,
    octaves?: [number, number], // TODO not tested
    points?: number,
    sweepType?: TSweepType, // TODO not tested
    sweepHarmonicPartials?: number, // TODO not tested
    detrended?: boolean, // TODO not tested
    limits?: {
        index?: TMinMax // TODO not tested
        frequency?: TMinMax
        amplitude?: TMinMax
    }
}
