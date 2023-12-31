<script lang="ts">
    import { spectrum, synthSettings } from '../state/stores.js'
    import { AdditiveSynth } from '../synth'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let audioContext: AudioContext

    onMount(() => {
        audioContext = new AudioContext()
        synth = new AdditiveSynth({ spectrum: $spectrum, audioContext, adsr: $synthSettings.adsr })
        synth.setMasterGain($synthSettings.masterGain)

        window.synth = synth
    })

    $: {
        if (synth) {
            synth.update($spectrum)
        }
    }

    $: {
        if (synth) {
            synth.setMasterGain($synthSettings.masterGain)
            synth.updateAdsr($synthSettings.adsr)
        }
    }
</script>

<div id="new-tonality-synth" />
