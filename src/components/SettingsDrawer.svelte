<script lang="ts">
    import { spectrumType, fundamental, numberOfPartials, sampleRate, sampleName, sampleDuration, partials, dissonanceCurve, edoSteps, stretch } from '../state/stores.js'
    import Range from '../components/Range.svelte'
    import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
    import SpectrumTypeRadioGroup from './SpectrumTypeRadioGroup.svelte'
    import { layout } from '../theme/layout'

    // TODO: untested
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

    const downloadFiles = async () => {
        const zipFileWriter = new BlobWriter()

        const partialsFile = new TextReader(parseCurveToFileFormat($partials))
        const dissonanceCurveFile = new TextReader(parseCurveToFileFormat($dissonanceCurve.curve))
        const zipWriter = new ZipWriter(zipFileWriter)

        await zipWriter.add(`${$sampleName}_spectrum`, partialsFile)
        await zipWriter.add(`${$sampleName}_dissonance_curve`, dissonanceCurveFile)
        await zipWriter.close()

        const zipFileBlob = await zipFileWriter.getData()

        const link = document.createElement('a')
        link.href = URL.createObjectURL(zipFileBlob)
        link.download = `${$sampleName}.zip`
        link.click()
        link.remove()
    }
</script>

<div class="settings-menu" style="width: {layout.menuWidth}px">
    <h3>SPECTRUM</h3>

    <Range label="Fundamental (Hz)" min={55} max={880} onInput={(value) => ($fundamental = value)} initialValue={$fundamental} />
    <Range label="Number of Partials" min={2} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />

    <SpectrumTypeRadioGroup />

    {#if $spectrumType === 'stretched'}
        <Range label="Stretch" min={1.1} max={4} step={0.1} onInput={(value) => ($stretch = value)} initialValue={$stretch} />
    {/if}

    {#if $spectrumType === 'edo'}
        <Range label="Edo steps" min={3} max={19} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />
    {/if}

    <h3>EXPORT</h3>
    <label for="sample_rate">Sample Rate</label>
    <select bind:value={$sampleRate} id="sample_rate">
        <option value={44100}>44100 Hz</option>
        <option value={48000}>48000 Hz</option>
        <option value={96000}>96000 Hz</option>
    </select>

    <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

    <label for="Name">File name</label>
    <input bind:value={$sampleName} id="name" />

    <button on:click={() => downloadFiles()}>Download Files</button>
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
        margin: 52px 4px 4px 0px;
        border: none;
        background-color: #2f82de;
        color: #ffffff;
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
    select {
        margin-bottom: 18px;
        width: 100%;
    }
</style>
