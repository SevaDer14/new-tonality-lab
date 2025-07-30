<script lang="ts">
    import { AdditiveSynth, type Spectrum } from 'new-tonality-web-synth'
    import { onMount } from 'svelte'

    export let spectrum: Spectrum
    export let active = false

    let synth: AdditiveSynth
    let audioContext: AudioContext

    onMount(() => {
        audioContext = new AudioContext()

        synth = new AdditiveSynth({
            spectrum,
            audioContext,
            adsr: {
                attack: 0,
                sustain: 1,
                decay: 1,
                release: 100,
            },
        })
        synth.setMasterGain(0.25)
    })

    $: {
        if (spectrum.length > 0 && synth) {
            synth.update(spectrum)
        }
    }

    $: {
        if (synth) {
            if (active) {
                synth.play({ pitch: 1, velocity: 1, voiceId: 'context+complement' })
            } else {
                synth.releaseAll()
            }
        }
    }
</script>
