<script lang="ts">
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
    import RadioGroup from './RadioGroup.svelte'
    import Checkbox from './Checkbox.svelte'
    import { sweepPan, sweepAmplitude, show12EDO, showSweep, sweepRatio, pseudoOctave, dissLimitMaxIndex, dissonanceCurveEDOMarks, dissonanceCurveDetrend, dissonanceCurveSweepType, dissonanceCurveSweepHarmonicPartials } from '../state/stores-old.js'
    import { centsToRatio } from '../xentonality/utils'
</script>

<Controls title="roughness profile">
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

    <Checkbox label="Show sweep" onChange={(value) => ($showSweep = value)} checked={$showSweep === true} />

    <Range disabled={$showSweep === false} label="Sweep ratio" min={1} max={centsToRatio($pseudoOctave)} step={0.005} onInput={(value) => ($sweepRatio = value)} initialValue={$sweepRatio} />
    <Range disabled={$showSweep === false} label="Sweep pan" min={-1} max={1} step={0.01} onInput={(value) => ($sweepPan = value)} initialValue={$sweepPan} />
    <Range disabled={$showSweep === false} label="Sweep amplitude" min={0} max={1} step={0.01} onInput={(value) => ($sweepAmplitude = value)} initialValue={$sweepAmplitude} />

    <Range label="Major tick interval (EDO)" min={3} max={24} onInput={(value) => ($dissonanceCurveEDOMarks = value)} initialValue={$dissonanceCurveEDOMarks} />

    <Checkbox label="Show 12 EDO minor ticks" onChange={(value) => ($show12EDO = value)} checked={$show12EDO === true} />

    <Checkbox label="Detrend" onChange={(value) => ($dissonanceCurveDetrend = value)} checked={$dissonanceCurveDetrend === true} />
</Controls>
