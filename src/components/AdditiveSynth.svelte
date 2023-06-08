<script lang="ts">
    import { spectrum } from '../state/stores.js'
    import { AdditiveSynth } from '../xentonality/synth'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let audioCtx: AudioContext
    let recorderNode: MediaStreamAudioDestinationNode

    let noteStack: number[] = []

    const baseNote = 261.63 // C4
    const scale: number[] = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8, 2]
    const keyboard: string[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i']
    const noteMap: Map<string, number> = new Map(keyboard.map((key, i) => [key, scale[i] * baseNote]))

    onMount(() => {
        audioCtx = new AudioContext()
        recorderNode = audioCtx.createMediaStreamDestination()
        synth = new AdditiveSynth($spectrum.partials, audioCtx)
        synth.connect(audioCtx.destination)

        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)
    })

    $: {
        if (synth !== undefined && synth.getPartials() !== $spectrum.partials.series.value) {
            synth.updatePartials($spectrum.partials)
        }
    }

    $: {
        if (synth && noteStack) {
            if (noteStack.length > 0) {
                synth.play(noteStack[0])
            } else {
                synth.stop()
            }
        }
    }


    const keyDownHandler = (event: KeyboardEvent) => {
        event.preventDefault()

        const note = noteMap.get(event.key)
        if (note === undefined || note === noteStack[0]) return

        noteStack = [note, ...noteStack.filter((n) => n !== note)]
    }

    const keyUpHandler = (event: KeyboardEvent) => {
        event.preventDefault()

        const note = noteMap.get(event.key)
        if (note === undefined) return

        noteStack = noteStack.filter((n) => n !== note)
    }
</script>

<div id="additive-synth" />
