import { writable } from 'svelte/store';
import { Spectrum, type SpectrumOptions } from '../xentonality';

export function createSpectrum(defaultOptions: SpectrumOptions) {
    let spectrum = new Spectrum(defaultOptions)

    const { subscribe, update } = writable(spectrum)

    function recalculate(newOptions: Partial<SpectrumOptions>) {
        update(() => spectrum.recalculate(newOptions))
    }

    return {
        subscribe,
        recalculate,
    }
}
