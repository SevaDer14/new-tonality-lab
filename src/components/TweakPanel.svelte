<script lang="ts">
    import Tweak from './Tweak.svelte'
    import Panel from './Panel.svelte'
    import { partials, generatedPartials, tweaks, tweaksEnabled } from '../state/stores'
    import Checkbox from './Checkbox.svelte'

    $: {
        $partials.forEach((partial, index) => {
            if ($tweaks[index] === undefined) {
                $tweaks.push({ ratio: 0, amplitude: 0 })
            }
        })
    }
</script>

<Panel title="tweak" >
    <Checkbox label="Enable" checked={$tweaksEnabled} onChange={(value) => ($tweaksEnabled = value)} />
    {#each $partials as partial, index}
        <Tweak
            index={index + 1}
            ratio={$generatedPartials[index].ratio}
            disabled={!$tweaksEnabled}
            amplitude={$generatedPartials[index].amplitude}
            initialValue={$tweaks[index]}
            ratioLimits={{
                min: index > 0 ? -($generatedPartials[index].ratio - $generatedPartials[index - 1].ratio) + 0.01 : 0,
                max: $generatedPartials.length <= 1 ? 1 : index < $generatedPartials.length - 1 ? $generatedPartials[index + 1]?.ratio - $generatedPartials[index].ratio - 0.01 : $generatedPartials[index]?.ratio - $generatedPartials[index - 1].ratio,
            }}
            amplitudeLimits={{
                min: -$generatedPartials[index].amplitude,
                max: 1 - $generatedPartials[index].amplitude,
            }}
            onRatioChange={index !== 0
                ? (value) => {
                      $tweaks[index].ratio = value
                  }
                : undefined}
            onAmplitudeChange={(value) => {
                $tweaks[index].amplitude = value
            }}
        />
    {/each}
</Panel>
