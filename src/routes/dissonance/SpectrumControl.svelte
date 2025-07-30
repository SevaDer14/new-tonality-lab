<script lang="ts">
    import NumberInput from '../../components/NumberInput.svelte'
    import VolumeOnIcon from '../../icons/VolumeOnIcon.svelte'
    import Button from '../../components/Button.svelte'
    import type { Partial } from 'new-tonality-web-synth'
    import VolumeOffIcon from '../../icons/VolumeOffIcon.svelte'
    import { transpose } from './utils'
    import TrashIcon from '../../icons/TrashIcon.svelte'

    export let partials: Partial[]
    export let title: string
    export let emptyMessage: string = ''
    export let hint: string = ''
    export let mute = true
    export let canTranspose = false
    export let onMuteToggle: undefined | ((mute: boolean) => void) = undefined
    export let onTranspose: undefined | ((interval: number) => void) = undefined

    let interval = 0

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
    }
</script>

<div class="py-2 max-h-[512px] min-w-[180px] overflow-y-auto">
    <div class="pt-1 pb-2">
        <div class="flex items-center">
            <p class="text-sm px-2">{title}</p>
            <Button size="sm" color="pink" onClick={clearPartials} disabled={partials.length == 0}><TrashIcon /></Button>
            <Button size="sm" color={mute ? 'orange' : 'green'} onClick={handleMuteToggle} disabled={partials.length == 0}>
                {#if mute === true}
                    <VolumeOffIcon />
                {:else}
                    <VolumeOnIcon />
                {/if}
            </Button>
        </div>
        {#if hint}
            <p class="text-[10px] px-2 pt-1 text-orange-65">{hint}</p>
        {/if}
    </div>

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
</div>
