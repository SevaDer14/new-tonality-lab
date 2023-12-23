<script lang="ts">
    import TweakControl from './TweakControl.svelte'
    import Controls from './Controls.svelte'
    import { spectrumTemplate, tweaks } from '../state/stores'
    import Checkbox from './Checkbox.svelte'
    import type { Partial } from '../synth'

    let partials: Partial[] = $spectrumTemplate[0].partials
    let enabled: boolean = true

    $: {
        $tweaks = partials.map(() => ({ rate: 1, amplitude: 1 }))
    }
</script>

<Controls title="Tweak:">
    <Checkbox label="Enable" checked={enabled} onChange={(value) => (enabled = value)} />
    {#each partials as partial, index}
        <TweakControl
            rate={partial.rate}
            disabled={!enabled}
            amplitude={partial.amplitude}
            initialValue={$tweaks[index]}
            rateLimits={{
                min: 0.5,
                max: 2,
            }}
            amplitudeLimits={{
                min: 0,
                max: 1 / partial.amplitude,
            }}
            onRateChange={index !== 0
                ? (value) => {
                      $tweaks[index].rate = value
                  }
                : undefined}
            onAmplitudeChange={(value) => {
                $tweaks[index].amplitude = value
            }}
        />
    {/each}
</Controls>
