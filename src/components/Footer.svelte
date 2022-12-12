<script lang="ts">
    import KoFiIcon from './icons/KoFiIcon.svelte'
    import YouTubeIcon from './icons/YouTubeIcon.svelte'
    import TwitterIcon from './icons/TwitterIcon.svelte'
    import MailIcon from './icons/MailIcon.svelte'
    import MenuItem from './MenuItem.svelte'
    import BandcampIcon from './icons/BandcampIcon.svelte'
</script>

<footer class="w-full absolute left-0 bottom-0 flex justify-center bg-white-5 py-4 border-t border-white-65">
    <ul class="flex justify-center">
        <MenuItem href="https://ko-fi.com/newtonality">
            <KoFiIcon />
        </MenuItem>

        <MenuItem href="https://offcast.bandcamp.com/album/redemption">
            <BandcampIcon />
        </MenuItem>

        <MenuItem href="https://www.youtube.com/@new_tonality">
            <YouTubeIcon />
        </MenuItem>

        <MenuItem href="https://twitter.com/new_tonality">
            <TwitterIcon />
        </MenuItem>
        
        <MenuItem href="mailto: info@newtonality.net">
            <MailIcon />
        </MenuItem>
    </ul>
</footer>
