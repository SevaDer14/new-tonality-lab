<script lang="ts">
    import KoFiIcon from './icons/KoFiIcon.svelte'
    import YouTubeIcon from './icons/YouTubeIcon.svelte'
    import TwitterIcon from './icons/TwitterIcon.svelte'
    import MailIcon from './icons/MailIcon.svelte'
    import MenuItem from './MenuItem.svelte'
</script>

<footer class="w-full absolute left-0 bottom-0 flex justify-center bg-white-5 py-4 border-t border-white-65">
    <ul class="flex justify-center">
        <MenuItem href="/">
            <KoFiIcon />
        </MenuItem>

        <MenuItem href="/">
            <YouTubeIcon />
        </MenuItem>

        <MenuItem href="/">
            <TwitterIcon />
        </MenuItem>
        
        <MenuItem href="/">
            <MailIcon />
        </MenuItem>
    </ul>
</footer>
