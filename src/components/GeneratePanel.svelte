<script lang="ts">
    import Panel from './basic/Panel.svelte'
    import Range from './basic/Range.svelte'
    import RadioGroup from './basic/RadioGroup.svelte'
    import { spectrum } from '../state/stores.js'

    const handleSpectrumTypeInput = (e: any) => {
        if (!(e && e.target && e.target.value)) return

        switch (e.target.value) {
            case 'equalTemperament':
                spectrum.recalculate({ type: 'equalTemperament' })
                break
            case 'harmonic':
                spectrum.recalculate({ type: 'harmonic' })
                break
            default:
                console.error(`Unknown input event target value ${e.target.value} for spectrum type radio input`)
                break
        }
    }
</script>

<Panel title="generate">
    <Range label="Number of Partials" min={1} max={100} onInput={(value) => spectrum.recalculate({ numberOfPartials: value })} initialValue={$spectrum.options.numberOfPartials} />
    <Range label="Pseudo-octave" min={1.1} max={4} step={0.01} onInput={(value) => spectrum.recalculate({ octaveRatio: value })} initialValue={$spectrum.options.octaveRatio} />

    <RadioGroup legend="Spectrum type">
        <div class="flex items-center mb-1">
            <input type="radio" name="spectrumType" id="harmonic" value="harmonic" checked={$spectrum.options.type === 'harmonic'} on:input={handleSpectrumTypeInput} />
            <label for="harmonic">Harmonic</label>
        </div>

        <div class="flex items-center">
            <input type="radio" name="spectrumType" id="equalTemperament" value="equalTemperament" checked={$spectrum.options.type === 'equalTemperament'} on:input={handleSpectrumTypeInput} />
            <label for="equalTemperament">Edo</label>
        </div>
    </RadioGroup>

    <Range disabled={$spectrum.options.type !== 'equalTemperament'} label="EDO steps" min={3} max={24} onInput={(value) => spectrum.recalculate({ steps: value })} initialValue={$spectrum.options.steps} />

    <Range label="Amplitude slope" min={0} max={3} step={0.005} onInput={(value) => spectrum.recalculate({ amplitudeProfile: value })} initialValue={$spectrum.options.amplitudeProfile} />
</Panel>
