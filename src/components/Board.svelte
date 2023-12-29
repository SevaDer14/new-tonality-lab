<script lang="ts">
    import { boardSpan } from '../state/stores.js'
    import type { Spectrum } from '../synth/types.js'
    import { getAllPartials } from '../xentonality/spectrum.js'
    import { getTuning, type Tuning } from '../xentonality/tuning.js'

    export let spectrum: Spectrum | undefined

    type Key = {
        marker: {
            offsetX: number
            opacity: number
        }
        isPlayable: boolean
        pitch: number
        ratio: string
        key?: string
    }

    const ROOT_NOTE = 220
    const RANGE_PADDING = 1.1
    const NOTE_CORRELATION_THRESHOLD = 0.1

    let boardWidth: number
    let keys: Key[] = []
    let partials
    let tuning: Tuning
    let range = [ROOT_NOTE / RANGE_PADDING, ROOT_NOTE * RANGE_PADDING]

    $: {
        if (spectrum) {
            partials = getAllPartials(spectrum)
            tuning = getTuning(partials)
        }
    }

    const toLinearScale = (val: number) => {
        const safeValue = Math.abs(val) || 1
        const b = boardWidth / Math.log(range[1] / range[0])
        const a = -1 * b * Math.log(range[0])

        return a + b * Math.log(safeValue)
    }

    $: {
        if (boardWidth !== undefined && $boardSpan) {
            const LOWEST_RANGE = ROOT_NOTE / $boardSpan
            const HIGHEST_RANGE = ROOT_NOTE * $boardSpan
            range = [LOWEST_RANGE / RANGE_PADDING, HIGHEST_RANGE * RANGE_PADDING]

            let newKeys: typeof keys = []

            for (let i = 0; i < tuning.length; i++) {
                const offsetX = toLinearScale(ROOT_NOTE * tuning[i].ratio)
                if (offsetX > 0 && offsetX < boardWidth) {
                    const isPlayable = tuning[i].correlation > NOTE_CORRELATION_THRESHOLD
                    const opacity = isPlayable ? Math.sqrt(tuning[i].correlation) : tuning[i].correlation
                    newKeys.push({
                        marker: {
                            offsetX,
                            opacity,
                        },
                        isPlayable,
                        pitch: tuning[i].ratio * ROOT_NOTE,
                        ratio: `${tuning[i].fraction[0]}:${tuning[i].fraction[1]}`,
                    })
                }
            }

            keys = newKeys
        }
    }

    const disableEvent = (event: Event) => {
        event.preventDefault()
        event.stopPropagation()
        return false
    }

    function velocityCurve(pitch: number) {
        return pitch > 440 ? 0.06 : 20 / pitch
    }

    function handleKeyPress(key: Key) {
        if (window.synth) {
            window.synth.play({ pitch: key.pitch, velocity: velocityCurve(key.pitch), voiceId: key.ratio })
        }
    }

    function handleKeyRelease(key: Key) {
        if (window.synth) {
            window.synth.release(key.ratio)
        }
    }
</script>

<div class="overflow-hidden touch-none relative h-full w-full transition-colors ease-in-out duration-300" bind:clientWidth={boardWidth} on:contextmenu={disableEvent} on:selectionchange={disableEvent}>
    {#each keys as key}
        <button
            class="z-1 absolute h-full top-0 w-2 -transalte-x-1 bg-white"
            style={`
                left: ${key.marker.offsetX}px; 
                opacity: ${key.marker.opacity}; 
                pointer-events: ${key.isPlayable ? 'auto' : 'none'}    
            `}
            on:pointerdown={key.isPlayable ? () => handleKeyPress(key) : undefined}
            on:pointerup={() => handleKeyRelease(key)}
        />
    {/each}
</div>
