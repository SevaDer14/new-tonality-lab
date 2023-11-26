<script lang="ts">
    import { mainPan, sweepPan, playing, partials, sweepPartials } from '../state/stores.js'
    import { AdditiveSynth } from '../xentonality/synth'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let sweepSynth: AdditiveSynth
    let audioCtx: AudioContext

    onMount(() => {
        audioCtx = new AudioContext()
        synth = new AdditiveSynth($partials, audioCtx)
        sweepSynth = new AdditiveSynth($sweepPartials, audioCtx)
        synth.connect(audioCtx.destination)
        sweepSynth.connect(audioCtx.destination)

        window.synth = synth
    })

    $: {
        if (synth !== undefined) {
            synth.updatePartials($partials)
            sweepSynth.updatePartials($sweepPartials)
            synth.setPan($mainPan)
            sweepSynth.setPan($sweepPan)
        }
    }

    $: {
        if (synth !== undefined) {
            if ($playing) {
                synth.start()
            } else {
                synth.stop(audioCtx.currentTime)
            }
        }
    }
</script>

<div id="new-tonality-synth" />
