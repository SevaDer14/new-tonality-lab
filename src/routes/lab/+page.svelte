<script lang="ts">
    import SpectrumGraph from '../../components/SpectrumGraph.svelte'
    import Panel from '../../components/Panel.svelte'
    import Board from '../../components/Board.svelte'
    import Synth from '../../components/Synth.svelte'
    import GlobalControls from '../../components/GlobalControls.svelte'
    import LayerControls from '../../components/LayerControls.svelte'
    import { spectrum } from '../../state/stores'


</script>

<Panel size="lg" title="synth">
    <GlobalControls />
    <LayerControls />
</Panel>

<Panel size="md" title="Spectrum">
    <SpectrumGraph />
</Panel>

<Panel size="sm" title="board">
    <Synth />
    <Board spectrum={$spectrum} />
</Panel>
