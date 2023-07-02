<script lang="ts">
    import { AdditiveSynth } from '../xentonality/synth'
    import { KEYBOARD_KEYS } from '../xentonality/keyboard'
    import { spectrum } from '../state/stores.js'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let audioContext: AudioContext

    onMount(() => {
        audioContext = new AudioContext()

        synth = new AdditiveSynth({
            spectrum: $spectrum,
            audioContext,
        })

        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
    })

    $: {
        if (synth && $spectrum) {
            synth.update($spectrum)
        }
    }

    const keyDownHandler = (event: KeyboardEvent) => {
        if (event.repeat) return
        event.preventDefault()

        const key = KEYBOARD_KEYS.find((key) => key === event.key)
        if (key !== undefined) synth.play(key)
    }

    const keyUpHandler = (event: KeyboardEvent) => {
        if (event.repeat) return
        event.preventDefault()

        const key = KEYBOARD_KEYS.find((key) => key === event.key)
        if (key !== undefined) synth.release(key)
    }
</script>

<div id="additive-synth" />
