<script lang="ts">
    import type { Spectrum } from './utils'
    import NumberInput from '../../components/NumberInput.svelte'

    export let spectrum: Spectrum
    export let title: string

    function handleInput(partial: Spectrum[number], partialIndex: number) {
        const notChanged = spectrum[partialIndex].freq === partial.freq && spectrum[partialIndex].amp === partial.amp

        if (notChanged) return

        spectrum = spectrum.map((p, i) => {
            if (i !== partialIndex) return p
            return partial
        })
    }
</script>

<div class="px-4 py-2 max-w-1/2">
    <p class="text-sm px-2 pb-2">{title}</p>
    {#each spectrum as partial, index}
        <div class="grid grid-cols-2 gap-x-2">
            <NumberInput label="f" defaultValue={partial.freq} onInput={(v) => handleInput({ ...partial, freq: v }, index)} valueRange={100} min={0} />
            <NumberInput label="a" defaultValue={partial.amp} onInput={(v) => handleInput({ ...partial, amp: v }, index)} valueRange={1} min={0} />
        </div>
    {/each}
</div>
