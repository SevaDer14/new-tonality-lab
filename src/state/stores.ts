import { writable, derived } from 'svelte/store';
import type { TSpectrumType } from 'src/xentonality/types';
import { generatePartials, partialsToSpectrum } from '../xentonality/spectrum'
import { calcDissonanceCurve } from '../xentonality/dissonance'

export const fundamental = writable(440);
export const numberOfPartials = writable(6);
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable(12)
export const stretch = writable(2)


type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = writable<TSampleRate>(44100)
export const sampleDuration = writable(10)
export const sampleName = writable('sample')


export const partials = derived(
    [spectrumType, fundamental, numberOfPartials, edoSteps, stretch],
    ([$spectrumType, $fundamental, $numberOfPartials, $edoSteps, $stretch]) => generatePartials({ type: $spectrumType, fundamental: $fundamental, number: $numberOfPartials, stretch: $stretch, edo: $edoSteps })
);

export const spectrum = derived(
    partials,
    $partials => partialsToSpectrum({ partials: $partials })
);

export const dissonanceCurve = derived(
    partials,
    $partials => calcDissonanceCurve($partials)
);
