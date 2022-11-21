import { writable, derived, readable } from 'svelte/store';
import type { TSpectrumType } from 'src/xentonality/types';
import { generatePartials } from '../xentonality/spectrum'
import { calcDissonanceCurve } from '../xentonality/dissonance'

export const fundamental = writable(440);
export const numberOfPartials = writable(6);
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable(12)
export const pseudoOctave = writable(1200)

export const dissLimitMinFrequency = writable(20)
export const dissLimitMaxFrequency = writable(6000)
export const dissLimitMinAmplitude = writable(0.1)
export const dissLimitMaxAmplitude = writable(1)

type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = readable<TSampleRate>(44100)
export const sampleDuration = writable(5)
export const sampleName = writable('sample')


export const partials = derived(
    [spectrumType, fundamental, numberOfPartials, edoSteps, pseudoOctave],
    ([$spectrumType, $fundamental, $numberOfPartials, $edoSteps, $pseudoOctave]) => generatePartials({ type: $spectrumType, fundamental: $fundamental, number: $numberOfPartials, pseudoOctave: $pseudoOctave, edo: $edoSteps })
);

export const dissonanceCurve = derived(
    [partials, dissLimitMinFrequency, dissLimitMaxFrequency, dissLimitMinAmplitude, dissLimitMaxAmplitude],
    ([$partials, $dissLimitMinFrequency, $dissLimitMaxFrequency, $dissLimitMinAmplitude, $dissLimitMaxAmplitude]) => calcDissonanceCurve({
        partials: $partials,
        limits: {
            frequency: {
                min: $dissLimitMinFrequency,
                max: $dissLimitMaxFrequency,
            },
            amplitude: {
                min: $dissLimitMinAmplitude,
                max: $dissLimitMaxAmplitude,
            }
        }
    })
);
