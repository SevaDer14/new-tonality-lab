import { writable } from 'svelte/store';
import type { Spectrum } from '../synth';

export const spectrum = writable<Spectrum>([]);
export const pitch = writable<number | null>(null);
export const masterGain = writable<number>(0.7);
