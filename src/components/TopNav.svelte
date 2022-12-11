<script lang="ts">
    import { page } from '$app/stores'

    const setActiveClass = (pageRouteId: string | null, routeId: string): string => {
        return pageRouteId === null ? '' : pageRouteId === routeId ? 'text-white underline underline-offset-4' : 'text-white-65 hover:text-white'
    }
</script>

<header class="bg-white-5 py-4 border-b border-white-65 font-fjalla-one tracking-wider">
    <nav class="container mx-auto flex justify-between items-center">
        <h1 class="px-8 text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent opacity-75">
            <a href="/">NEW TONALITY</a>
        </h1>
        <ul class="flex">
            <li class={`px-8 ${setActiveClass($page.routeId, 'lab')}`}>
                <a href="/"> Lab </a>
            </li>
            <li class={`px-8 ${setActiveClass($page.routeId, 'about')}`}>
                <a href="/about"> About </a>
            </li>
        </ul>
    </nav>
</header>
