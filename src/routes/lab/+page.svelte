<script lang="ts">
    import PlotsSection from '../../components/GraphsPanel.svelte'
    import ExportPanel from '../../components/ExportPanel.svelte'
    import RoughnessProfilePanel from '../../components/RoughnessProfilePanel.svelte'
    import GeneratePanel from '../../components/GeneratePanel.svelte'
    import Panel from '../../components/basic/Panel.svelte'
</script>

<GeneratePanel />

<Panel title="tweak">
    <p class="mb-3 text-white-25">In development...</p>
    <p class="text-white-25">Will allow to tweak ratios and amplitudes of individual partilas</p>
</Panel>

<RoughnessProfilePanel />

<ExportPanel />

<Panel class="min-w-full">
    <PlotsSection />
</Panel>
