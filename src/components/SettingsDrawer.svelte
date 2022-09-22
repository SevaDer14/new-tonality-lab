<script lang="ts">
    import { fundamental, numberOfPartials, sampleRate, sampleName, sampleDuration } from '../state/stores.js'
    import SettingsIcon from '../components/icons/SettingsIcon.svelte'
    import CrossIcon from '../components/icons/CrossIcon.svelte'
    import DownloadIcon from '../components/icons/DownloadIcon.svelte'
    import { throttle } from 'lodash-es'

    let settingsOpen = false
    let fundamentalVal = String($fundamental)
    let numberOfPartialsVal = String($numberOfPartials)

    const setFundamentalStore = (event: any) => {
        $fundamental = Number(event.target.value)
    }

    const setNumberOfPartialsStore = (event: any) => {
        $numberOfPartials = Number(event.target.value)
    }
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
        <h2 style="margin-top: 100px">SPECTRUM</h2>

        <label for="fundamental">Fundamental</label>
        <input type="range" min={55} max={880} bind:value={fundamentalVal} on:input={throttle(setFundamentalStore, 250)} id="fundamental" />
        <span>{fundamentalVal}</span>
        <p>in Hz</p>

        <label for="number_of_partials">Number of partials</label>
        <input type="range" min={2} max={20} bind:value={numberOfPartialsVal} on:input={throttle(setNumberOfPartialsStore, 250)} id="number_of_partials" />
        <span>{numberOfPartialsVal}</span>
        <p>max 1000</p>

        <h2>EXPORT</h2>
        <label for="sample_rate">Sample Rate</label>
        <select bind:value={$sampleRate} id="sample_rate">
            <option value={44100}>44100 Hz</option>
            <option value={48000}>48000 Hz</option>
            <option value={96000}>96000 Hz</option>
        </select>

        <label for="duartion">Duration</label>
        <input type="range" min={1} max={20} bind:value={$sampleDuration} id="duration" />
        <span>{$sampleDuration}</span>
        <p>in seconds</p>

        <label for="name">Name</label>
        <input bind:value={$sampleName} id="name" />
        <p>files will have that name</p>
    </div>
{/if}

<style>
    .app-bar {
        display: flex;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
    }
    .drawer {
        position: absolute;
        right: 0;
        padding: 0 12px;
        height: 100%;
        max-width: 256px;
        background-color: rgba(219, 233, 255);
    }
    p {
        margin-top: 0;
        font-size: small;
    }
    label {
        display: block;
    }
    h2 {
        margin-top: 50px;
        font-weight: 400;
    }
    select {
        margin-bottom: 28px;
        width: 100%;
    }
</style>
