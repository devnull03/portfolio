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

export interface ResumeEntry {
	id: string;
	title: string; // Position/Degree/Role/Project Name
	organization: string; // Company/Institution/Organization
	location: string;
	startDate: string;
	endDate: string;
	description: string;
	details: string[]; // Responsibilities/Coursework/Features/Achievements
	technologies?: string[];
	achievements?: string[];
	relatedProjects?: string[]; // References to project IDs
	category?: string; // For projects: "work-experience" | "personal" | "academic" | "freelance" | "hackathon"
	githubUrl?: string; // For projects
	previewItems?: PreviewItem[];
	gpa?: string; // For education
	field?: string; // For education
	degree?: string; // For education
}

export interface PreviewItem {
	link: string;
	title: string;
	image?: string;
}

// Skills/Languages Entry Structure
export interface SkillEntry {
	id: string;
	name: string;
	proficiency?: string; // For languages: 'Native' | 'Fluent' | 'Conversational' | 'Basic'
}

// Main Resume Structure
export interface Resume {
	contact: ContactInfo;
	summary?: string;
	resumeSections: {
		[sectionKey: string]: ResumeEntry[];
	};
	skillSections: {
		[sectionKey: string]: SkillEntry[];
	};
}
