import type { PageServerLoad } from './$types'
import { getContactInfo, getResumeEntriesByCategory, getResumePageProjects, getSkillSections } from '$lib/server/content'

export const load: PageServerLoad = () => ({
	resumeSections: getResumeEntriesByCategory(),
	skills: getSkillSections(),
	contact: getContactInfo(),
	projects: getResumePageProjects()
})
