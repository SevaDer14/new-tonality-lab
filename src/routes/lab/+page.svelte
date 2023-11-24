<script lang="ts">
    import Spectrum from '../../components/Spectrum.svelte'
    import ExportControls from '../../components/ExportControls.svelte'
    import RoughnessProfileControls from '../../components/RoughnessControls.svelte'
    import GenerateControls from '../../components/GenerateControls.svelte'
    import TweakControls from '../../components/TweakControls.svelte'
    import Panel from '../../components/Panel.svelte'
</script>

<Panel size="lg" title="synth">
    <GenerateControls />

    <TweakControls />

    <RoughnessProfileControls />

    <ExportControls />
</Panel>

<Panel size="md" title="graphs">
    <Spectrum />
</Panel>
