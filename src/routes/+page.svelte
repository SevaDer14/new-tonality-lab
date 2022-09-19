<script lang="ts">
    import Plot from '../components/Plot.svelte'
    import Settings from '../components/Settings.svelte'
    import SettingsIcon from '../components/icons/SettingsIcon.svelte'
    import CrossIcon from '../components/icons/CrossIcon.svelte'
    import DownloadIcon from '../components/icons/DownloadIcon.svelte'
    import { fundamental, numberOfPartials, sampleRate, sampleDuration, sampleName } from '../state/stores.js'

    let settingsOpen = false
</script>

<div class="app-bar">
    <button><DownloadIcon /></button>
    <button on:click={() => (settingsOpen = !settingsOpen)}>
        {#if settingsOpen === false}
            <SettingsIcon />
        {:else}
            <CrossIcon />
        {/if}
    </button>
</div>

<div class="store-observer">
    <p>fundamental: {$fundamental}</p>
    <p>numberOfPartials: {$numberOfPartials}</p>
    <p>sampleRate: {$sampleRate}</p>
    <p>sampleDuration: {$sampleDuration}</p>
    <p>sampleName: {$sampleName}</p>
</div>

<Settings open={settingsOpen} />

<Plot data="Spectrum" />
<Plot data="Dissonance Curve" />

<style>
    .app-bar {
        display: flex;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
    }
    .store-observer {
        position: absolute;
        padding-left: 12px;
        padding-top: 12px;
    }
    p {
        margin: 0 0 6px 0;
        opacity: 0.5;
    }
</style>
