import type { Resume } from '../interfaces/resume.interface';

export const resumeData: Resume = {
	contact: {
		name: "Arnav Mehta",
		title: "Software Developer / Student",
		email: "arnav.mehta@student.ufv.ca",
		location: "Burnaby, BC",
		website: "https://dvnl.work",
		linkedin: "https://linkedin.com/in/devnull03",
		github: "https://github.com/devnull03",
		resume: "https://dvnl.work/resume",
		resumePdf: "https://dvnl.work/data/resume.pdf"
	},

	summary: "Software Developer / Student with experience in full-stack development, API design, and cloud computing.",

	resumeSections: {
		"Experience": [
			{
				id: "south-asian-studies-institute-undergraduate-research-assistant-web-developer",
				title: "Undergraduate Research Assistant / Web Developer",
				organization: "South Asian Studies Institute, University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "August 2022",
				endDate: "Present",
				description: "Crafted engaging interactive content and streamlined website management with automated solutions",
				details: [
					"Crafted engaging interactive content, increasing user engagement by 200% and social media shares",
					"Streamlined website updates with PHP and Collective Access, improving loading speeds by 40%",
					"Automated metadata management with Python using custom algorithms, cutting task completion time by 80%",
					"Improved digital archive accessibility through optimized data management workflows"
				],
				technologies: ["PHP", "Python", "Collective Access", "Web Development"],
				achievements: [
					"Increased user engagement by 200%",
					"Improved loading speeds by 40%",
					"Reduced task completion time by 80%"
				],
				relatedProjects: ["sacda-digital-archive", "union-zindabad-exhibit", "discriminatory-laws-timeline", "komagata-maru-lesson-plans"]
			},
			{
				id: "university-of-the-fraser-valley-teaching-assistant",
				title: "Teaching Assistant",
				organization: "University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "Sep 2024",
				endDate: "Dec 2024",
				description: "Providing feedback and learning support to students",
				details: [
					"Provided academic support and feedback to students",
					"Assisted with course material and assignments",
					"Facilitated learning through one-on-one and group sessions"
				],
				technologies: ["Teaching", "Academic Support"],
				relatedProjects: []
			},
			{
				id: "it-service-desk-lab-monitor",
				title: "Lab Monitor",
				organization: "IT Service Desk, University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "Oct 2022",
				endDate: "Apr 2024",
				description: "Tech/Product support for university IT services",
				details: [
					"Provided technical support to students and faculty",
					"Monitored computer lab operations",
					"Troubleshot hardware and software issues",
					"Assisted with IT service desk operations"
				],
				technologies: ["IT Support", "Hardware Troubleshooting", "Customer Service"],
				relatedProjects: []
			},
			{
				id: "ids-company-full-stack-engineer",
				title: "Full-Stack Engineer",
				organization: "IDS.company",
				location: "Remote",
				startDate: "May 2022",
				endDate: "July 2024",
				description: "Led website overhaul and implemented scalable solutions for improved user experience",
				details: [
					"Directed the overhaul of the project website's 2nd redesign with scalable transition strategy",
					"Integrated 10+ new features within 3 weeks, increasing daily active users by 25%",
					"Architected and refined core logic for post management, accelerating content moderation workflows by 35%",
					"Fostered collaboration between frontend and backend teams across different time zones"
				],
				technologies: ["Full-Stack Development", "Frontend", "Backend", "Content Management"],
				achievements: [
					"Increased daily active users by 25%",
					"Improved content moderation workflows by 35%",
					"Enhanced page load speeds by 40%",
					"Increased team efficiency by 20%"
				],
				relatedProjects: ["the-garden-platform"]
			},
			{
				id: "job-unicorn-software-engineering-intern",
				title: "Software Engineering Intern",
				organization: "Job Unicorn",
				location: "Mumbai, India",
				startDate: "Feb 2022",
				endDate: "Apr 2022",
				description: "Engineered backend services and developed advanced web scraping systems",
				details: [
					"Engineered and deployed backend services using TypeScript and Golang",
					"Developed advanced web scraping system with Express.js and Puppeteer",
					"Built and optimized RESTful APIs for enhanced analytics integration",
					"Collaborated with business intelligence teams and stakeholders"
				],
				technologies: ["TypeScript", "Golang", "Express.js", "Puppeteer", "RESTful APIs"],
				achievements: [
					"Improved server response times by 40%",
					"Reduced memory consumption by 20%",
					"Increased data retrieval speed by 10x",
					"Cut API request failures by 60%",
					"Reduced data retrieval latency by 35%"
				],
				relatedProjects: ["job-unicorn-platform"]
			}
		],

		"Education": [
			{
				id: "university-of-the-fraser-valley-computer-science",
				title: "Bachelor of Science",
				organization: "University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "May 2022",
				endDate: "Apr 2026 (Expected Graduation)",
				description: "Focused on software engineering, data structures, and algorithms",
				details: [
					"Computer Science, with Co-operative education",
					"Focused on software engineering, data structures, and algorithms",
					"Relevant coursework in full-stack development and system design"
				],
				field: "Computer Science, with Co-operative education",
				degree: "Bachelor of Science",
				relatedProjects: []
			}
		],

		"Projects": [
			{
				id: "slap-game",
				title: "Slap Game",
				organization: "Personal Project",
				location: "Remote",
				startDate: "2024",
				endDate: "2024",
				description: "Interactive web-based game with real-time multiplayer functionality",
				details: [
					"Built with modern web technologies",
					"Real-time multiplayer capabilities",
					"Responsive design for mobile and desktop"
				],
				category: "personal",
				technologies: ["JavaScript", "WebRTC", "Socket.io"],
				relatedProjects: []
			},
			{
				id: "zkare",
				title: "ZKare",
				organization: "Hackathon Project",
				location: "Remote",
				startDate: "2024",
				endDate: "2024",
				description: "Healthcare management system with privacy-focused features",
				details: [
					"Privacy-focused healthcare data management",
					"Zero-knowledge proof implementation",
					"Secure patient data handling"
				],
				category: "hackathon",
				technologies: ["React", "Node.js", "Cryptography"],
				relatedProjects: []
			},
			{
				id: "portfolio-website",
				title: "Portfolio Website",
				organization: "Personal Project",
				location: "Remote",
				startDate: "2024",
				endDate: "Present",
				description: "Modern portfolio website showcasing projects and skills",
				details: [
					"Built with SvelteKit and modern web technologies",
					"Responsive design with interactive animations",
					"Optimized for performance and accessibility"
				],
				category: "personal",
				technologies: ["SvelteKit", "TypeScript", "Tailwind CSS"],
				githubUrl: "https://github.com/devnull03/portfolio",
				liveUrl: "https://dvnl.work",
				relatedProjects: []
			},
			{
				id: "sustainsnap",
				title: "SustainSnap",
				organization: "Academic Project",
				location: "Abbotsford, BC",
				startDate: "2023",
				endDate: "2024",
				description: "Sustainability tracking application for environmental impact monitoring",
				details: [
					"Environmental impact tracking and visualization",
					"Data analytics for sustainability metrics",
					"User-friendly interface for habit tracking"
				],
				category: "academic",
				technologies: ["React Native", "Firebase", "Data Visualization"],
				relatedProjects: []
			}
		],

		"Volunteer": [
			{
				id: "japanese-culture-club-secretary",
				title: "Club Secretary",
				organization: "Japanese Culture Club, University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "Sep 2023",
				endDate: "Present",
				description: "Facilitated club events and managed member communications",
				details: [
					"Facilitated club events, boosting attendance by 25% through proactive promotion and concise scheduling",
					"Handled member updates and announcements on social media, ensuring everyone stayed informed of upcoming activities",
					"Compiled clear meeting records, maintaining an organized log of decisions and tasks for future reference"
				],
				achievements: [
					"Increased club event attendance by 25%",
					"Improved member engagement through effective communication"
				],
				relatedProjects: []
			},
			{
				id: "ufv-international-student-ambassador",
				title: "Student Ambassador",
				organization: "UFV International, University of the Fraser Valley",
				location: "Abbotsford, BC",
				startDate: "Apr 2022",
				endDate: "Jan 2023",
				description: "Welcomed prospective students and promoted campus offerings",
				details: [
					"Welcomed prospective students, highlighting campus offerings and improving enrollment interest by 15%",
					"Provided recommendations tailored to individual goals, showcasing adaptability and thorough program knowledge",
					"Resolved diverse student inquiries, fostering positive experiences and promoting strong institutional loyalty"
				],
				achievements: [
					"Improved enrollment interest by 15%",
					"Enhanced prospective student experience through personalized guidance"
				],
				relatedProjects: []
			}
		]
	},

	skillSections: {
		"Programming Languages": [
			{ id: "python", name: "Python" },
			{ id: "typescript", name: "TypeScript" },
			{ id: "javascript", name: "JavaScript" },
			{ id: "go", name: "Go" },
			{ id: "cpp", name: "C/C++" },
			{ id: "rust", name: "Rust" },
			{ id: "sql", name: "SQL" },
			{ id: "ruby", name: "Ruby on Rails" }
		],
		"Frameworks & Software": [
			{ id: "react", name: "React.js" },
			{ id: "svelte", name: "Svelte" },
			{ id: "nextjs", name: "Next.js" },
			{ id: "tailwind", name: "Tailwind CSS" },
			{ id: "nodejs", name: "Node.js" },
			{ id: "express", name: "Express.js" },
			{ id: "fastapi", name: "FastAPI" },
			{ id: "angular", name: "AngularJS" },
			{ id: "reactnative", name: "React Native" },
			{ id: "mobile", name: "Mobile Applications" }
		],
		"Databases & Cloud": [
			{ id: "mongodb", name: "MongoDB" },
			{ id: "postgresql", name: "PostgreSQL" },
			{ id: "mysql", name: "MySQL" },
			{ id: "gcp", name: "Google Cloud Platform" },
			{ id: "redis", name: "Redis" }
		],
		"Development Tools": [
			{ id: "git", name: "Git" },
			{ id: "jira", name: "Jira" },
			{ id: "agile", name: "Agile/Scrum" },
			{ id: "docker", name: "Docker" },
			{ id: "cicd", name: "CI/CD Pipelines" },
			{ id: "webrtc", name: "WebRTC" },
			{ id: "api", name: "API Development" },
			{ id: "tdd", name: "Test-Driven Development (TDD)" }
		],
		"Languages": [
			{ id: "english", name: "English", proficiency: "Native" },
			{ id: "hindi", name: "Hindi", proficiency: "Native" },
			{ id: "punjabi", name: "Punjabi", proficiency: "Fluent" },
			{ id: "japanese", name: "Japanese", proficiency: "Conversational" }
		]
	}
};


export const getSectionKeys = (): string[] => {
	return Object.keys(resumeData.resumeSections);
}

export const getSkillSectionKeys = (): string[] => {
	return Object.keys(resumeData.skillSections);
}
