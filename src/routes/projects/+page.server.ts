import type { ServerLoad } from '@sveltejs/kit'
import type { Project } from '$lib/interfaces/sanity.types'
import { getProjects } from '$lib/server/queries'

export const load: ServerLoad = async () => {
  // Return a Promise so the page can use {#await}
  const projects: Promise<Project[]> = getProjects()
  return { projects }
}
