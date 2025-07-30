<script lang="ts">
    import { transpose } from './utils'
    import Panel from '../../components/Panel.svelte'
    import NumberInput from '../../components/NumberInput.svelte'
    import SpectrumGraph from './SpectrumGraph.svelte'
    import SpectrumControl from './SpectrumControl.svelte'
    import Button from '../../components/Button.svelte'
    import AdditiveSynth from './AdditiveSynth.svelte'
    import type { Partial, Spectrum } from 'new-tonality-web-synth'
    import CONST from './const'
    import { onMount } from 'svelte'
    import DissonanceChart from './DissonanceChart.svelte'

    let tutorial = CONST.TUTORIAL_STEP_START

    onMount(() => {
        if (localStorage.getItem(CONST.TUTORIAL_KEY) === 'true') {
            tutorial = CONST.TUTORIAL_STEP_END
        }
    })

    let fundamental: number = 440
    let numberOfPartials: number = 6
    let stretch: number = 1
    let context: Partial[] = []
    let complement: Partial[] = []

    let muteComplement = true
    let muteContext = true
    let interval: number = 0

    $: synthActive = spectrum.flatMap((layer) => layer.partials).length > 0
    $: spectrum = (() => {
        const result: Spectrum = []
        if (!muteComplement) result.push({ partials: complement })
        if (!muteContext) result.push({ partials: context })
        return result
    })()

    function setTutorialStepOnUnmute(mute: boolean) {
        if (tutorial.step !== 1 || mute !== false) return
        if (context.length === 0) tutorial = CONST.TUTORIAL_STEP_2
        if (context.length > 0 && interval === 0) tutorial = CONST.TUTORIAL_STEP_3
        if (context.length > 0 && interval !== 0) endTutorial()
    }

    function endTutorial() {
        tutorial = CONST.TUTORIAL_STEP_END
        localStorage.setItem(CONST.TUTORIAL_KEY, 'true')
    }

    function handleTranspose(val: number) {
        interval = val
        if (tutorial.step === 3 && (interval > 20 || interval < -20)) endTutorial()
    }

    function generateComplement() {
        let result: Partial[] = []

        for (let i = 1; i <= numberOfPartials; i++) {
            result.push({
                rate: fundamental * Math.pow(i, stretch),
                amplitude: 1 / i,
            })
        }

        complement = result

        if (tutorial.step === 0 && muteComplement === true) {
            tutorial = CONST.TUTORIAL_STEP_1
            return
        }
    }

    function addToContext() {
        const newSpectrum = new Map<number, number>()

        for (const partial of [...context, ...complement]) {
            const amplitude = newSpectrum.get(partial.rate) ?? 0

            newSpectrum.set(partial.rate, amplitude + partial.amplitude)
        }

        context = Array.from(newSpectrum.entries()).map((p) => ({ rate: p[0], amplitude: p[1] }))

        if (tutorial.finished === false && muteComplement === false) {
            muteContext = false
        }

        if (tutorial.step === 2) tutorial = CONST.TUTORIAL_STEP_3
    }
</script>

<AdditiveSynth {spectrum} bind:active={synthActive} />

<div class="grid grid-rows-2 grid-cols-3 gap-4 w-full">
    <Panel size="full" title="Partials" class="row-span-2 flex-col" collapsible={false}>
        <div class="border-b border-white-25 px-2 py-4 flex justify-between">
            <NumberInput label="freq" whole defaultValue={fundamental} bind:value={fundamental} valueRange={100} min={1} />
            <NumberInput label="partials" whole defaultValue={numberOfPartials} bind:value={numberOfPartials} valueRange={10} min={1} />
            <NumberInput label="stretch" defaultValue={stretch} bind:value={stretch} valueRange={1} min={0.1} />
            <Button size="sm" color="green" onClick={generateComplement}>Generate</Button>
        </div>

        <div class="grid grid-rows-1 grid-cols-[1fr_2rem_1fr] justify-between px-2">
            <SpectrumControl canTranspose title="Complement" bind:partials={complement} bind:mute={muteComplement} onMuteToggle={setTutorialStepOnUnmute} onTranspose={handleTranspose} emptyMessage="Start by generating some partials" hint={tutorial.complementHint} />
            <div class="h-full w-6 flex items-center justify-center">
                <Button size="xs" onClick={addToContext} disabled={complement.length === 0}>{'=>'}</Button>
            </div>
            <SpectrumControl title="Context" bind:partials={context} bind:mute={muteContext} emptyMessage={tutorial.finished && complement.length > 0 ? CONST.TUTORIAL_STEP_2.contextHint : ''} hint={tutorial.contextHint} />
        </div>
    </Panel>

    <Panel size="md" title="Spectrum Graph" class="col-span-2" collapsible={false}>
        <SpectrumGraph {complement} {context} />
    </Panel>

    <Panel size="md" title="Dissonance curve" class="col-span-2" collapsible={false}>
        <DissonanceChart {complement} {context} {interval} />
    </Panel>
</div>
