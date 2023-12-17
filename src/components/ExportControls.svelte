<script lang="ts">
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
    import Checkbox from './Checkbox.svelte'
    import Button from './Button.svelte'
    import TextField from './TextField.svelte'
    import { sampleDuration, sampleName, partials, dissonanceCurve, dissCurveLimits } from '../state/stores-old.js'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import { parseCurveToFileFormat } from '../xentonality/utils'
    import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder/dist/WavFileEncoder.js'
    import { calcDissonanceCurveMultipleOctaves } from '../xentonality/dissonance'

    type ExportState = 'cannotExport' | 'canExport' | 'exporting'

    let state: ExportState = 'canExport'
    let randomPhaseExport = true

    const downloadZip = () => {
        if (!window.synth) {
            state = 'cannotExport'
            return
        }

        const synth = window.synth
        state = 'exporting'

        // need to give svelte time to update DOM before generating sample
        // as it blocks the render thread, need to refactor to Web Worker
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

                if (synth) {
                    state = 'canExport'
                } else {
                    state = 'cannotExport'
                }
            }
        }, 10)
    }
</script>

<Controls title="export">
    <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

    <Checkbox label="Random phase" onChange={(value) => (randomPhaseExport = value)} checked={randomPhaseExport === true} />

    <TextField label="File name" initialValue={$sampleName} onInput={(value) => ($sampleName = value)} />

    <div class="flex mt-auto justify-center">
        <Button class="text-blue border-blue-65 bg-blue-5" onClick={() => downloadZip()}>{state === 'exporting' ? 'Processing' : 'Download'}</Button>
    </div>
    {#if state === 'cannotExport'}
        <p class="text-xs text-pink text-center">Cannot find synth module</p>
    {/if}
</Controls>
