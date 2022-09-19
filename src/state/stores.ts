import { writable } from 'svelte/store';

type TSpectrumType = 'harmonic' | 'edo'
export const fundamental = writable(440);
export const numberOfPartials = writable(6);
export const spectrumType = writable<TSpectrumType>('harmonic');
export const edoSteps = writable(12)


type TSampleRate = 44100 | 48000 | 96000
export const sampleRate = writable<TSampleRate>(44100)
export const sampleDuration = writable(10)
export const sampleName = writable('xenple')
