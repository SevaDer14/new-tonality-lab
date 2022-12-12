<script lang="ts">
    import Panel from './Panel.svelte'
    import Range from './Range.svelte'
    import SpectrumTypeRadioGroup from './SpectrumTypeRadioGroup.svelte'
    import { numberOfPartials, pseudoOctave, edoSteps, spectrumType } from '../state/stores.js'
</script>

<Panel title="generate">
    <Range label="Number of Partials" min={1} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />
    <Range label="Pseudo-octave (cents)" min={100} max={2400} step={10} onInput={(value) => ($pseudoOctave = value)} initialValue={$pseudoOctave} />
    
    <SpectrumTypeRadioGroup />
    
    {#if $spectrumType === 'edo'}
        <Range label="Edo steps" min={3} max={19} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />
    {/if}
</Panel>
