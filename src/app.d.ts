import type { AdditiveSynth } from './xentonality/synth'

declare global {
    interface Window {
        synth?: AdditiveSynth
    }
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
}
