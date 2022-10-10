<script lang="ts">
    import SettingsDrawer from '../../components/SettingsDrawer.svelte'
    import PlotsSection from '../../components/PlotsSection.svelte'
</script>

<div class="page">
    <SettingsDrawer />
    <PlotsSection />
</div>

<style>
    .page {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>
