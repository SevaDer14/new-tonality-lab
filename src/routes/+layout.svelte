<script>
    import TopNav from '../components/TopNav.svelte'
    import Footer from '../components/Footer.svelte'
    import '../app.css'
</script>

<div class="font-fira-mono text-white bg-radial-gradient h-screen">
    <TopNav />
    <div class="container m-auto p-8 flex flex-wrap ">
        <slot />
    </div>
    <Footer />
</div>
