<script lang="ts">
    import { boardSpan, synthSettings, spectrumViewType, spectrum, tuning, presetName, sampleDuration, sampleFundamental } from '../state/stores'
    import { getAllPartials } from '../xentonality/spectrum'
    import Button from './Button.svelte'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder/dist/WavFileEncoder.js'
    import TextField from './TextField.svelte'
    import RadioGroup from './RadioGroup.svelte'

    type ExportState = 'cannotExport' | 'canExport' | 'exporting'

    let state: ExportState = 'canExport'

    const downloadZip = () => {
        if (!window.synth) {
            state = 'cannotExport'
            return
        }

        const synth = window.synth
        state = 'exporting'

        setTimeout(async () => {
            const sampleBuffer = await synth.generateSample({ duration: $sampleDuration, fundamental: $sampleFundamental })
            const wavFileData = encodeWavFileFromAudioBuffer(sampleBuffer, 1 /*32 bit floaing point*/)
            const sampleBlob = new Blob([wavFileData], { type: 'audio/wav' })

            const zipFileWriter = new BlobWriter()
            const sampleFile = new BlobReader(sampleBlob)
            const partialsFile = new TextReader(JSON.stringify(getAllPartials($spectrum)))
            const tuningFile = new TextReader(JSON.stringify($tuning))
            const presetFile = new TextReader(JSON.stringify($synthSettings))

            if (partialsFile !== undefined && tuningFile !== undefined && sampleFile !== undefined) {
                const zipWriter = new ZipWriter(zipFileWriter)

                await zipWriter.add(`${$presetName}_spectrum.txt`, partialsFile)
                await zipWriter.add(`${$presetName}_tuning.txt`, tuningFile)
                await zipWriter.add(`${$presetName}_preset.txt`, presetFile)
                await zipWriter.add(`${$presetName}.wav`, sampleFile)
                await zipWriter.close()

                const zipFileBlob = await zipFileWriter.getData()

                const link = document.createElement('a')
                link.href = URL.createObjectURL(zipFileBlob)
                link.download = `${$presetName}.zip`
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

<Controls class="w-60 border-r-4 bg-white-5">
    <Range color="rgb(255, 255, 255)" label="Volume" min={0} max={1} step={0.01} onInput={synthSettings.setMasterGain} value={$synthSettings.masterGain} />
    <Range color="rgb(255, 255, 255)" label="Attack (ms)" min={10} max={1000} step={10} onInput={(attack) => synthSettings.setAdsr({ attack: attack / 1000 })} value={$synthSettings.adsr.attack * 1000} />
    <Range color="rgb(255, 255, 255)" label="Decay (s)" min={0.1} max={2} step={0.1} onInput={(decay) => synthSettings.setAdsr({ decay: decay })} value={$synthSettings.adsr.decay} />
    <Range color="rgb(255, 255, 255)" label="Sustain" min={0} max={1} step={0.01} onInput={(sustain) => synthSettings.setAdsr({ sustain })} value={$synthSettings.adsr.sustain} />
    <Range color="rgb(255, 255, 255)" label="Release (s)" min={0.05} max={5} step={0.1} onInput={(release) => synthSettings.setAdsr({ release: release })} value={$synthSettings.adsr.release} />

    <div class="min-h-[1px] bg-white-25 my-4" />

    <Range
        label="Board span (octaves)"
        min={1}
        max={8}
        step={0.1}
        onInput={(value) => {
            $boardSpan = value
        }}
        value={$boardSpan}
    />
    <RadioGroup legend="Spectrum view type">
        <div class="flex items-center mb-1">
            <input type="radio" id="spectrumAudible" name="spectrumViewType" value="audible" checked bind:group={$spectrumViewType} />
            <label for="sweepSame">Audible</label>
        </div>

        <div class="flex items-center">
            <input type="radio" id="spectrumSeed" name="spectrumViewType" value="seed" bind:group={$spectrumViewType} />
            <label for="spectrumSeed">Seed</label>
        </div>
    </RadioGroup>

    <div class="min-h-[1px] bg-white-25 my-4" />

    <Range label="Sample duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />
    <Range label="Sample fundamental (Hz)" min={55} max={880} onInput={(value) => ($sampleFundamental = value)} initialValue={$sampleFundamental} />

    <TextField label="File name" initialValue={$presetName} onInput={(value) => ($presetName = value)} />

    <div class="flex mt-auto justify-center">
        <Button class="text-blue border-blue-65 bg-blue-5" onClick={() => downloadZip()}>{state === 'exporting' ? 'Processing' : 'Download'}</Button>
    </div>
    {#if state === 'cannotExport'}
        <p class="text-xs text-pink text-center">Cannot find synth module</p>
    {/if}
</Controls>
