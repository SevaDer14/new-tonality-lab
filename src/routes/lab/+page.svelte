<script lang="ts">
    import Spectrum from '../../components/Spectrum.svelte'
    import RoughnessProfileControls from '../../components/RoughnessControls.svelte'
    import GenerateControls from '../../components/GenerateControls.svelte'
    import TweakControls from '../../components/TweakControls.svelte'
    import Panel from '../../components/Panel.svelte'
    import Board from '../../components/Board.svelte'
    import Synth from '../../components/Synth.svelte'
</script>

<Panel size="lg" title="synth">
    <GenerateControls />

    <TweakControls />

    <RoughnessProfileControls />

</Panel>

<Panel size="md" title="graphs">
    <Spectrum />
</Panel>

<Panel size="sm" title="board">
    <Synth />
    <Board />
</Panel>
