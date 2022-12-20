import { writable, derived, readable } from 'svelte/store';
import type { TSpectrumType, TSweepType, TTweaks } from 'src/xentonality/types';
import { generatePartials, applyTweaks } from '../xentonality/spectrum'
import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'
import { centsToRatio } from '../xentonality/utils';

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
export const tweaks = writable<TTweaks>([])
export const tweaksEnabled = writable(true)

export const dissLimitMinIndex = writable(0)
export const dissLimitMaxIndex = writable(8)
export const dissonanceCurveSweepType = writable<TSweepType>('same')
export const dissonanceCurveDetrend = writable(false)
export const dissonanceCurveSweepHarmonicPartials = writable(6)
export const dissonanceCurveEDOMarks = writable(12)
export const show12EDO = writable(false)

type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = readable<TSampleRate>(44100)
export const sampleDuration = writable(5)
export const sampleName = writable('sample')


export const generatedPartials = derived(
    [spectrumType, fundamental, numberOfPartials, edoSteps, pseudoOctave, amplitudeSlope],
    ([
        $spectrumType,
        $fundamental,
        $numberOfPartials,
        $edoSteps,
        $pseudoOctave,
        $amplitudeSlope,
    ]) => generatePartials({
        type: $spectrumType,
        slope: $amplitudeSlope,
        fundamental: $fundamental,
        number: $numberOfPartials,
        pseudoOctave: $pseudoOctave,
        edo: $edoSteps
    })
);


export const partials = derived(
    [generatedPartials, tweaks, tweaksEnabled],
    ([
        $generatedPartials,
        $tweaks,
        $tweaksEnabled
    ]) => applyTweaks({
        partials: $generatedPartials,
        tweaks: $tweaksEnabled ? $tweaks : []
    })
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
    [partials, dissCurveLimits, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials, pseudoOctave],
    ([$partials, $dissCurveLimits, $dissonanceCurveDetrend, $dissonanceCurveSweepType, $dissonanceCurveSweepHarmonicPartials, $pseudoOctave]) => calcDissonanceCurveMultipleOctaves({
        partials: $partials,
        sweepType: $dissonanceCurveSweepType,
        sweepHarmonicPartials: $dissonanceCurveSweepHarmonicPartials,
        pseudoOctave: { cents: $pseudoOctave, ratio: centsToRatio($pseudoOctave), Hz: centsToRatio($pseudoOctave) * $partials[0].frequency },
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
        pseudoOctave: { cents: $pseudoOctave, ratio: centsToRatio($pseudoOctave), Hz: centsToRatio($pseudoOctave) * $partials[0].frequency },
        limits: $dissCurveLimits,
        detrended: $dissonanceCurveDetrend,
    })
);
