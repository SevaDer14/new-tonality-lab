<script lang="ts">
    // import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    import PlotsSection from '../../components/GraphsPanel.svelte'
    import ExportPanel from '../../components/ExportPanel.svelte'
    import RoughnessProfilePanel from '../../components/RoughnessProfilePanel.svelte'
    import GeneratePanel from '../../components/GeneratePanel.svelte'
    import Panel from '../../components/basic/Panel.svelte'
</script>

<!-- <div class="page"> -->
<!-- <SettingsDrawer /> -->
<!-- <PlotsSection /> -->
<!-- </div> -->
<div class="flex flex-wrap justify-center">
    <GeneratePanel />

    <Panel title="tweak">
        <p class="mb-3 text-white-25">In development...</p>
        <p class="text-white-25">Will allow to tweak ratios and amplitudes of individual partilas</p>
    </Panel>
</div>
<div class="flex flex-wrap justify-center">
    <RoughnessProfilePanel />

    <ExportPanel />
</div>

<Panel width={1272} height={650}>
   <PlotsSection />
</Panel>
