<script lang="ts">
    import NumberInput from '../../../components/NumberInput.svelte'
    import VolumeOnIcon from '../../../icons/VolumeOnIcon.svelte'
    import Button from '../../../components/Button.svelte'
    import { AdditiveSynth, type Partial } from 'new-tonality-web-synth'
    import VolumeOffIcon from '../../../icons/VolumeOffIcon.svelte'
    import { transpose } from './utils'
    import TrashIcon from '../../../icons/TrashIcon.svelte'
    import DownloadIcon from '../../../icons/DownloadIcon.svelte'
    import { encodeWavFileFromAudioBuffer } from 'wav-file-encoder'
    import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'

    export let partials: Partial[]
    export let title: string
    export let emptyMessage: string = ''
    export let hint: string = ''
    export let mute = true
    export let canTranspose = false
    export let onMuteToggle: undefined | ((mute: boolean) => void) = undefined
    export let onTranspose: undefined | ((interval: number) => void) = undefined

    let interval = 0
    let sampleDuration = 10
    let downloadMode = false
    let downloadState: 'ready' | 'processing' = 'ready'

    function handleInput(partial: Partial, partialIndex: number) {
        const notChanged = partials[partialIndex].rate === partial.rate && partials[partialIndex].amplitude === partial.amplitude

        if (notChanged) return

        partials = partials.map((p, i) => {
            if (i !== partialIndex) return p
            return partial
        })
    }

    function handleTranspose(newInterval: number) {
        partials = transpose(partials, newInterval - interval)
        interval = newInterval
        if (onTranspose) onTranspose(interval)
    }

    function handleMuteToggle() {
        mute = !mute
        if (onMuteToggle) onMuteToggle(mute)
    }

    function clearPartials() {
        partials = []
        downloadMode = false
    }

    async function downloadSample() {
        downloadState = 'processing'
        
        const audioContext = new AudioContext()

        const synth = new AdditiveSynth({
            spectrum: [{ partials }],
            audioContext,
            adsr: {
                attack: 0,
                sustain: 1,
                decay: 0,
                release: 0,
            },
        })

        const sampleBuffer = await synth.generateSample({ duration: sampleDuration, fundamental: 1 })

        const wavFileData = encodeWavFileFromAudioBuffer(sampleBuffer, 1 /*32 bit floaing point*/)
        const sampleBlob = new Blob([wavFileData], { type: 'audio/wav' })

        const zipFileWriter = new BlobWriter()
        const sampleFile = new BlobReader(sampleBlob)
        const partialsFile = new TextReader(JSON.stringify(partials))

        if (partialsFile !== undefined && sampleFile !== undefined) {
            const zipWriter = new ZipWriter(zipFileWriter)

            await zipWriter.add(`${title}_partials.txt`, partialsFile)
            await zipWriter.add(`${title}.wav`, sampleFile)
            await zipWriter.close()

            const zipFileBlob = await zipFileWriter.getData()

            const link = document.createElement('a')
            link.href = URL.createObjectURL(zipFileBlob)
            link.download = `${title}.zip`
            link.click()
            link.remove()

            downloadState = 'ready'
        }
    }
</script>

<div class="py-2 max-h-[512px] min-w-[180px] overflow-y-auto">
    <div class="pt-1 pb-2 pl-1">
        <p class="text-sm pb-2 pl-1">{title}</p>
        <div class="flex items-center pb-2">
            <Button size="sm" color="pink" onClick={clearPartials} disabled={partials.length == 0}><TrashIcon /></Button>
            <Button size="sm" color={mute ? 'orange' : 'green'} onClick={handleMuteToggle} disabled={partials.length == 0}>
                {#if mute === true}
                    <VolumeOffIcon />
                {:else}
                    <VolumeOnIcon />
                {/if}
            </Button>
            <Button size="sm" disabled={partials.length == 0} color={downloadMode ? 'blue' : 'white'} onClick={() => (downloadMode = !downloadMode)}>
                <DownloadIcon />
            </Button>
        </div>
        {#if hint}
            <p class="text-[10px] px-2 pt-1 text-orange-65">{hint}</p>
        {/if}
    </div>

    {#if downloadMode}
        <NumberInput class="mb-2" whole label="duration" defaultValue={10} bind:value={sampleDuration} valueRange={10} min={1} />
        <Button size="sm" color="green" onClick={downloadSample} disabled={downloadState === 'processing'}>
            {#if downloadState === 'processing'}
                processing...
            {:else}
                download sample
            {/if}
        </Button>
    {:else}
        {#if partials.length === 0}
            <p class="text-xs px-2 py-4 text-white-65">{emptyMessage}</p>
        {:else if canTranspose}
            <NumberInput class="mb-2" whole label="transpose" defaultValue={interval} onInput={handleTranspose} valueRange={1000} min={-4800} max={4800} nonRessetable />
        {/if}

        {#each partials as partial, index}
            <div class="grid grid-cols-2 gap-x-2">
                <NumberInput label="f" defaultValue={partial.rate} value={partial.rate} onInput={(v) => handleInput({ ...partial, rate: v }, index)} valueRange={100} min={0} />
                <NumberInput label="a" defaultValue={partial.amplitude} value={partial.amplitude} onInput={(v) => handleInput({ ...partial, amplitude: v }, index)} valueRange={1} min={0} />
            </div>
        {/each}
    {/if}
</div>
