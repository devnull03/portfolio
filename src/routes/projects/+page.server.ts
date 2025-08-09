import type { ServerLoad } from '@sveltejs/kit'
import type { Project } from '$lib/interfaces/sanity.types'
import { getProjectsByCategory } from '$lib/server/queries'

export const load: ServerLoad = async () => {
  // Return a Promise so the page can use {#await}
  const projectSections: Promise<Record<string, Project[]>> = getProjectsByCategory()
  return { projectSections }
}
