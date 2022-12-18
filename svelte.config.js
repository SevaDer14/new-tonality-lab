import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	preprocess: [
		preprocess({
			postcss: true,
		}),
		mdsvex({
			extensions: ['.md']
		})
	],
	kit: {
		adapter: adapter(),
	}
};

export default config;
