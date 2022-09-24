<script lang="ts">
    import { fundamental, numberOfPartials, sampleRate, sampleName, sampleDuration } from '../state/stores.js'
    import SettingsIcon from '../components/icons/SettingsIcon.svelte'
    import CrossIcon from '../components/icons/CrossIcon.svelte'
    import DownloadIcon from '../components/icons/DownloadIcon.svelte'
    import Range from '../components/Range.svelte'

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

{#if settingsOpen === true}
    <div class="drawer">
        <h3 style="margin-top: 100px">SPECTRUM</h3>

        <Range label="Fundamental (Hz)" min={55} max={880} onInput={(value) => ($fundamental = value)} initialValue={$fundamental} />
        <Range label="Number of Partials" min={2} max={20} onInput={(value) => ($numberOfPartials = value)} initialValue={$numberOfPartials} />

        <h3>EXPORT</h3>
        <label for="sample_rate">Sample Rate</label>
        <select bind:value={$sampleRate} id="sample_rate">
            <option value={44100}>44100 Hz</option>
            <option value={48000}>48000 Hz</option>
            <option value={96000}>96000 Hz</option>
        </select>

        <Range label="Duration (sec)" min={1} max={12} onInput={(value) => ($sampleDuration = value)} initialValue={$sampleDuration} />

        <label for="Name">File name</label>
        <input bind:value={$sampleName} id="name" />
    </div>
{/if}

<style>
    .app-bar {
        display: flex;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
        background-color: #2f82de;
        padding-left: 8px;
        padding-bottom: 4px;
        border-radius: 0 0 0 24px;
    }
    .drawer {
        position: absolute;
        right: 0;
        padding: 0 12px;
        height: 100%;
        max-width: 256px;
        background-color: #dfecfa;
    }
    button {
        border-radius: 100%;
        width: 52px;
        height: 52px;
        margin: 4px 4px 4px 0px;
        border: none;
        background-color: #2f82de;
        stroke: #ffffff;
    }
    button:hover {
        background-color: #458ddf;
    }
    h3 {
        margin-top: 50px;
        font-weight: 400;
    }
    label {
        display: block;
        font-size: small;
    }
    select {
        margin-bottom: 18px;
        width: 100%;
    }
</style>
