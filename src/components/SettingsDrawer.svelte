<script lang="ts">
    import { spectrumType, fundamental, numberOfPartials, sampleName, sampleDuration, partials, dissonanceCurve, edoSteps, stretch } from '../state/stores.js'
    import Range from '../components/Range.svelte'
    import { BlobWriter, TextReader, BlobReader, ZipWriter } from '@zip.js/zip.js'
    import SpectrumTypeRadioGroup from './SpectrumTypeRadioGroup.svelte'
    import { layout } from '../theme/layout'
    import type { PolySynth, Synth, SynthOptions } from 'tone'
    import * as Tone from 'tone'
    import { onMount } from 'svelte'

    let synth: PolySynth<Synth<SynthOptions>>
    let processing = false
    let playing = false

    onMount(() => {
        synth = new Tone.PolySynth(Tone.Synth).toDestination()
        synth.set({ oscillator: { type: 'sine' } })
    })

    // TODO: untested, move to Utils?
    const parseCurveToFileFormat = (curve: { [key: string]: number }[]) => {
        const toStringRow = (row: any[]) => {
            let result = `${row[0]}`

            for (let i = 1; i < row.length; i += 1) {
                result += `\t${row[i]}`
            }

            return result
        }

        const headerRow = toStringRow(Object.keys(curve[0]))
        const rows = [headerRow]

        for (let i = 0; i < curve.length; i += 1) {
            rows.push(toStringRow(Object.values(curve[i])))
        }

        return rows.join('\n')
    }

    const playSample = () => {
        playing = true
        Tone.start()
        $partials.forEach((partial) => {
            Tone.Transport.scheduleOnce((time) => {
                synth.triggerAttack(partial.frequency, time, partial.amplitude * 0.1)
            }, '8n')
        })
        Tone.Transport.start()
    }

    const stopSample = () => {
        synth.releaseAll()
        Tone.Transport.stop()
        playing = false
    }

    const recordSample = () => {
        const recorder = new Tone.Recorder()
        synth.disconnect()
        synth.connect(recorder)
        recorder.start()
        playSample()

        let recording = new Promise((resolve) =>
            setTimeout(async () => {
                let result = await recorder.stop()
                stopSample()
                synth.toDestination()
                resolve(result)
            }, $sampleDuration * 1000)
        )
        return recording
    }

    const downloadFiles = async () => {
        processing = true

        const zipFileWriter = new BlobWriter()
        const partialsFile = new TextReader(parseCurveToFileFormat($partials))
        const dissonanceCurveFile = new TextReader(parseCurveToFileFormat($dissonanceCurve.curve))
        const audioSample = (await recordSample()) as Blob

        if (partialsFile !== undefined && dissonanceCurveFile !== undefined && audioSample !== undefined) {
            const audioSampleFile = new BlobReader(audioSample)
            const zipWriter = new ZipWriter(zipFileWriter)

            await zipWriter.add(`${$sampleName}_spectrum.txt`, partialsFile)
            await zipWriter.add(`${$sampleName}_dissonance_curve.txt`, dissonanceCurveFile)
            await zipWriter.add(`${$sampleName}.wav`, audioSampleFile)
            await zipWriter.close()

            const zipFileBlob = await zipFileWriter.getData()

            const link = document.createElement('a')
            link.href = URL.createObjectURL(zipFileBlob)
            link.download = `${$sampleName}.zip`
            link.click()
            link.remove()

            processing = false
        }
    }
</script>

<div class="settings-menu" style="width: {layout.menuWidth}px">
    <h3>SPECTRUM</h3>

    <Range label="Fundamental (Hz)" min={55} max={880} onInput={(value) => ($fundamental = value)} initialValue={$fundamental} />
    <Range label="Number of Partials" min={2} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />
    <Range label="Stretch" min={0.6} max={2} step={0.1} onInput={(value) => ($stretch = value)} initialValue={$stretch} />

    <SpectrumTypeRadioGroup />

    {#if $spectrumType === 'edo'}
        <Range label="Edo steps" min={3} max={19} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />
    {/if}

    {#if playing === true}
        <button on:click={stopSample}>Stop</button>
    {:else}
        <button on:click={playSample}>Play</button>
    {/if}

    <h3>EXPORT</h3>

    <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

    <label for="Name">File name</label>
    <input bind:value={$sampleName} id="name" />

    <button on:click={() => downloadFiles()}>{processing === true ? 'Processing...' : 'Download Files'}</button>
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
    button:hover {
        background-color: #458ddf;
    }
    h3 {
        margin-top: 36px;
        font-weight: 400;
    }
    label {
        display: block;
        font-size: small;
    }
    input {
        margin-bottom: 18px;
    }
</style>
