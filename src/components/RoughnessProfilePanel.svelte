<script lang="ts">
    import Panel from './basic/Panel.svelte'
    import Range from './basic/Range.svelte'
    import RadioGroup from './basic/RadioGroup.svelte'
    import Checkbox from './basic/Checkbox.svelte'
    import { dissLimitMaxIndex, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials } from '../state/stores.js'
</script>

<Panel title="roughness profile">
    <Range label="Partial limit max" min={0} max={20} onInput={(value) => ($dissLimitMaxIndex = value)} initialValue={$dissLimitMaxIndex} />
    

    <RadioGroup legend="Sweep type">
        <div class="flex items-center mb-1">
            <input type="radio" id="sweepSame" name="sweepType" value="same" checked bind:group={$dissonanceCurveSweepType} />
            <label for="sweepSame">Same</label>
        </div>

        <div class="flex items-center">
            <input type="radio" id="sweepHarmonic" name="sweepType" value="harmonic" bind:group={$dissonanceCurveSweepType} />
            <label for="sweepHarmonic">Harmonic</label>
        </div>
    </RadioGroup>
    
    <Range disabled={$dissonanceCurveSweepType !== 'harmonic'} label="Number of sweep partials" min={1} max={20} onInput={(value) => ($dissonanceCurveSweepHarmonicPartials = value)} initialValue={$dissonanceCurveSweepHarmonicPartials} />

    <Checkbox label="Detrend" onChange={(value) => $dissonanceCurveDetrend = value} checked={$dissonanceCurveDetrend === true} />
</Panel>
