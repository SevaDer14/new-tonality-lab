<script lang="ts">
    export let open: boolean
    import { fundamental, numberOfPartials, sampleRate, sampleName, sampleDuration } from '../state/stores.js'
</script>

{#if open === true}
    <div class="container">
        <h2 style="margin-top: 100px">SPECTRUM</h2>

        <label for="fundamental">Fundamental</label>
        <input bind:value={$fundamental} id="fundamental" />
        <p>in Hz</p>

        <label for="number_of_partials">Number of partials</label>
        <input bind:value={$numberOfPartials} id="number_of_partials" />
        <p>max 1000</p>

        <h2>EXPORT</h2>
        <label for="sample_rate">Sample Rate</label>
        <select bind:value={$sampleRate} id="sample_rate">
            <option value={44100}>44100 Hz</option>
            <option value={48000}>48000 Hz</option>
            <option value={96000}>96000 Hz</option>
        </select>

        <label for="duartion">Duration</label>
        <input bind:value={$sampleDuration} id="duration" />
        <p>in seconds</p>

        <label for="name">Name</label>
        <input bind:value={$sampleName} id="name" />
        <p>files will have that name</p>
    </div>
{/if}

<style>
    .container {
        position: absolute;
        right: 0;
        padding: 0 12px;
        height: 100%;
        max-width: 256px;
        background-color: rgb(238, 238, 238);
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
