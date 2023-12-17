<script lang="ts">
    import { pitch } from '../state/stores.js'

    const LOWEST_NOTE = 55
    const NR_OCTAVES = 2
    const BOARD_PADDING_LOW = 3
    const BOARD_PADDING_HIGH = BOARD_PADDING_LOW ** (NR_OCTAVES * 1.2)
    const RANGE = [LOWEST_NOTE - BOARD_PADDING_LOW, LOWEST_NOTE * 2 ** NR_OCTAVES + BOARD_PADDING_HIGH]

    let boardWidth: number
    let noteOffset: number
    let octaveMarkings: number[] = []

    const toLinearScale = (val: number) => {
        const safeValue = Math.abs(val) || 1
        const b = boardWidth / Math.log(RANGE[1] / RANGE[0])
        const a = -1 * b * Math.log(RANGE[0])

        return a + b * Math.log(safeValue)
    }

    const toLogScale = (val: number) => {
        const safeValue = Math.abs(val)

        const a = RANGE[0]
        const b = Math.log(RANGE[1] / RANGE[0]) / (boardWidth - 1)

        return a * Math.exp(b * safeValue)
    }

    $: {
        if (boardWidth !== undefined) {
            let markings = []

            for (let i = 0; i < NR_OCTAVES + 1; i++) {
                markings.push(toLinearScale(LOWEST_NOTE * 2 ** i))
            }
            stop
            octaveMarkings = markings
        }
    }

    const disableEvent = (event: Event) => {
        event.preventDefault()
        event.stopPropagation()
        return false
    }

    const getPitch = (offsetX: number) => {
        if (boardWidth === undefined) return LOWEST_NOTE

        return Math.floor(toLogScale(offsetX) * 100) / 100
    }

    const setPitch = (offsetX: number) => {
        noteOffset = offsetX
        $pitch = getPitch(offsetX)
    }

    const play = (event: PointerEvent) => {
        setPitch(event.offsetX)
    }

    const stop = () => {
        $pitch = null
    }

    const changePitch = (event: PointerEvent) => {
        if (!$pitch) return

        setPitch(event.offsetX)
    }
</script>

<div class="touch-none relative h-full w-full transition-colors ease-in-out duration-300" class:bg-white-5={!$pitch} bind:clientWidth={boardWidth} on:contextmenu={disableEvent} on:pointerdown={play} on:selectionchange={disableEvent} on:pointermove={changePitch} on:pointerleave={stop} on:pointerup={stop}>
    <span class="blur-[2px] absolute top-0 h-full w-1 bg-white pointer-events-none touch-none transition-opacity ease-in-out duration-500" class:opacity-100={$pitch} class:opacity-0={!$pitch} style={`left: ${noteOffset}px`} />

    {#each octaveMarkings as marking}
        <span class="pointer-events-none touch-none absolute h-full bg-white-25 w-[1px] top-0" style={`left: ${marking}px`} />
    {/each}
</div>
