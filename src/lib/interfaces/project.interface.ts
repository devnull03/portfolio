
export interface Project {
	id: string;
	name: string;
	description: string;
	technologies: string[];
	category: "work-experience" | "personal" | "academic" | "freelance" | "hackathon";
	startDate?: string;
	endDate?: string;
	githubUrl?: string;
	liveUrl?: string;
	features: string[];
	role?: string;
}

