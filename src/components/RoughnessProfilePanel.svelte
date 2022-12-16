<script lang="ts">
    import Panel from './basic/Panel.svelte'
    import Range from './basic/Range.svelte'
    import { dissLimitMaxIndex } from '../state/stores.js'
</script>

<Panel title="roughness profile">
    <Range label="Partial limit max" min={0} max={20} onInput={(value) => ($dissLimitMaxIndex = value)} initialValue={$dissLimitMaxIndex} />
    <p class="text-white-25 mt-4">In development, calculation of roughness profile against harmonic spectrum</p>
</Panel>
