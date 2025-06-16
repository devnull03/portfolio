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

// Unified Resume Entry for Experience, Education, Volunteer, Projects
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
	liveUrl?: string; // For projects
	gpa?: string; // For education
	field?: string; // For education
	degree?: string; // For education
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
