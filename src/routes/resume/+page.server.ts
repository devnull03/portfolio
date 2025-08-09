import type { ServerLoad } from '@sveltejs/kit'
import type { Contact, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import { getContactInfo, getResumeEntriesByCategory, getSkillSections } from '$lib/server/queries'

export const load: ServerLoad = async () => {
  const resumeSections: Promise<Record<string, ResumeEntry[]>> = getResumeEntriesByCategory()
  const skills: Promise<SkillSection[]> = getSkillSections()
  const contact: Promise<Contact | null> = getContactInfo()

  return { resumeSections, skills, contact }
}
