<script lang="ts">
    import { spectrumType, fundamental, numberOfPartials, sampleName, sampleDuration, partials, dissonanceCurve, edoSteps, pseudoOctave, dissLimitMinFrequency, dissLimitMaxFrequency, dissLimitMinAmplitude, dissLimitMaxAmplitude } from '../state/stores.js'
    import Range from '../components/Range.svelte'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import SpectrumTypeRadioGroup from './SpectrumTypeRadioGroup.svelte'
    import { layout } from '../theme/layout'
    import { AdditiveSynth } from '../xentonality/synth'
    import { onMount } from 'svelte'
    import { parseCurveToFileFormat, generateWavFile } from '../xentonality/utils'

    let synth: AdditiveSynth
    let audioCtx: AudioContext
    let recorderNode: MediaStreamAudioDestinationNode
    let downloadingZip = false
    let playing = false

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
            const sampleBuffer = await synth.generateSample($sampleDuration)
            const sampleBlob = generateWavFile(sampleBuffer, 1)

            const zipFileWriter = new BlobWriter()
            const sampleFile = new BlobReader(sampleBlob)
            const partialsFile = new TextReader(parseCurveToFileFormat($partials))
            const dissonanceCurveFile = new TextReader(parseCurveToFileFormat($dissonanceCurve.curve))


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

<div class="settings-menu" style="width: {layout.menuWidth}px">
    <h3>SPECTRUM</h3>

    <Range label="Fundamental (Hz)" min={55} max={880} onInput={(value) => ($fundamental = value)} initialValue={$fundamental} />
    <Range label="Number of Partials" min={1} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />
    <Range label="Pseudo-octave (cents)" min={100} max={2400} step={100} onInput={(value) => ($pseudoOctave = value)} initialValue={$pseudoOctave} />

    <SpectrumTypeRadioGroup />

    {#if $spectrumType === 'edo'}
        <Range label="Edo steps" min={3} max={19} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />
    {/if}

    {#if playing === true}
        <button on:click={stopSample}>Stop</button>
    {:else}
        <button on:click={playSample}>Play</button>
    {/if}

    <h3>DISSONANCE CURVE</h3>

    <h5>Frequency limits:</h5>
    <div class="diss-curve-limits-container">
        <div class="diss-curve-limit-input">
            <label for="dissLimitMinFrequency">Min (Hz)</label>
            <input type="number" bind:value={$dissLimitMinFrequency} id="dissLimitMinFrequency" />
        </div>

        <div class="diss-curve-limit-input">
            <label for="dissLimitMaxFrequency">Max (Hz)</label>
            <input type="number" bind:value={$dissLimitMaxFrequency} id="dissLimitMaxFrequency" />
        </div>
    </div>

    <h5>Ampitude limits:</h5>
    <div class="diss-curve-limits-container">
        <div class="diss-curve-limit-input">
            <label for="dissLimitMinAmplitude">Min</label>
            <input type="number" bind:value={$dissLimitMinAmplitude} id="dissLimitMinAmplitude" />
        </div>

        <div class="diss-curve-limit-input">
            <label for="dissLimitMaxAmplitude">Max</label>
            <input type="number" max={1} min={0} step={0.01} bind:value={$dissLimitMaxAmplitude} id="dissLimitMaxAmplitude" />
        </div>
    </div>

    <h3>EXPORT</h3>

    <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

    <label for="Name">File name</label>
    <input bind:value={$sampleName} id="name" />

    <button on:click={() => downloadZip()} disabled={downloadingZip === true}>{downloadingZip === true ? 'Processing...' : 'Download Files'}</button>
</div>

<style>
    .settings-menu {
        display: flex;
        flex-direction: column;
        padding: 0 12px;
        height: 100%;
        background-color: #dfecfa;
    }
    button {
        width: 100%;
        height: 36px;
        margin: 18px 4px 4px 0px;
        border: none;
        background-color: #2f82de;
        color: #ffffff;
        border-radius: 4px;
    }
    button:disabled {
        background-color: #2f82de66;
    }
    button:disabled:hover {
        background-color: #2f82de66;
    }
    button:hover {
        background-color: #458ddf;
    }
    h3 {
        margin-top: 36px;
        font-weight: 400;
    }
    h5 {
        margin: 8px 0px;
    }
    label {
        display: block;
        font-size: small;
    }
    input {
        width: 100%;
        margin-bottom: 18px;
    }
    .diss-curve-limits-container {
        display: flex;
        justify-content: space-between;
    }
    .diss-curve-limit-input {
        width: 40%;
        margin-right: 12px;
    }
</style>
