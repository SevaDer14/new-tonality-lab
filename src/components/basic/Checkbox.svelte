<script lang="ts">
    export let label = ''
    export let checked = false
    export let onChange: (arg: boolean) => any

    const id = Math.random().toString()

    const handleChange = (event: any) => {
        onChange(event.target.checked)
    }
</script>

<div class={`flex items-center my-2 relative ${$$props.class}`}>
    <input type="checkbox" {id} name={`checkbox-${id}`} bind:checked on:change={handleChange} />
    <label for={id}>{label}</label>
    <div class="custom-checkbox" />
</div>

<style>
    input[type='checkbox'] {
        opacity: 0;
        margin-right: 12px;
        height: 18px;
        width: 18px;
    }
    .custom-checkbox {
        position: absolute;
        border: 1px solid white;
        height: 18px;
        width: 18px;
        pointer-events: none;
    }
    .custom-checkbox:after {
        content: '';
        position: absolute;
        display: none;
        left: 5px;
        bottom: 5px;
        width: 6px;
        height: 12px;
        border: solid white;
        border-width: 0 1px 1px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        pointer-events: none;
    }
    input[type='checkbox']:checked ~ .custom-checkbox:after {
        display: block;
    }
</style>
