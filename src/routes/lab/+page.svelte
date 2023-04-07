<script lang="ts">
    import PlotsSection from '../../components/GraphsPanel.svelte'
    import ExportPanel from '../../components/ExportPanel.svelte'
    import RoughnessProfilePanel from '../../components/RoughnessProfilePanel.svelte'
    import GeneratePanel from '../../components/GeneratePanel.svelte'
    import Panel from '../../components/Panel.svelte'
    import TweakPanel from '../../components/TweakPanel.svelte'
</script>

<GeneratePanel />

<TweakPanel />

<RoughnessProfilePanel />

<ExportPanel />

<Panel class="min-w-full">
    <PlotsSection />
</Panel>
