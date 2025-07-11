
import type { ResumeEntry } from './resume.interface';

export interface Project extends ResumeEntry {
	category: "work-experience" | "personal" | "academic" | "freelance" | "hackathon";
}

export type ProjectID = Project["id"];
