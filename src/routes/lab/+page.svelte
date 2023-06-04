<script lang="ts">
    import GraphsPanel from '../../components/GraphsPanel.svelte'
    import ExportPanel from '../../components/ExportPanel.svelte'
    import RoughnessProfilePanel from '../../components/RoughnessProfilePanel.svelte'
    import GeneratePanel from '../../components/GeneratePanel.svelte'
    import Panel from '../../components/basic/Panel.svelte'
    import TweakPanel from '../../components/TweakPanel.svelte'
    import { spectrum } from "../../state/stores";
    import { partial } from 'lodash'
</script>

<GeneratePanel />
<TweakPanel />

<!-- <RoughnessProfilePanel />

<ExportPanel /> -->

<Panel class="min-w-full">
    <GraphsPanel />
</Panel>
