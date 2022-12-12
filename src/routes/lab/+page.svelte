<script lang="ts">
    // import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    // import PlotsSection from '../../components/PlotsSection.svelte'
    import ExportPanel from '../../components/ExportPanel.svelte'
    import RoughnessProfilePanel from '../../components/RoughnessProfilePanel.svelte'
    import GeneratePanel from '../../components/GeneratePanel.svelte'
    import Panel from '../../components/Panel.svelte'
</script>

<!-- <div class="page"> -->
<!-- <SettingsDrawer /> -->
<!-- <PlotsSection /> -->
<!-- </div> -->

<GeneratePanel />

<Panel title="tweak">
    <p style="margin-bottom: 12px">In development...</p>
    <p>Will allow to tweak ratios and amplitudes of individual partilas</p>
</Panel>

<RoughnessProfilePanel />

<ExportPanel />

<Panel width={1272} height={650}>
    <p style="margin-bottom: 12px">In development...</p>
    <p>Will show generated spectrum and corresponding roughness profile</p>
</Panel>
