<script lang="ts">
    import { AdditiveSynth, type Spectrum } from 'new-tonality-web-synth'
    import { onMount } from 'svelte'

    export let spectrum: Spectrum
    export let active = false

    const voiceId = 'context+complement'

    let synth: AdditiveSynth
    let audioContext: AudioContext

    onMount(() => {
        audioContext = new AudioContext()

        synth = new AdditiveSynth({
            spectrum,
            audioContext,
            adsr: {
                attack: 0.1,
                sustain: 1,
                decay: 0,
                release: 1,
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
                synth.play({ pitch: 1, velocity: 1, voiceId })
            } else {
                synth.release(voiceId)
            }
        }
    }
</script>
