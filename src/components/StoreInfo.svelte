<script lang="ts">
    import { fundamental, numberOfPartials, sampleRate, sampleDuration, sampleName } from '../state/stores.js'
</script>

<div class="store-observer">
    <p>fundamental: {$fundamental}</p>
    <p>numberOfPartials:  {$numberOfPartials}</p>
    <p>sampleRate:  {$sampleRate}</p>
    <p>sampleDuration:  {$sampleDuration}</p>
    <p>sampleName:  {$sampleName}</p>
</div>

<style>
    .store-observer {
        position: absolute;
        right: 0;
        top: 50px;
        padding-right: 12px;
        text-align: end;
    }
    p {
        margin-top: 0;
        margin-bottom: 6px;
        opacity: 0.5;
        font-size: small;
    }
</style>
