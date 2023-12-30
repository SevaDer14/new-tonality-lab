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
    <Board />
</Panel>

<a class="mt-8 text-xs underline text-green-65 hover:text-green" href="https://xen-jmju0jgyc-sevader14.vercel.app/lab" target="_blank">View old app version</a>
