import type { ServerLoad } from '@sveltejs/kit'
import type { ContactInfo, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import { getContactInfo, getResumeEntriesByCategory, getSkillSections } from '$lib/server/queries'

export const load: ServerLoad = async () => {
  // Return Promises for Svelte {#await}
  const resumeSections: Promise<Record<string, ResumeEntry[]>> = getResumeEntriesByCategory()
  const skills: Promise<SkillSection[]> = getSkillSections()
  const contact: Promise<ContactInfo | null> = getContactInfo()

  return { resumeSections, skills, contact }
}
