<script>
    import TopNav from '../components/TopNav.svelte'
    import Footer from '../components/Footer.svelte'
    import '../app.css'
</script>

<div class="font-fira-mono text-white bg-radial-gradient h-screen">
    <TopNav />
    <slot />
    <Footer />
</div>
