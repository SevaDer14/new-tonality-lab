<script lang="ts">
    import SpectrumGraph from '../../components/SpectrumGraph.svelte'
    // import RoughnessProfileControls from '../../components/RoughnessControls.svelte'
    import GenerateControls from '../../components/GenerateControls.svelte'
    // import TweakControls from '../../components/TweakControls.svelte'
    import Panel from '../../components/Panel.svelte'
    import Board from '../../components/Board.svelte'
    import Synth from '../../components/Synth.svelte'
    import GlobalControls from '../../components/GlobalControls.svelte'
    // import ExportControls from '../../components/ExportControls.svelte'
</script>

<Panel size="lg" title="synth">
    <GenerateControls />
    <GlobalControls />
    <!-- <TweakControls />
    <RoughnessProfileControls />
    <ExportControls /> -->
</Panel>

<Panel size="md" title="graphs">
    <SpectrumGraph />
</Panel>

<Panel size="sm" title="board">
    <Synth />
    <Board />
</Panel>
