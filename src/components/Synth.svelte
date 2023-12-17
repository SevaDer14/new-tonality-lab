<script lang="ts">
    import { spectrum, pitch, masterGain } from '../state/stores.js'
    import { AdditiveSynth } from '../synth'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let audioContext: AudioContext

    onMount(() => {
        audioContext = new AudioContext()
        synth = new AdditiveSynth({ spectrum: $spectrum, audioContext })

        window.synth = synth
    })

    $: {
        if (synth) {
            synth.update($spectrum)
        }
    }

    $: {
        if (synth) {
            synth.setMasterGain($masterGain)
        }
    }

    $: {
        if (synth) {
            if ($pitch !== null) {
                synth.play({ pitch: $pitch, velocity: 0.1, voiceId: 'voice' })
            } else {
                synth.releaseAll()
            }
        }
    }
</script>

<div id="new-tonality-synth" />
