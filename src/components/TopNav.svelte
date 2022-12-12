<script lang="ts">
    import { page } from '$app/stores'
    import MenuItem from './MenuItem.svelte'

    const setActive = (pageRouteId: string | null, routeId: string): boolean => {
        return pageRouteId === null ? false : pageRouteId === routeId
    }
</script>

<header class="bg-white-5 py-4 border-b border-white-65 font-fjalla-one tracking-wider">
    <nav class="container mx-auto px-4 flex justify-between items-center">
        <h1 class="text-3xl px-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-75">
            <a href="/">NEW TONALITY</a>
        </h1>
        <ul class="flex">
            <MenuItem href="/" active={setActive($page.routeId, 'lab')}>Lab</MenuItem>
            <MenuItem href="/about" active={setActive($page.routeId, 'about')}>About</MenuItem>
        </ul>
    </nav>
</header>
