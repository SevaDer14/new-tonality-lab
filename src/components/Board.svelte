<script lang="ts">
    import { pitch } from '../state/stores.js'
    import type { Spectrum } from '../synth/types.js'
    import { colors } from '../theme/colors'
    import { getAllPartials } from '../xentonality/spectrum.js'
    import { getTuning, type Tuning } from '../xentonality/tuning.js'

    export let spectrum: Spectrum | undefined

    const LOWEST_NOTE = 55
    const ROOT_NOTE = 110
    const NR_OCTAVES = 2
    const BOARD_PADDING_LOW = 3
    const BOARD_PADDING_HIGH = BOARD_PADDING_LOW ** (NR_OCTAVES * 1.2)
    const RANGE = [LOWEST_NOTE - BOARD_PADDING_LOW, LOWEST_NOTE * 2 ** NR_OCTAVES + BOARD_PADDING_HIGH]
    const NOTE_CORRELATION_THRESHOLD = 0.1

    let boardWidth: number
    let noteOffset: number

    let noteMarkers: { offsetX: number; opacity: number; isPlayable: boolean; pitch: number }[] = []

    let partials
    let tuning: Tuning

    $: {
        if (spectrum) {
            partials = getAllPartials(spectrum)
            tuning = getTuning(partials)
        }
    }

    const toLinearScale = (val: number) => {
        const safeValue = Math.abs(val) || 1
        const b = boardWidth / Math.log(RANGE[1] / RANGE[0])
        const a = -1 * b * Math.log(RANGE[0])

        return a + b * Math.log(safeValue)
    }

    $: {
        if (boardWidth !== undefined) {
            let markers: typeof noteMarkers = []

            for (let i = 0; i < tuning.length; i++) {
                const offsetX = toLinearScale(ROOT_NOTE * tuning[i].ratio)
                if (offsetX > 0 && offsetX < boardWidth) {
                    const isPlayable = tuning[i].correlation > NOTE_CORRELATION_THRESHOLD
                    const opacity = isPlayable ? Math.sqrt(tuning[i].correlation) : tuning[i].correlation
                    markers.push({ offsetX, opacity, isPlayable, pitch: tuning[i].ratio * ROOT_NOTE })
                }
            }

            noteMarkers = markers
        }
    }

    const disableEvent = (event: Event) => {
        event.preventDefault()
        event.stopPropagation()
        return false
    }

    function playPitch(newPitch: number) {
        $pitch = newPitch
    }

    function releasePitch() {
        $pitch = null
    }
</script>

<div class="overflow-hidden touch-none relative h-full w-full transition-colors ease-in-out duration-300" bind:clientWidth={boardWidth} on:contextmenu={disableEvent} on:selectionchange={disableEvent}>
    <span class="blur-[2px] absolute top-0 h-full w-1 bg-white -translate-x-[2px] pointer-events-none touch-none transition-opacity ease-in-out duration-500" class:opacity-100={$pitch} class:opacity-0={!$pitch} style={`left: ${noteOffset}px`} />

    {#each noteMarkers as { offsetX, opacity, isPlayable, pitch }}
        <button
            class="z-1 absolute h-full top-0 w-2 -transalte-x-1"
            style={`
                left: ${offsetX}px; 
                opacity: ${opacity}; 
                background-color: ${isPlayable ? colors.green.DEFAULT : colors.white.DEFAULT};
                pointer-events: ${isPlayable ? 'auto' : 'none'}    
            `}
            on:pointerdown={isPlayable ? () => playPitch(pitch) : undefined}
            on:pointerup={releasePitch}
        />
    {/each}
</div>
