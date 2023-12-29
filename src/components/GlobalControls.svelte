<script lang="ts">
    import { boardSpan, synthSettings } from '../state/stores'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
</script>

<Controls class="w-60 border-r-4 bg-white-5">
    <Range color="rgb(255, 255, 255)" label="Volume" min={0} max={1} step={0.01} onInput={synthSettings.setMasterGain} value={$synthSettings.masterGain} />
    <Range color="rgb(255, 255, 255)" label="Attack (ms)" min={10} max={1000} step={10} onInput={(attack) => synthSettings.setAdsr({ attack: attack / 1000 })} value={$synthSettings.adsr.attack * 1000} />
    <Range color="rgb(255, 255, 255)" label="Decay (s)" min={0.1} max={2} step={0.1} onInput={(decay) => synthSettings.setAdsr({ decay: decay })} value={$synthSettings.adsr.decay} />
    <Range color="rgb(255, 255, 255)" label="Sustain" min={0} max={1} step={0.01} onInput={(sustain) => synthSettings.setAdsr({ sustain })} value={$synthSettings.adsr.sustain} />
    <Range color="rgb(255, 255, 255)" label="Release (s)" min={0.05} max={5} step={0.1} onInput={(release) => synthSettings.setAdsr({ release: release })} value={$synthSettings.adsr.release} />
    <Range
        color="rgb(255, 255, 255)"
        label="Board span (octaves)"
        min={1}
        max={8}
        step={0.1}
        onInput={(value) => {
            $boardSpan = value
        }}
        value={$boardSpan}
    />
</Controls>
