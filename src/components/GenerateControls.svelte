<script lang="ts">
    import Checkbox from './Checkbox.svelte'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
    import RadioGroup from './RadioGroup.svelte'
    import { fundamental, notes, mainPan, numberOfPartials, pseudoOctave, edoSteps, spectrumType, amplitudeSlope } from '../state/stores.js'

    let noteFrequencyC4 = true
    let customNoteFrequency = $fundamental

    const handleC4CheckboxChange = (value: boolean) => {
        noteFrequencyC4 = value

        if (value === true) {
            $fundamental = $notes.C4
        } else {
            handleFrequencyInput(customNoteFrequency)
        }
    }

    const handleFrequencyInput = (value: number) => {
        if (noteFrequencyC4 === false) {
            $fundamental = value
            customNoteFrequency = value
        }
    }
</script>

<Controls title="generate">
    <Checkbox label="Note C4 = 261.63 Hz" onChange={handleC4CheckboxChange} checked />

    <Range label="Note Frequency (Hz)" disabled={noteFrequencyC4 === true} min={55} max={880} onInput={handleFrequencyInput} initialValue={$fundamental} />

    <Range label="Number of Partials" min={1} max={100} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />

    <Range label="Pseudo-octave (cents)" min={100} max={2400} step={10} onInput={(value) => ($pseudoOctave = value)} initialValue={$pseudoOctave} />

    <RadioGroup legend="Spectrum type">
        <div class="flex items-center mb-1">
            <input type="radio" id="harmonic" name="spectrumType" value="harmonic" checked bind:group={$spectrumType} />
            <label for="harmonic">Harmonic</label>
        </div>

        <div class="flex items-center">
            <input type="radio" id="edo" name="spectrumType" value="edo" bind:group={$spectrumType} />
            <label for="edo">Edo</label>
        </div>
    </RadioGroup>

    <Range disabled={$spectrumType !== 'edo'} label="EDO steps" min={3} max={24} onInput={(value) => ($edoSteps = value)} initialValue={$edoSteps} />

    <Range label="Amplitude slope" min={0} max={3} step={0.005} onInput={(value) => ($amplitudeSlope = value)} initialValue={$amplitudeSlope} />
    <Range label="Pan" min={-1} max={1} step={0.01} onInput={(value) => ($mainPan = value)} initialValue={$mainPan} />
</Controls>
