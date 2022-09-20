<script lang="ts">
    import Plot from '../components/Plot.svelte'
    import SettingsDrawer from '../components/SettingsDrawer.svelte'
    import StoreInfo from '../components/StoreInfo.svelte'

    import { partials, dissonanceCurve } from '../state/stores.js'


</script>



<StoreInfo />
<SettingsDrawer />

<Plot data={JSON.stringify($partials)} />
<Plot data={JSON.stringify($dissonanceCurve)} />

<style>

</style>
