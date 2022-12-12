<script lang="ts">
    import Panel from './Panel.svelte'
    import Range from './Range.svelte'
    import { dissLimitMaxIndex } from '../state/stores.js'
</script>

<Panel title="roughness profile">
    <Range label="Max partials for calculation" min={0} max={20} onInput={(value) => ($dissLimitMaxIndex = value)} initialValue={$dissLimitMaxIndex} />
</Panel>
