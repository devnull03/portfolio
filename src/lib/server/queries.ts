import type { Contact, Project, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import sanity from './sanity'

const experienceSort = `order(coalesce(select(endDate == 9999-12-31 => null, endDate), startDate) desc)`;

const PROJECTS_QUERY = `*[_type == "project"]{
  ...,
  preview[]{
    ...,
    image{
      ...,
      "url": asset->url
    }
  }
} | ${experienceSort}`
const RESUME_ENTRIES_QUERY = `*[_type == "resumeEntry"]{
  ...,
  relatedProjects[]->{
    title,
    url,
    githubUrl,
    identifier,
    preview[]{
      ...,
      image{
        ...,
        "url": asset->url
      }
    }
  }
} | ${experienceSort}`
const SKILL_SECTIONS_QUERY = `*[_type == "skillSection"]`
const CONTACT_QUERY = `*[_type == "contact"][0]{
  ...,
  resumePdf{
    "url": asset->url
  }
}`

export async function getProjects(): Promise<Project[]> {
  const data = sanity.fetch<Project[]>(PROJECTS_QUERY)
  return data
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const query = `*[_type == "project" && identifier.current == $slug][0]{
    ...,
    preview[]{
      ...,
      image{
        ...,
        "url": asset->url
      }
    }
  }`
  const doc = sanity.fetch<Project | null>(query, { slug })
  return doc
}

export async function getResumeEntries(): Promise<ResumeEntry[]> {
  const data = sanity.fetch<ResumeEntry[]>(RESUME_ENTRIES_QUERY)
  return data
}

export async function getResumeEntriesByCategory(): Promise<Record<string, ResumeEntry[]>> {
  const entries = await getResumeEntries()
  const grouped: Record<string, ResumeEntry[]> = {}
  for (const entry of entries) {
    const key = entry.category ?? 'uncategorized'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  }
 
  const ORDER: string[] = [
    'work-experience',
    'education',
    'volunteering',
  ]
  const ordered: Record<string, ResumeEntry[]> = {}
  for (const k of ORDER) {
    if (grouped[k]?.length) ordered[k] = grouped[k]
  }
  const remaining = Object.keys(grouped)
    .filter((k) => !ORDER.includes(k))
    .sort((a, b) => a.localeCompare(b))
  for (const k of remaining) ordered[k] = grouped[k]
  return ordered
}

export async function getSkillSections(): Promise<SkillSection[]> {
  return sanity.fetch<SkillSection[]>(SKILL_SECTIONS_QUERY)
}

export async function getContactInfo(): Promise<Contact | null> {
  const doc = sanity.fetch<Contact | null>(CONTACT_QUERY)
  return doc
}
