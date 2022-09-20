<script lang="ts">
    import { fundamental, numberOfPartials, sampleRate, sampleDuration, sampleName } from '../state/stores.js'
</script>

<div class="store-observer">
    <span>fundamental: {$fundamental}</span>
    <span>numberOfPartials: {$numberOfPartials}</span>
    <span>sampleRate: {$sampleRate}</span>
    <span>sampleDuration: {$sampleDuration}</span>
    <span>sampleName: {$sampleName}</span>
</div>

<style>
    .store-observer {
        position: absolute;
        padding-left: 12px;
        padding-top: 12px;
    }
    span {
        margin-right: 8px;
        opacity: 0.5;
        font-size: small;
    }
</style>
