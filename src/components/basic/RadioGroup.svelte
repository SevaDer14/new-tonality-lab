<script lang="ts">
    export let legend = ''
</script>

<!-- TODO: consider passing down state and labels instead of slot -->
<fieldset class="bg-white-5 mb-2 p-4 rounded-2xl relative w-10/12">
    <legend class="text-xs text-white-65 mb-5 relative top-5">{legend}</legend>
    <slot />
</fieldset>

<style>
</style>
