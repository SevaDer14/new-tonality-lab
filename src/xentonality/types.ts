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
