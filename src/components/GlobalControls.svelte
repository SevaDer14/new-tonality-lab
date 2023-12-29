<script lang="ts">
    import { synthSettings } from '../state/stores'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
</script>

<Controls class="w-60 border-r-4 bg-white-5">
    <Range color="rgb(255, 255, 255)" label="Volume" min={0} max={1} step={0.01} onInput={synthSettings.setMasterGain} value={$synthSettings.masterGain} />
</Controls>
