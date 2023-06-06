<script lang="ts">
    import Tweak from './basic/Tweak.svelte'
    import Panel from './basic/Panel.svelte'
    import { spectrum } from '../state/stores'
    import Checkbox from './basic/Checkbox.svelte'
    import type { PointSeriesValue } from 'src/xentonality'

    $: {
        if (tweaks !== undefined && tweaksEnabled !== undefined) {
            applyTweaks()
        }
    }

    let tweaksEnabled = true
    let tweaks: PointSeriesValue = $spectrum.tweaks

    function applyTweaks() {
        if (tweaksEnabled === true) {
            spectrum.tweak(tweaks)
        } else {
            spectrum.tweak(tweaks.map(() => [1, 1]))
        }
    }

    function handleDisable(value: boolean) {
        tweaksEnabled = value
    }

    function setTweakRatio(index: number, ratio: number) {
        tweaks[index][0] = ratio
    }

    function setTweakAmp(index: number, amplitude: number) {
        tweaks[index][1] = amplitude
    }
</script>

<Panel title="tweak" maxContentHeight="400px">
    <Checkbox label="Enable" checked={tweaksEnabled} onChange={handleDisable} />
    {#each $spectrum.partials.value as partial, index}
        <Tweak
            index={index + 1}
            ratio={$spectrum.nonTweakedPartials.value[index][0]}
            disabled={!tweaksEnabled}
            amplitude={$spectrum.nonTweakedPartials.value[index][1]}
            initialValue={$spectrum.tweaks[index]}
            onRatioChange={index !== 0
                ? (value) => {
                      setTweakRatio(index, value)
                  }
                : undefined}
            onAmplitudeChange={(value) => {
                setTweakAmp(index, value)
            }}
        />
    {/each}
</Panel>
