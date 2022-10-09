<script lang="ts">
    import { spectrumType } from '../state/stores.js'
</script>

<fieldset>
    <legend>Spectrum Type:</legend>
    <div class="radio-container">
        <input type="radio" id="harmonic" name="spectrumType" value="harmonic" checked bind:group={$spectrumType} />
        <label for="harmonic">Harmonic</label>
    </div>

    <div class="radio-container">
        <input type="radio" id="stretched" name="spectrumType" value="stretched" bind:group={$spectrumType} />
        <label for="stretched">Stretched</label>
    </div>

    <div class="radio-container">
        <input type="radio" id="edo" name="spectrumType" value="edo" bind:group={$spectrumType} />
        <label for="edo">Edo</label>
    </div>
</fieldset>

<style>
    .radio-container {
        display: flex;
        flex-direction: row;
        line-height: 100%;
        margin-bottom: 6px;
        vertical-align: bottom;
    }
    fieldset {
        margin: 18px 0px 36px 0px;
    }
</style>
