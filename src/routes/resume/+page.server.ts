import type { PageServerLoad } from './$types'
import type { Contact, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import { getContactInfo, getResumeEntriesByCategory, getSkillSections } from '$lib/server/queries'

export const load: PageServerLoad = async () => {
	const resumeSections: Promise<Record<string, ResumeEntry[]>> = getResumeEntriesByCategory()
	const skills: Promise<SkillSection[]> = getSkillSections()
	const contact: Promise<Contact | null> = getContactInfo()

	// console.log(resumeSections, skills, contact);
	return { resumeSections, skills, contact }
}
