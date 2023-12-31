import { writable } from 'svelte/store'
import type { Tweak } from '../xentonality/spectrum'
import type { ADSR } from '../synth'

export type Seed = {
    length: number
    stretch: number
    start: number
    slope: number
    amplitude: number
    transpose: number
}

export type Layer = {
    type: 'harmonic'
    seed: Seed
    tweaks: {
        enabled: boolean
        value: Tweak[]
    }
}

type Tweaks = {
    enabled: boolean
    value: Tweak[]
}

const DEFAULT_SEED: Seed = {
    length: 6,
    stretch: 1,
    start: 1,
    slope: 1,
    amplitude: 1,
    transpose: 1,
}
const DEFAULT_TWEAK: Tweak = { rate: 1, amplitude: 1 }

function getDefaultLayer(): Layer {
    return {
        type: 'harmonic',
        seed: DEFAULT_SEED,
        tweaks: {
            enabled: true,
            value: Array(DEFAULT_SEED.length).fill({ ...DEFAULT_TWEAK }),
        },
    }
}

export function createSynthSettings() {
    const { subscribe, update } = writable({
        layers: [getDefaultLayer()],
        masterGain: 0.75,
        adsr: {
            attack: 0.03,
            decay: 1.6,
            sustain: 0.1,
            release: 3,
        },
    })

    function setMasterGain(value: number) {
        update((state) => ({ ...state, masterGain: value }))
    }

    function newLayer() {
        update((state) => {
            const layers = [...state.layers, getDefaultLayer()]

            return { ...state, layers }
        })
    }

    function updateSeed(layerIndex: number, newSeed: Partial<Seed>) {
        update((state) => {
            if (!state.layers[layerIndex]) throw new Error(`Cannot update seed: layer with index ${layerIndex} not found!`)

            const newState = { ...state }
            const updatedSeed = { ...newState.layers[layerIndex].seed, ...newSeed }

            newState.layers[layerIndex].seed = updatedSeed

            return newState
        })
    }

    function updateTweaks(layerIndex: number, newTweaks: Partial<Tweaks>) {
        update((state) => {
            if (!state.layers[layerIndex]) throw new Error(`Cannot update tweaks: layer with index ${layerIndex} not found!`)

            const newState = { ...state }
            const updatedTweaks = { ...newState.layers[layerIndex].tweaks, ...newTweaks }

            newState.layers[layerIndex].tweaks = updatedTweaks

            return newState
        })
    }

    function updateTweakValue(layerIndex: number, tweakIndex: number, newValue: Tweak) {
        update((state) => {
            if (!state.layers[layerIndex]) throw new Error(`Cannot update tweak value: layer with index ${layerIndex} not found!`)
            if (!state.layers[layerIndex].tweaks.value[tweakIndex]) throw new Error(`Cannot update tweak value: tweak with index ${tweakIndex} not found!`)

            const newState = { ...state }

            const updatedTweak = { ...newState.layers[layerIndex].tweaks.value[tweakIndex], ...newValue }

            newState.layers[layerIndex].tweaks.value[tweakIndex] = updatedTweak

            return newState
        })
    }

    function deleteLayer(layerIndex: number) {
        update((state) => {
            if (!state.layers[layerIndex]) throw new Error(`Cannot delete layer: layer with index ${layerIndex} not found!`)
            if (state.layers.length < 2) throw new Error(`Cannot delete layer: there should be more than one layer for the layer to be deleted!`)

            return { ...state, layers: state.layers.toSpliced(layerIndex, 1) }
        })
    }

    function setAdsr(adsr: Partial<ADSR>) {
        update((state) => {
            return { ...state, adsr: { ...state.adsr, ...adsr } }
        })
    }

    return {
        subscribe,
        setMasterGain,
        newLayer,
        deleteLayer,
        updateSeed,
        updateTweaks,
        updateTweakValue,
        setAdsr,
        adsr: ({ attack, decay, sustain, release }: ADSR) => ({
            attack,
            decay,
            sustain,
            release,
        }),
    }
}
