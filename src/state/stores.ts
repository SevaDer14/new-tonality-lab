import { writable, derived } from 'svelte/store';
import { generatePartials } from '../xentonality/spectrum'
import { calcDissonanceCurve } from '../xentonality/dissonance'

type TSpectrumType = 'harmonic' | 'edo'
export const fundamental = writable('100');
export const numberOfPartials = writable('6');
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable('12')


type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = writable<TSampleRate>(44100)
export const sampleDuration = writable('10')
export const sampleName = writable('xenple')


export const partials = derived(
    [fundamental, numberOfPartials],
    ([$fundamental, $numberOfPartials]) => generatePartials({ type: 'harmonic', fundamental: Number($fundamental), number: Number($numberOfPartials) })
);

export const dissonanceCurve = derived(
    partials,
    $partials => calcDissonanceCurve($partials, 10)
);
