<script lang="ts">
    import NumberInput from '../../components/NumberInput.svelte'
    import VolumeOnIcon from '../../icons/VolumeOnIcon.svelte'
    import Button from '../../components/Button.svelte'
    import CloseIcon from '../../icons/CloseIcon.svelte'
    import type { Partial } from 'new-tonality-web-synth'
    import VolumeOffIcon from '../../icons/VolumeOffIcon.svelte'

    export let spectrum: Partial[]
    export let title: string
    export let mute = false

    function handleInput(partial: Partial, partialIndex: number) {
        const notChanged = spectrum[partialIndex].rate === partial.rate && spectrum[partialIndex].amplitude === partial.amplitude

        if (notChanged) return

        spectrum = spectrum.map((p, i) => {
            if (i !== partialIndex) return p
            return partial
        })
    }
</script>

<div class="px-4 py-2 max-h-[512px] min-w-[180px] overflow-y-auto">
    <div class="flex items-center pt-1 pb-2">
        <p class="text-sm px-2">{title}</p>
        <Button size="sm" color="pink" onClick={() => (spectrum = [])} disabled={spectrum.length == 0}><CloseIcon /></Button>
        <Button size="sm" color={mute ? 'orange' : 'green'} onClick={() => (mute = !mute)} disabled={spectrum.length == 0}>
            {#if mute === true}
                <VolumeOffIcon />
            {:else}
                <VolumeOnIcon />
            {/if}</Button
        >
    </div>

    {#each spectrum as partial, index}
        <div class="grid grid-cols-2 gap-x-2">
            <NumberInput label="f" defaultValue={partial.rate} value={partial.rate} onInput={(v) => handleInput({ ...partial, rate: v }, index)} valueRange={100} min={0} />
            <NumberInput label="a" defaultValue={partial.amplitude} value={partial.amplitude} onInput={(v) => handleInput({ ...partial, amplitude: v }, index)} valueRange={1} min={0} />
        </div>
    {/each}
</div>
