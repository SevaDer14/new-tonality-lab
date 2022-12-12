<script>
    import TopNav from '../components/TopNav.svelte'
    import Footer from '../components/Footer.svelte'
    import '../app.css'
</script>

<div class="relative font-fira-mono text-white bg-radial-gradient h-full min-h-screen">
    <TopNav />
    <div class="container m-auto p-8 pb-20 flex flex-wrap justify-center">
        <slot />
    </div>
    <Footer />
</div>
