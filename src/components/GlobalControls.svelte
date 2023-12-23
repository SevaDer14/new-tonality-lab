<script lang="ts">
    import { masterGain } from '../state/stores'
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
</script>

<Controls title="Mix:">
    <Range label="Volume" min={0} max={1} step={0.01} onInput={(value) => ($masterGain = value)} initialValue={$masterGain} />
</Controls>
