<script lang="ts">
    import Panel from './Panel.svelte'
    import Range from './Range.svelte'
    import Checkbox from './Checkbox.svelte'
    import Button from './Button.svelte'
    import { fundamental, sampleDuration, sampleName, partials, dissCurveLimits } from '../state/stores.js'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import { AdditiveSynth } from '../xentonality/synth'
    import { parseCurveToFileFormat } from '../xentonality/utils'
    import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder/dist/WavFileEncoder.js'
    import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'
    import { onMount } from 'svelte'
    import TextField from './TextField.svelte'

    let synth: AdditiveSynth
    let audioCtx: AudioContext
    let recorderNode: MediaStreamAudioDestinationNode
    let downloadingZip = false
    let playing = false
    let randomPhaseExport = false

    onMount(() => {
        audioCtx = new AudioContext()
        recorderNode = audioCtx.createMediaStreamDestination()
        synth = new AdditiveSynth($partials, audioCtx)
        synth.connect(audioCtx.destination)
    })

    $: {
        if (synth !== undefined) {
            synth.updatePartials($partials)
        }
    }

    const playSample = () => {
        synth.start()
        playing = true
    }

    const stopSample = () => {
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
    <Range label="Note Frequency (Hz)" min={55} max={880} onInput={(value) => ($fundamental = value)} initialValue={$fundamental} />

    <Checkbox label="Random phase" onChange={(value) => (randomPhaseExport = value)} checked />

    <TextField label="File name" initialValue={$sampleName} onInput={(value) => $sampleName = value} />

    <div class="flex mt-auto justify-center">
        {#if playing === true}
            <Button color="yellow" onClick={stopSample}>Stop</Button>
        {:else}
            <Button color="green" onClick={playSample}>Play</Button>
        {/if}

        <Button color="blue" onClick={() => downloadZip()} disabled={downloadingZip === true}>{downloadingZip === true ? 'Processing...' : 'Download'}</Button>
    </div>
</Panel>
