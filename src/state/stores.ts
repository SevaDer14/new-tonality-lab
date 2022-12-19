import { writable, derived, readable } from 'svelte/store';
import type { TSpectrumType, TSweepType } from 'src/xentonality/types';
import { generatePartials } from '../xentonality/spectrum'
import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'

const C4 = 261.63

export const notes = readable({
    C4: C4
})

export const fundamental = writable(C4);
export const numberOfPartials = writable(6);
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable(12)
export const pseudoOctave = writable(1200)
export const amplitudeSlope = writable(1)

export const dissLimitMinIndex = writable(0)
export const dissLimitMaxIndex = writable(8)
export const dissonanceCurveSweepType = writable<TSweepType>('same')
export const dissonanceCurveDetrend = writable(false)
export const dissonanceCurveSweepHarmonicPartials = writable(6)

type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = readable<TSampleRate>(44100)
export const sampleDuration = writable(5)
export const sampleName = writable('sample')


export const partials = derived(
    [spectrumType, fundamental, numberOfPartials, edoSteps, pseudoOctave, amplitudeSlope],
    ([$spectrumType, $fundamental, $numberOfPartials, $edoSteps, $pseudoOctave, $amplitudeSlope]) => generatePartials({ type: $spectrumType, slope: $amplitudeSlope, fundamental: $fundamental, number: $numberOfPartials, pseudoOctave: $pseudoOctave, edo: $edoSteps })
);

export const dissCurveLimits = derived(
    [dissLimitMinIndex, dissLimitMaxIndex],
    ([$dissLimitMinIndex, $dissLimitMaxIndex]) => ({
        index: {
            min: $dissLimitMinIndex,
            max: $dissLimitMaxIndex,
        },
    })
)

export const dissonanceCurveHighRes = derived(
    [partials, dissCurveLimits, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials],
    ([$partials, $dissCurveLimits, $dissonanceCurveDetrend, $dissonanceCurveSweepType, $dissonanceCurveSweepHarmonicPartials]) => calcDissonanceCurveMultipleOctaves({
        partials: $partials,
        sweepType: $dissonanceCurveSweepType,
        sweepHarmonicPartials: $dissonanceCurveSweepHarmonicPartials,
        octaves: [0, 1],
        limits: $dissCurveLimits,
        detrended: $dissonanceCurveDetrend,
    })
);

export const dissonanceCurve = derived(
    [partials, dissCurveLimits, pseudoOctave, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials],
    ([$partials, $dissCurveLimits, $pseudoOctave, $dissonanceCurveDetrend, $dissonanceCurveSweepType, $dissonanceCurveSweepHarmonicPartials]) => calcDissonanceCurveMultipleOctaves({
        partials: $partials,
        points: $pseudoOctave > 1200 ? Math.ceil($pseudoOctave / 12) : 100,
        sweepType: $dissonanceCurveSweepType,
        sweepHarmonicPartials: $dissonanceCurveSweepHarmonicPartials,
        limits: $dissCurveLimits,
        detrended: $dissonanceCurveDetrend,
    })
);
