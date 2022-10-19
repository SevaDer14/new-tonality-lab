import { writable, derived, readable } from 'svelte/store';
import type { TSpectrumType } from 'src/xentonality/types';
import { generatePartials } from '../xentonality/spectrum'
import { calcDissonanceCurve } from '../xentonality/dissonance'

export const fundamental = writable(440);
export const numberOfPartials = writable(6);
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable(12)
export const pseudoOctave = writable(1200)


type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = readable<TSampleRate>(44100)
export const sampleDuration = writable(5)
export const sampleName = writable('sample')


export const partials = derived(
    [spectrumType, fundamental, numberOfPartials, edoSteps, pseudoOctave],
    ([$spectrumType, $fundamental, $numberOfPartials, $edoSteps, $pseudoOctave]) => generatePartials({ type: $spectrumType, fundamental: $fundamental, number: $numberOfPartials, pseudoOctave: $pseudoOctave, edo: $edoSteps })
);

export const dissonanceCurve = derived(
    partials,
    $partials => calcDissonanceCurve($partials)
);
