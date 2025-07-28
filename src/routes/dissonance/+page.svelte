<script lang="ts">
    import { DissonanceCurve } from './DissonanceCurve'
    import { transpose, type Spectrum } from './utils'
    import highcharts from '../../utils/highcharts.js'
    import Panel from '../../components/Panel.svelte'
    import { getChartConfig } from './chartConfig'
    import NumberInput from '../../components/NumberInput.svelte'
    import SpectrumGraph from './SpectrumGraph.svelte'
    import SpectrumControl from './SpectrumControl.svelte'
    import Button from '../../components/Button.svelte'

    let fundamental: number = 440
    let numberOfPartials: number = 6
    let stretch: number = 1
    let interval: number = 0

    let context: Spectrum = []
    let complement: Spectrum = []

    $: transposedComplement = transpose(complement, interval)

    function resetSpectrums() {
        context = []
        complement = []
    }

    function generateSpectrums() {
        let result: Spectrum = []

        for (let i = 1; i <= numberOfPartials; i++) {
            result.push({
                freq: fundamental * Math.pow(i, stretch),
                amp: 1 / i,
            })
        }

        complement = result
    }

    function addToContext() {
        const newSpectrum = new Map<number, number>()

        for (const partial of [...context, ...transposedComplement]) {
            const amplitude = newSpectrum.get(partial.freq) ?? 0

            newSpectrum.set(partial.freq, amplitude + partial.amp)
        }

        context = Array.from(newSpectrum.entries()).map((p) => ({ freq: p[0], amp: p[1] }))
    }

    const DEFAULT_DISSONANCE_PARAMS = {
        rangeMin: 0,
        rangeMax: 1200,
        step: 1,
        s1: 0.021,
        s2: 19,
        b1: 3.5,
        b2: 5.75,
        x_star: 0.24,
    }

    let rangeMin = DEFAULT_DISSONANCE_PARAMS.rangeMin
    let rangeMax = DEFAULT_DISSONANCE_PARAMS.rangeMax

    $: {
        if (interval < rangeMin) rangeMin = interval
        if (interval > rangeMax) rangeMax = interval
    }

    let step = DEFAULT_DISSONANCE_PARAMS.step
    let x_star = DEFAULT_DISSONANCE_PARAMS.x_star
    let s1 = DEFAULT_DISSONANCE_PARAMS.s1
    let s2 = DEFAULT_DISSONANCE_PARAMS.s2
    let b1 = DEFAULT_DISSONANCE_PARAMS.b1
    let b2 = DEFAULT_DISSONANCE_PARAMS.b2

    $: dissonanceCurve = new DissonanceCurve({ context, complement, rangeMin, rangeMax, step, s1, s2, b1, b2, x_star })
    $: chartConfig = getChartConfig(dissonanceCurve, interval)
</script>

<div class="grid grid-rows-2 grid-cols-3 gap-4 w-full">
    <Panel size="full" title="Data" class="row-span-2 flex-col" collapsible={false}>
        <div class="flex flex-wrap border-b px-4 py-2">
            <div>
                <NumberInput label="fundamental (Hz)" whole defaultValue={fundamental} bind:value={fundamental} valueRange={100} min={1} />
                <NumberInput label="number of partials" whole defaultValue={numberOfPartials} bind:value={numberOfPartials} valueRange={10} min={1} />
                <NumberInput label="stretch" defaultValue={stretch} bind:value={stretch} valueRange={1} min={0.1} />
            </div>

            <div class="flex flex-col">
                <Button size="sm" variant="primary" onClick={generateSpectrums}>Generate</Button>
                <Button size="sm" variant="danger" onClick={resetSpectrums}>Reset</Button>
            </div>
        </div>

        <div class="flex justify-between">
            <SpectrumControl title="Complement" bind:spectrum={complement} />
            <SpectrumControl title="Context" bind:spectrum={context} />
        </div>
    </Panel>
    <Panel size="md" title="Spectrum" class="col-span-2 flex-col" collapsible={false}>
        <SpectrumGraph complement={transposedComplement} {context} />
        <div class="flex flex-wrap items-center border-t h-full">
            <NumberInput whole label="transpose (cents)" defaultValue={interval} bind:value={interval} valueRange={1000} min={-4800} max={4800} />
            <button class="text-xs text-white-65 border border-white-15 px-2 rounded bg-white-5 hover:bg-white-15 hover:text-white hover:border-white-65" on:click={addToContext}>Add to context</button>
        </div>
    </Panel>

    <Panel size="md" title="Dissonance curve" class="col-span-2" collapsible={false}>
        <div class="min-w-full">
            <div class="flex flex-wrap border-b">
                <NumberInput label="min" whole defaultValue={rangeMin} bind:value={rangeMin} valueRange={1000} min={-4800} max={4800} />
                <NumberInput label="max" whole defaultValue={rangeMax} bind:value={rangeMax} valueRange={1000} min={-4800} max={4800} />
                <NumberInput label="step" whole defaultValue={DEFAULT_DISSONANCE_PARAMS.step} bind:debouncedValue={step} valueRange={10} min={0.1} />
            </div>
            <div
                use:highcharts={{
                    chart: chartConfig,
                }}
            />
            <div class="flex flex-wrap border-t">
                <NumberInput label="x*" defaultValue={DEFAULT_DISSONANCE_PARAMS.x_star} bind:debouncedValue={x_star} valueRange={0.1} min={0} />
                <NumberInput label="s1" defaultValue={DEFAULT_DISSONANCE_PARAMS.s1} bind:debouncedValue={s1} valueRange={0.01} />
                <NumberInput label="s2" defaultValue={DEFAULT_DISSONANCE_PARAMS.s2} bind:debouncedValue={s2} valueRange={10} />
                <NumberInput label="b1" defaultValue={DEFAULT_DISSONANCE_PARAMS.b1} bind:debouncedValue={b1} valueRange={1} />
                <NumberInput label="b2" defaultValue={DEFAULT_DISSONANCE_PARAMS.b2} bind:debouncedValue={b2} valueRange={1} />
            </div>
        </div>
    </Panel>
</div>
