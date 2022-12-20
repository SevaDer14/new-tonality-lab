import { redirect } from '@sveltejs/kit'

export const ssr = false;

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  throw redirect(307, '/lab');
}
