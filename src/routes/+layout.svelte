<script>
    import TopNav from '../components/TopNav.svelte'
    import '../app.css'
</script>

<div class="font-fira-mono text-white bg-radial-gradient h-screen">
    <TopNav />
    <slot />
</div>
