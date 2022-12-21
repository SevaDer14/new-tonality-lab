<script lang="ts">
    import Panel from './basic/Panel.svelte'
    import Range from './basic/Range.svelte'
    import Checkbox from './basic/Checkbox.svelte'
    import Button from './basic/Button.svelte'
    import TextField from './basic/TextField.svelte'
    import { fundamental, sampleDuration, sampleName, partials, synthPartials, dissonanceCurve, dissCurveLimits, notes } from '../state/stores.js'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import { AdditiveSynth } from '../xentonality/synth'
    import { parseCurveToFileFormat } from '../xentonality/utils'
    import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder/dist/WavFileEncoder.js'
    import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'
    import { onMount } from 'svelte'

    let synth: AdditiveSynth
    let audioCtx: AudioContext
    let recorderNode: MediaStreamAudioDestinationNode
    let downloadingZip = false
    let playing = false
    let randomPhaseExport = true
    let noteFrequencyC4 = true
    let customNoteFrequency = $fundamental

    onMount(() => {
        audioCtx = new AudioContext()
        recorderNode = audioCtx.createMediaStreamDestination()
        synth = new AdditiveSynth($synthPartials, audioCtx)
        synth.connect(audioCtx.destination)

        document.addEventListener('keydown', keyDownHandler)
    })

    $: {
        if (synth !== undefined) {
            synth.updatePartials($synthPartials)
        }
    }

    const keyDownHandler = (event: KeyboardEvent) => {
        if (document.activeElement?.tagName !== 'BODY' || (event.key !== 'SPACE' && event.key !== ' ')) return
        event.preventDefault()

        if (playing === true) {
            releaseNote()
        } else { 
            playNote()
        }
    }

    const handleC4CheckboxChange = (value: boolean) => {
        noteFrequencyC4 = value

        if (value === true) {
            $fundamental = $notes.C4
        } else {
            handleFrequencyInput(customNoteFrequency)
        }
    }

    const handleFrequencyInput = (value: number) => {
        if (noteFrequencyC4 === false) {
            $fundamental = value
            customNoteFrequency = value
        }
    }

    const playNote = () => {
        synth.start()
        playing = true
    }

    const releaseNote = () => {
        synth.stop(audioCtx.currentTime)
        playing = false
    }

    const downloadZip = () => {
        downloadingZip = true

        // need to give svelte time to update DOM before generating sample
        // as it blocks the render thread
        setTimeout(async () => {
            const sampleBuffer = await synth.generateSample($sampleDuration, randomPhaseExport)
            const wavFileData = encodeWavFileFromAudioBuffer(sampleBuffer, 1 /*32 bit floaing point*/)
            const sampleBlob = new Blob([wavFileData], { type: 'audio/wav' })

            const zipFileWriter = new BlobWriter()
            const sampleFile = new BlobReader(sampleBlob)
            const partialsFile = new TextReader(parseCurveToFileFormat($partials))
            const dissonanceCurveFile = new TextReader(
                parseCurveToFileFormat(
                    calcDissonanceCurveMultipleOctaves({
                        partials: $partials,
                        limits: $dissCurveLimits,
                        pseudoOctave: $dissonanceCurve.pseudoOctave,
                    }).curve
                )
            )

            if (partialsFile !== undefined && dissonanceCurveFile !== undefined && sampleFile !== undefined) {
                const zipWriter = new ZipWriter(zipFileWriter)

                await zipWriter.add(`${$sampleName}_spectrum.txt`, partialsFile)
                await zipWriter.add(`${$sampleName}_dissonance_curve.txt`, dissonanceCurveFile)
                await zipWriter.add(`${$sampleName}.wav`, sampleFile)
                await zipWriter.close()

                const zipFileBlob = await zipFileWriter.getData()

                const link = document.createElement('a')
                link.href = URL.createObjectURL(zipFileBlob)
                link.download = `${$sampleName}.zip`
                link.click()
                link.remove()

                downloadingZip = false
            }
        }, 10)
    }
</script>

<Panel title="export">
    <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

    <Checkbox label="Note C4 = 261.63 Hz" onChange={handleC4CheckboxChange} checked />

    <Range label="Note Frequency (Hz)" disabled={noteFrequencyC4 === true} min={55} max={880} onInput={handleFrequencyInput} initialValue={$fundamental} />

    <Checkbox label="Random phase" onChange={(value) => (randomPhaseExport = value)} checked={randomPhaseExport === true} />

    <TextField label="File name" initialValue={$sampleName} onInput={(value) => ($sampleName = value)} />

    <div class="flex mt-auto justify-center">
        {#if playing === true}
            <Button class="text-yellow border-yellow-65 bg-yellow-5" onClick={releaseNote}>Stop</Button>
        {:else}
            <Button class="text-green border-green-65 bg-green-5" onClick={playNote}>Play</Button>
        {/if}

        <Button class="text-blue border-blue-65 bg-blue-5" onClick={() => downloadZip()} disabled={downloadingZip === true}>{downloadingZip === true ? 'Processing' : 'Download'}</Button>
    </div>
    <p class="text-xs text-white-25 text-center">Press "Space" to play or stop</p>
</Panel>
