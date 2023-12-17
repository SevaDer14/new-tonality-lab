<script lang="ts">
    import { spectrum } from '../state/stores'
    import { attachRandomPhases, attachReciprocalAmplitudes, getHarmonicRates, stretchRates } from '../xentonality/spectrum'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'

    let length = 6
    let stretch = 1
    let start = 1
    let slope = 1
    let transposeTo = 1

    $: rates = getHarmonicRates({ length, start, transposeTo })
    $: stretchedRates = stretchRates({ rates, stretch })
    $: withAmplitudes = attachReciprocalAmplitudes({ rates: stretchedRates, slope })
    $: partials = attachRandomPhases({ partials: withAmplitudes })

    $: {
        if (partials) {
            $spectrum = [{ partials }]
        }
    }
</script>

<Controls title="Harmonic partials">
    <Range label="Number of Partials" min={1} max={100} onInput={(value) => (length = value)} initialValue={length} />
    <Range label="Start partial" min={1} max={20} onInput={(value) => (start = value)} initialValue={start} />
    <Range label="Transpose to rate" min={1} max={20} step={0.01} onInput={(value) => (transposeTo = value)} initialValue={transposeTo} />
    <Range label="Stretch" min={0.1} max={2} step={0.01} onInput={(value) => (stretch = value)} initialValue={stretch} />
    <Range label="Amplitude slope" min={0} max={3} step={0.005} onInput={(value) => (slope = value)} initialValue={slope} />
</Controls>
