<script lang="ts">
    import { fundamental, playing } from '../state/stores.js'

    const LOWEST_NOTE = 55
    const NR_OCTAVES = 4
    const BOARD_PADDING_LOW = 3
    const BOARD_PADDING_HIGH = BOARD_PADDING_LOW ** (NR_OCTAVES - 0.5)
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

            octaveMarkings = markings
        }
    }

    const getNote = (offsetX: number) => {
        if (boardWidth === undefined) return LOWEST_NOTE

        return Math.floor(toLogScale(offsetX))
    }

    const setNote = (offsetX: number) => {
        noteOffset = offsetX
        $fundamental = getNote(offsetX)
    }

    const play = (event: MouseEvent) => {
        setNote(event.offsetX)
        $playing = true
        console.log(octaveMarkings)
    }

    const stop = () => {
        $playing = false
    }

    const changeNote = (event: MouseEvent) => {
        if (!$playing) return

        setNote(event.offsetX)
    }
</script>

<div class="relative h-full w-full transition-colors ease-in-out duration-500" class:bg-white-5={!$playing} bind:clientWidth={boardWidth} on:mousedown={play} on:mousemove={changeNote} on:mouseleave={stop} on:mouseup={stop}>
    <span class="absolute right-0 top-0 p-2">{$fundamental} Hz</span>
    <span class="blur-[2px] absolute top-0 h-full w-1 bg-white pointer-events-none transition-opacity ease-in-out duration-500" class:opacity-100={$playing} class:opacity-0={!$playing} style={`left: ${noteOffset}px`} />

    {#each octaveMarkings as marking}
        <span class="pointer-events-none absolute h-full bg-white-25 w-[1px] top-0" style={`left: ${marking}px`} />
    {/each}
</div>
