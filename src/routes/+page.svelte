<script lang="ts">
    import { toPlotJSCurve } from '../xentonality/utils'
    import { partialsToSpectrum } from '../xentonality/spectrum'
    import Plot from '../components/Plot.svelte'
    import SettingsDrawer from '../components/SettingsDrawer.svelte'
    import StoreInfo from '../components/StoreInfo.svelte'
    import { spectrum, dissonanceCurve } from '../state/stores.js'
    import { colors } from '../theme/colors'

    const dissonanceCurveChartOptions = {
        color: colors.blue,
        label: 'Sensory Dissonance',
        axes: {
            x: { label: 'cents' },
            y: { label: 'Sensory Dissonance' },
        },
    }

    const spectrumChartOptions = {
        color: colors.blue,
        label: 'Spectrum',
        axes: {
            x: { label: 'Hz' },
            y: { label: 'Amplitude' },
        },
    }
</script>

<StoreInfo />
<SettingsDrawer />

<Plot options={spectrumChartOptions} data={toPlotJSCurve({ xUnit: 'Hz', curve: $spectrum })} />
<Plot options={dissonanceCurveChartOptions} data={toPlotJSCurve({ xUnit: 'cents', curve: $dissonanceCurve.curve })} />

<style>
</style>
