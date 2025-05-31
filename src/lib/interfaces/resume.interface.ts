// Resume interfaces for TypeScript

export interface ContactInfo {
	name: string;
	title?: string;
	email: string;
	phone?: string;
	location: string;
	website?: string;
	linkedin?: string;
	github?: string;
	resume?: string;
	resumePdf?: string;
}

export interface Education {
	//   id: string;
	institution: string;
	degree: string;
	field?: string;
	startDate: string;
	endDate: string;
	gpa?: string;
	location: string;
	description?: string;
	coursework?: string[];
	achievements?: string[];
}

export interface Experience {
	id: string;
	company: string;
	position: string;
	startDate: string;
	endDate: string;
	location: string;
	description: string;
	responsibilities: string[];
	technologies?: string[];
	achievements?: string[];
	relatedProjects?: string[];
}


export interface Skill {
	name: string;
	level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	category: string;
}

export interface SkillCategory {
	category: string;
	skills: Skill[];
}

export interface Certification {
	//   id: string;
	name: string;
	issuer: string;
	issueDate: string;
	expiryDate?: string;
	credentialId?: string;
	url?: string;
}

export interface Award {
	//   id: string;
	name: string;
	issuer: string;
	date: string;
	description?: string;
}

export interface Language {
	name: string;
	proficiency: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface Volunteer {
	//   id: string;
	organization: string;
	role: string;
	startDate: string;
	endDate: string;
	description: string;
	location?: string;
	responsibilities?: string[];
	achievements?: string[];
}

export interface Resume {
	contact: ContactInfo;
	summary?: string;
	education: Education[];
	experience: Experience[];
	additionalExperience?: Experience[];
	projects: string[];
	skills: SkillCategory[];
	certifications?: Certification[];
	awards?: Award[];
	languages: Language[];
	volunteer: Volunteer[];
	interests?: string[];
}

// Component prop interfaces for Svelte 5
export interface ContactInfoProps {
	contact: ContactInfo;
	summary?: string;
}

export interface EducationSectionProps {
	education: Education[];
}

export interface ExperienceSectionProps {
	experience: Experience[];
}


export interface SkillsSectionProps {
	skills: SkillCategory[];
}

export interface LanguagesSectionProps {
	languages: Language[];
}

export interface VolunteerSectionProps {
	volunteer: Volunteer[];
}

export interface ResumeNavigationProps {
	sections: Array<{ id: string; title: string; }>;
	activeSection?: string;
}

export interface ResumeSectionProps {
	id: string;
	title: string;
	className?: string;
	children?: any;
}