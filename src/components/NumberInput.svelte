<script lang="ts">
    export let value: number, min: number | undefined, max: number | undefined
    export let pixelRange = 100
    export let valueRange: number
    export let label: string

    let startX: number, startValue: number

    function clamp(num: number) {
        return Math.max(min ?? -Infinity, Math.min(num, max ?? +Infinity))
    }

    function pointerMove({ clientX }: { clientX: number }) {
        const valueDiff = (valueRange * (startX - clientX)) / pixelRange
        value = clamp(startValue - valueDiff)
    }

    function pointerDown({ clientX }: { clientX: number }) {
        startX = clientX
        startValue = value
        window.addEventListener('pointermove', pointerMove)
        window.addEventListener('pointerup', pointerUp)
    }

    function pointerUp() {
        window.removeEventListener('pointermove', pointerMove)
        window.removeEventListener('pointerup', pointerUp)
    }
</script>

<div class="text-xs block px-2 py-1 max-w-fit border select-none cursor-ew-resize" on:pointerdown={pointerDown}>
    {label}: {value.toFixed(2)}
</div>
