import type { PageServerLoad } from './$types'
import { getProjectsByCategory } from '$lib/server/content'

export const load: PageServerLoad = () => ({
	projectSections: getProjectsByCategory()
})
