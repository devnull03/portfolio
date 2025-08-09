import type { ContactInfo, Project, ResumeEntry, SkillSection } from '$lib/interfaces/sanity.types'
import sanity from './sanity'

const PROJECTS_QUERY = `*[_type == "project"]`
const RESUME_ENTRIES_QUERY = `*[_type == "resumeEntry"]`
const SKILL_SECTIONS_QUERY = `*[_type == "skillSection"]`
const CONTACT_QUERY = `*[_type == "contactInfo"][0]`

function parseDate(d?: string): number | null {
  if (!d) return null
  const ts = Date.parse(d)
  return Number.isNaN(ts) ? null : ts
}

function sortByExperience<T extends { startDate?: string; endDate?: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => {
    const aEnd = parseDate(a.endDate)
    const bEnd = parseDate(b.endDate)
    const aStart = parseDate(a.startDate)
    const bStart = parseDate(b.startDate)
    const aOngoing = aEnd === null
    const bOngoing = bEnd === null
    if (aOngoing && !bOngoing) return -1
    if (!aOngoing && bOngoing) return 1
    if (aOngoing && bOngoing) return (bStart ?? 0) - (aStart ?? 0)
    if (bEnd !== aEnd) return (bEnd ?? 0) - (aEnd ?? 0)
    return (bStart ?? 0) - (aStart ?? 0)
  })
}

export async function getProjects(): Promise<Project[]> {
  const data = await sanity.fetch<Project[]>(PROJECTS_QUERY)
  return sortByExperience(data)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const query = `*[_type == "project" && identifier.current == $slug][0]`
  const doc = await sanity.fetch<Project | null>(query, { slug })
  return doc ?? null
}

export async function getResumeEntries(): Promise<ResumeEntry[]> {
  const data = await sanity.fetch<ResumeEntry[]>(RESUME_ENTRIES_QUERY)
  return sortByExperience(data)
}

export async function getResumeEntriesByCategory(): Promise<Record<string, ResumeEntry[]>> {
  const entries = await getResumeEntries()
  const grouped: Record<string, ResumeEntry[]> = {}
  for (const entry of entries) {
    const key = entry.category ?? 'uncategorized'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  }
  for (const k of Object.keys(grouped)) {
    grouped[k] = sortByExperience(grouped[k])
  }
  const ORDER: string[] = [
    'work-experience',
    'education',
    'academic',
    'freelance',
    'hackathon',
    'personal',
    'uncategorized',
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

export async function getContactInfo(): Promise<ContactInfo | null> {
  const doc = await sanity.fetch<ContactInfo | null>(CONTACT_QUERY)
  return doc ?? null
}
