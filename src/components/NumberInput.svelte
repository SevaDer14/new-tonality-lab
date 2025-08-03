<script lang="ts">
    import { onMount } from 'svelte'
    import throttle from 'lodash/throttle'
    import debounce from 'lodash/debounce'

    export let defaultValue: number
    export let value = defaultValue,
        min: number = -Infinity,
        max: number = +Infinity
    export let pixelRange = 100
    export let valueRange: number
    export let debouncedValue: number = defaultValue
    export let label: string
    export let onInput: undefined | ((v: number) => void) = undefined
    export let whole = false
    export let nonRessetable = false

    let active = false

    const setDebouncedValue = debounce((v: number) => {
        debouncedValue = v
    }, 50)

    const setValue = throttle(
        (v) => {
            value = v
            if (onInput) onInput(v)
        },
        10,
        { leading: false }
    )

    let startY: number, startValue: number, fine: boolean

    const padding = valueRange <= 0.1 ? 4 : valueRange < 100 ? 3 : 0
    $: inputWidth = Math.floor(value).toString().length + padding

    function clamp(num: number) {
        const val = Math.max(min, Math.min(num, max))
        if (whole) return Math.floor(val)
        return val
    }

    function pointerMove({ clientY }: { clientY: number }) {
        let range = valueRange

        if (valueRange > 1 && fine) range = whole ? valueRange / 10 : 1
        if (valueRange <= 1 && fine) range = whole ? 1 : 0.1

        const valueDiff = (range * (clientY - startY)) / pixelRange
        const val = clamp(startValue - valueDiff)

        setValue(val)
        setDebouncedValue(val)
    }

    function handleFineAdjustment({ shiftKey }: { shiftKey: boolean }) {
        fine = shiftKey
    }

    function reset() {
        value = defaultValue
    }

    function pointerDown({ clientY }: { clientY: number }) {
        startY = clientY
        startValue = value
        active = true
        window.addEventListener('pointermove', pointerMove)
        window.addEventListener('pointerup', pointerUp)
    }

    onMount(() => {
        window.addEventListener('keydown', handleFineAdjustment)
        window.addEventListener('keyup', handleFineAdjustment)

        return () => {
            fine = false

            window.removeEventListener('keydown', handleFineAdjustment)
            window.removeEventListener('keyup', handleFineAdjustment)
        }
    })

    function pointerUp() {
        active = false
        window.removeEventListener('pointermove', pointerMove)
        window.removeEventListener('pointerup', pointerUp)
    }
</script>

<div class={`relative text-xs px-2 py-1 max-w-fit flex items-center gap-1 pr-3 ${active ? 'text-white' : 'text-white-65'} hover:text-white cursor-ns-resize ${$$props.class}`} on:pointerdown={pointerDown}>
    <span class="select-non">{label}:</span>
    <input
        type="number"
        bind:value
        class="cursor-ns-resize bg-transparent w-12 outline-none hide-arrow"
        style={`width: ${inputWidth}ch`}
        on:input={(e) => {
            // @ts-ignore valueAsNumber does exist on target
            const val = e?.target?.valueAsNumber
            if (!val) return
            if (onInput) onInput(val)
        }}
    />

    {#if !nonRessetable && value !== defaultValue}
        <button on:click={reset} class="absolute top-[0.5px] right-0 rounded-full h-3 w-3 hover:bg-white-25 leading-none">×</button>
    {/if}
</div>
