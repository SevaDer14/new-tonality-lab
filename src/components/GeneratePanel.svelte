<script lang="ts">
    import Panel from './Panel.svelte'
    import Range from './Range.svelte'
    import RadioGroup from './RadioGroup.svelte'
    import { numberOfPartials, pseudoOctave, edoSteps, spectrumType } from '../state/stores.js'
</script>

<Panel title="generate">
    <Range label="Number of Partials" min={1} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />
    <Range label="Pseudo-octave (cents)" min={100} max={2400} step={10} onInput={(value) => ($pseudoOctave = value)} initialValue={$pseudoOctave} />
    
    <RadioGroup legend="Spectrum type" >
        <div class="flex items-center mb-1">
            <input type="radio" id="harmonic" name="spectrumType" value="harmonic" checked bind:group={$spectrumType} />
            <label for="harmonic">Harmonic</label>
        </div>
    
        <div class="flex items-center">
            <input type="radio" id="edo" name="spectrumType" value="edo" bind:group={$spectrumType} />
            <label for="edo">Edo</label>
        </div>
    </RadioGroup>
    

        <Range disabled={$spectrumType !== 'edo'} label="Edo steps" min={3} max={19} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />

</Panel>
