<script lang="ts">
    import { boardSpan, pitches, tuning } from '../state/stores.js'

    type Key = {
        marker: {
            offsetX: number
            opacity: number
        }
        isPlayable: boolean
        pitch: number
        ratio: string
        ratioNum: number
        key?: string
    }

    const ROOT_NOTE = 220
    const RANGE_PADDING = 1.1
    const NOTE_CORRELATION_THRESHOLD = 0.1

    let boardWidth: number
    let keys: Key[] = []
    let range = [ROOT_NOTE / RANGE_PADDING, ROOT_NOTE * RANGE_PADDING]
    let sustain = false

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

            for (let i = 0; i < $tuning.length; i++) {
                const offsetX = toLinearScale(ROOT_NOTE * $tuning[i].ratio)
                if (offsetX > 0 && offsetX < boardWidth) {
                    const isPlayable = $tuning[i].correlation > NOTE_CORRELATION_THRESHOLD
                    const opacity = isPlayable ? Math.sqrt($tuning[i].correlation) : $tuning[i].correlation
                    newKeys.push({
                        marker: {
                            offsetX,
                            opacity,
                        },
                        isPlayable,
                        pitch: $tuning[i].ratio * ROOT_NOTE,
                        ratio: `${$tuning[i].fraction[0]}:${$tuning[i].fraction[1]}`,
                        ratioNum: $tuning[i].fraction[0] / $tuning[i].fraction[1],
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
            const newPitch = {
                pitch: key.pitch,
                velocity: velocityCurve(key.pitch),
                keyRatio: key.ratioNum,
                voiceId: key.ratio,
            }

            if (!$pitches.find((pitch) => pitch.voiceId === key.ratio)) {
                $pitches = [...$pitches, newPitch]
            }

            window.synth.play(newPitch)
        }
    }

    function handleKeyRelease(key: Key) {
        if (window.synth && sustain === false) {
            const index = $pitches.findIndex((pitch) => pitch.voiceId === key.ratio)

            if (index !== undefined) {
                $pitches = $pitches.toSpliced(index, 1)
            }

            window.synth.release(key.ratio)
        }
    }

    function releaseAll() {
        if (window.synth) {
            $pitches = []
            window.synth.releaseAll()
        }
    }

    function toggleSustain() {
        sustain = !sustain
    }
</script>

<div class="overflow-hidden relative h-full w-full transition-colors ease-in-out duration-300" bind:clientWidth={boardWidth}>
    {#each keys as key}
        <button
            class="z-1 absolute h-full top-0 w-2 -transalte-x-1 bg-white touch-none"
            style={`
                left: ${key.marker.offsetX}px; 
                opacity: ${key.marker.opacity}; 
                pointer-events: ${key.isPlayable ? 'auto' : 'none'}    
            `}
            on:pointerdown={key.isPlayable ? () => handleKeyPress(key) : undefined}
            on:pointerup={() => handleKeyRelease(key)}
            on:contextmenu={disableEvent}
            on:selectionchange={disableEvent}
        />
    {/each}
</div>
<div class="flex flex-col w-12 border-l-[1px] border-white-25 text-xs text-white-65">
    <button class="border-b-[1px] border-white-25 p-2 hover:text-white" on:pointerdown={releaseAll}>Mute</button>
    <button class="border-b-[1px] border-white-25 p-2 hover:text-white" class:bg-white-5={sustain} on:pointerdown={toggleSustain}>Sus</button>
</div>
