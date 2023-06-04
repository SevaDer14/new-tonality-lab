import { writable, derived, readable } from 'svelte/store';
import type { TSpectrumType, TSweepType, TTweaks } from 'src/xentonality/old/types';
import { createSpectrum } from './custom';
// import { generatePartials, applyTweaks, shiftOnRatio } from '../xentonality/spectrum'
// import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'
// import { centsToRatio } from '../xentonality/utils';

type TSampleRate = 44100 | 48000 | 96000

const C4 = 261.63

export const notes = readable({
    C4: C4
})

export const fundamental = writable(C4);
export const tweaks = writable<TTweaks>([])
export const tweaksEnabled = writable(true)

export const sweepRatio = writable(1)
export const showSweep = writable(false)

export const dissLimitMinIndex = writable(0)
export const dissLimitMaxIndex = writable(8)
export const dissonanceCurveSweepType = writable<TSweepType>('same')
export const dissonanceCurveDetrend = writable(false)
export const dissonanceCurveSweepHarmonicPartials = writable(6)
export const dissonanceCurveEDOMarks = writable(12)
export const show12EDO = writable(false)

export const sampleRate = readable<TSampleRate>(44100)
export const sampleDuration = writable(5)
export const sampleName = writable('sample')

export const spectrum = createSpectrum({
    type: "harmonic",
    numberOfPartials: 6,
    amplitudeProfile: 1,
    octaveRatio: 2,
    steps: 12,
    ratioLimit: 1000,
})
// export const sweepSpectrum = createSpectrum()



// export const partials = derived(
//     [generatedPartials, tweaks, tweaksEnabled],
//     ([
//         $generatedPartials,
//         $tweaks,
//         $tweaksEnabled
//     ]) => applyTweaks({
//         partials: $generatedPartials,
//         tweaks: $tweaksEnabled ? $tweaks : []
//     })
// );

// export const sweepPartials = derived(
//     [partials, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials, sweepRatio, fundamental],
//     ([
//         $partials,
//         $dissonanceCurveSweepType,
//         $dissonanceCurveSweepHarmonicPartials,
//         $sweepRatio,
//         $fundamental
//     ]) => $dissonanceCurveSweepType === 'same'
//             ? shiftOnRatio($partials, $sweepRatio)
//             : shiftOnRatio(generatePartials({ type: 'harmonic', fundamental: $fundamental, number: $dissonanceCurveSweepHarmonicPartials, slope: 1 }), $sweepRatio)
// )

// export const synthPartials = derived(
//     [partials, sweepPartials, showSweep],
//     ([$partials, $sweepPartials, $showSweep]) => $showSweep
//         ? [...$partials, ...$sweepPartials]
//         : $partials
// )

// export const dissCurveLimits = derived(
//     [dissLimitMinIndex, dissLimitMaxIndex],
//     ([$dissLimitMinIndex, $dissLimitMaxIndex]) => ({
//         index: {
//             min: $dissLimitMinIndex,
//             max: $dissLimitMaxIndex,
//         },
//     })
// )

// export const dissonanceCurveHighRes = derived(
//     [partials, dissCurveLimits, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials, pseudoOctave],
//     ([$partials, $dissCurveLimits, $dissonanceCurveDetrend, $dissonanceCurveSweepType, $dissonanceCurveSweepHarmonicPartials, $pseudoOctave]) => calcDissonanceCurveMultipleOctaves({
//         partials: $partials,
//         sweepType: $dissonanceCurveSweepType,
//         sweepHarmonicPartials: $dissonanceCurveSweepHarmonicPartials,
//         pseudoOctave: { cents: $pseudoOctave, ratio: centsToRatio($pseudoOctave), Hz: centsToRatio($pseudoOctave) * $partials[0].frequency },
//         octaves: [0, 1],
//         limits: $dissCurveLimits,
//         detrended: $dissonanceCurveDetrend,
//     })
// );

// export const dissonanceCurve = derived(
//     [partials, dissCurveLimits, pseudoOctave, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials],
//     ([$partials, $dissCurveLimits, $pseudoOctave, $dissonanceCurveDetrend, $dissonanceCurveSweepType, $dissonanceCurveSweepHarmonicPartials]) => calcDissonanceCurveMultipleOctaves({
//         partials: $partials,
//         points: $pseudoOctave > 1200 ? Math.ceil($pseudoOctave / 12) : 100,
//         sweepType: $dissonanceCurveSweepType,
//         sweepHarmonicPartials: $dissonanceCurveSweepHarmonicPartials,
//         pseudoOctave: { cents: $pseudoOctave, ratio: centsToRatio($pseudoOctave), Hz: centsToRatio($pseudoOctave) * $partials[0].frequency },
//         limits: $dissCurveLimits,
//         detrended: $dissonanceCurveDetrend,
//     })
// );
