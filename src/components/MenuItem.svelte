<script lang="ts">
    export let href: string
    export let active = false
</script>

<li class={`mx-4 align-middle flex items-center hover:opacity-100 ${active ? "opacity-100 underline underline-offset-4" : "opacity-75"}`}>
    <a {href}>
        <slot />
    </a>
</li>
