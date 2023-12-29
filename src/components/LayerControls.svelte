<script lang="ts">
    import Controls from './Controls.svelte'
    import Range from './Range.svelte'
    import { synthSettings } from '../state/stores'
    import TweakControl from './TweakControl.svelte'
    import Checkbox from './Checkbox.svelte'
    import { colorSeries, colors } from '../theme/colors'
    import CrossIcon from '../icons/CrossIcon.svelte'

    let activeLayerIndex = 0
    let numberOfLayers = 1
    let activeLayer = $synthSettings.layers[activeLayerIndex]
    let seed = activeLayer.seed
    let tweaks = activeLayer.tweaks
    let activeColor = colors[colorSeries[activeLayerIndex]].DEFAULT

    $: {
        if ($synthSettings && activeLayerIndex !== undefined) {
            if (numberOfLayers < $synthSettings.layers.length) {
                numberOfLayers = $synthSettings.layers.length
                activeLayerIndex = numberOfLayers - 1
            }
            activeLayer = $synthSettings.layers[activeLayerIndex]
            activeColor = colors[colorSeries[activeLayerIndex]].DEFAULT
            tweaks = activeLayer.tweaks
            seed = activeLayer.seed
        }
    }
</script>

<div class="flex">
    <div class={`px-2 pt-5 flex flex-col gap-1 h-full border-white-25 border-r ${$$props.class}`}>
        {#each $synthSettings.layers as layer, index}
            <div class="w-6 h-6 flex items-center justify-center nt-layer" class:nt-layer-active={activeLayerIndex === index} style={`--bg-color: ${colors[colorSeries[index]].DEFAULT}`}>
                <button
                    class="nt-layer-button"
                    on:click={() => {
                        activeLayerIndex = index
                    }}
                />
                {#if numberOfLayers > 1}
                    <button
                        class="nt-layer-delete-button"
                        on:click={() => {
                            if (index <= activeLayerIndex) {
                                activeLayerIndex = activeLayerIndex - 1
                            }
                            synthSettings.deleteLayer(index)
                            numberOfLayers -= numberOfLayers
                        }}
                    >
                        <CrossIcon style="height: 8px; width: 8px; stroke-width: 4px" />
                    </button>
                {/if}
            </div>
        {/each}
        {#if numberOfLayers < 5}
            <button class="w-6 h-6 text-white-65 flex items-center justify-center rounded-full hover:bg-white-5" on:click={synthSettings.newLayer}>
                <span> + </span>
            </button>
        {/if}
    </div>

    <Controls title="Seed:">
        <Range label="Number of Partials" min={1} max={100} onInput={(length) => synthSettings.updateSeed(activeLayerIndex, { length })} value={seed.length} color={activeColor} />
        <Range label="Start partial" min={1} max={20} onInput={(start) => synthSettings.updateSeed(activeLayerIndex, { start })} value={seed.start} color={activeColor} />
        <Range label="Transpose" min={0.1} max={4} step={0.005} onInput={(transposeTo) => synthSettings.updateSeed(activeLayerIndex, { transposeTo })} value={seed.transposeTo} color={activeColor} />
        <Range label="Stretch" min={0.1} max={2} step={0.005} onInput={(stretch) => synthSettings.updateSeed(activeLayerIndex, { stretch })} value={seed.stretch} color={activeColor} />
        <Range label="Amplitude slope" min={0} max={3} step={0.005} onInput={(slope) => synthSettings.updateSeed(activeLayerIndex, { slope })} value={seed.slope} color={activeColor} />
        <Range label="Amplitude" min={0} max={1} step={0.005} onInput={(amplitude) => synthSettings.updateSeed(activeLayerIndex, { amplitude })} value={seed.amplitude} color={activeColor} />
    </Controls>

    <Controls title="Tweak:">
        <Checkbox label="Enable" checked={tweaks.enabled} onChange={(enabled) => synthSettings.updateTweaks(activeLayerIndex, { enabled })} />
        {#each tweaks.value as tweak, index}
            <div class="flex">
                <span class="mr-1 text-white-65 pt-2">{index}:</span>
                <TweakControl
                    disabled={!tweaks.enabled}
                    value={tweak}
                    rateLimits={{
                        min: 0.5,
                        max: 2,
                    }}
                    amplitudeLimits={{
                        min: 0,
                        max: 2,
                    }}
                    onRateChange={index !== 0 ? (rate) => synthSettings.updateTweakValue(activeLayerIndex, index, { rate }) : undefined}
                    onAmplitudeChange={(amplitude) => synthSettings.updateTweakValue(activeLayerIndex, index, { amplitude })}
                    color={activeColor}
                />
            </div>
        {/each}
    </Controls>
</div>

<style lang="scss">
    .afterBgColor {
        &::after {
            background-color: var(--bg-color);
        }
    }

    .nt-layer {
        position: relative;

        &::after {
            content: '';
            border-radius: 100%;
            background-color: var(--bg-color);
            opacity: 0.5;
            position: absolute;
            width: 100%;
            height: 100%;
            transform: scale(0.4);
            transition: all;
            transition-duration: 250ms;
        }

        &:hover {
            &::after {
                width: 100%;
                height: 100%;
                transform: scale(0.9);
            }

            .nt-layer-delete-button {
                opacity: 1;
            }
        }

        &-active {
            &::after {
                opacity: 1;
                transform: scale(0.9);
            }
        }

        &-button {
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        &-delete-button {
            z-index: 2;
            position: absolute;
            right: -4px;
            top: -4px;
            opacity: 1;
            padding: 2px;
            background-color: rgba(255, 255, 255, 1);
            color: #05172f;
            border-radius: 100%;
            transition: all;
            transition-duration: 250ms;
            border: 1px solid transparent;
            opacity: 0;

            &:hover {
                border: 1px solid white;
            }
        }
    }
</style>
