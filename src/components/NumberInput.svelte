<script lang="ts">
    export let defaultValue: number
    export let value = defaultValue,
        min: number = -Infinity,
        max: number = +Infinity
    export let pixelRange = 100
    export let valueRange: number
    export let label: string
    export let debouncedValue: number = defaultValue
    export let onInput: (v: number) => void = () => {}
    export let whole = false

    let timer: NodeJS.Timeout
    let active = false

    const debounce = (v: number) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            debouncedValue = v
        }, 50)
    }

    let startY: number, startValue: number, fine: boolean

    const padding = valueRange <= 0.1 ? 4 : valueRange < 100 ? 3 : 0
    $: test = Math.floor(value).toString().length + padding

    function clamp(num: number) {
        const val = Math.max(min, Math.min(num, max))
        if (whole) return Math.floor(val)
        return val
    }

    function pointerMove({ clientY }: { clientY: number }) {
        const range = valueRange > 1 && fine ? 1 : valueRange <= 1 && fine ? 0.1 : valueRange
        const valueDiff = (range * (clientY - startY)) / pixelRange
        value = clamp(startValue - valueDiff)
    }

    $: debounce(value)
    $: onInput(value)

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
        window.addEventListener('keydown', handleFineAdjustment)
        window.addEventListener('keyup', handleFineAdjustment)
    }

    function pointerUp() {
        active = false
        window.removeEventListener('pointermove', pointerMove)
        window.removeEventListener('pointerup', pointerUp)
        window.removeEventListener('keydown', handleFineAdjustment)
        window.removeEventListener('keyup', handleFineAdjustment)
    }
</script>

<div class={`relative text-xs px-2 py-1 max-w-fit flex items-center gap-1 pr-3 ${active ? 'text-white' : 'text-white-65'} hover:text-white cursor-ns-resize`} on:pointerdown={pointerDown}>
    <span class="select-non">{label}:</span>
    <input type="number" bind:value class="cursor-ns-resize bg-transparent w-12 outline-none hide-arrow" style={`width: ${test}ch`} />

    {#if value !== defaultValue}
        <button on:click={reset} class="absolute top-[0.5px] right-0 rounded-full h-3 w-3 hover:bg-white-25 leading-none">×</button>
    {/if}
</div>
