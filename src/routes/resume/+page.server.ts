import type { PageServerLoad } from './$types'
import type { Contact, Project, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import { getContactInfo, getResumeEntriesByCategory, getResumePageProjects, getSkillSections } from '$lib/server/queries'

export const load: PageServerLoad = async () => {
	const resumeSections: Promise<Record<string, ResumeEntry[]>> = getResumeEntriesByCategory()
	const skills: Promise<SkillSection[]> = getSkillSections()
	const contact: Promise<Contact | null> = getContactInfo()
	const projects: Promise<Project[]> = getResumePageProjects()

	return { resumeSections, skills, contact, projects }
}
