import type { Resume } from '../interfaces/resume.interface';

export const resumeData: Resume = {
	contact: {
		name: "Arnav Mehta",
		title: "Software Developer / Student",
		email: "arnav.mehta@student.ufv.ca",
		phone: "778-598-9036",
		location: "Burnaby, BC",
		website: "https://dvnl.work",
		linkedin: "https://linkedin.com/in/devnull03",
		github: "https://github.com/devnull03",
		resume: "https://dvnl.work/resume",
		resumePdf: "https://dvnl.work/data/resume.pdf"
	},

	summary: "Software Developer / Student with experience in full-stack development, API design, and cloud computing.",

	education: [
		{
			institution: "University of the Fraser Valley",
			degree: "Bachelor of Science",
			field: "Computer Science, with Co-operative education",
			startDate: "May 2022",
			endDate: "Apr 2026 (Expected Graduation)",
			location: "Abbotsford, BC",
			description: "Focused on software engineering, data structures, and algorithms"
		}
	],

	experience: [
		{
			id: "south-asian-studies-institute-undergraduate-research-assistant-web-developer",
			company: "South Asian Studies Institute, University of the Fraser Valley",
			position: "Undergraduate Research Assistant / Web Developer",
			startDate: "August 2022",
			endDate: "Present",
			location: "Abbotsford, BC",
			description: "Crafted engaging interactive content and streamlined website management with automated solutions",
			responsibilities: [
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
			company: "University of the Fraser Valley",
			position: "Teaching Assistant",
			startDate: "Sep 2024",
			endDate: "Dec 2024",
			location: "Abbotsford, BC",
			description: "Providing feedback and learning support to students",
			responsibilities: [
				"Provided academic support and feedback to students",
				"Assisted with course material and assignments",
				"Facilitated learning through one-on-one and group sessions"
			],
			technologies: ["Teaching", "Academic Support"],
			relatedProjects: []
		},
		{
			id: "it-service-desk-lab-monitor",
			company: "IT Service Desk, University of the Fraser Valley",
			position: "Lab Monitor",
			startDate: "Oct 2022",
			endDate: "Apr 2024",
			location: "Abbotsford, BC",
			description: "Tech/Product support for university IT services",
			responsibilities: [
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
			company: "IDS.company",
			position: "Full-Stack Engineer",
			startDate: "May 2022",
			endDate: "July 2024",
			location: "Remote",
			description: "Led website overhaul and implemented scalable solutions for improved user experience",
			responsibilities: [
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
			company: "Job Unicorn",
			position: "Software Engineering Intern",
			startDate: "Feb 2022",
			endDate: "Apr 2022",
			location: "Mumbai, India",
			description: "Engineered backend services and developed advanced web scraping systems",
			responsibilities: [
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

	projects: [
		"slap-game",
		"zkare", 
		"portfolio-website",
		"sustainsnap"
	],

	skills: [
		{
			category: "Programming Languages",
			skills: [
				{ name: "Python", level: "Advanced", category: "Programming Languages" },
				{ name: "TypeScript", level: "Advanced", category: "Programming Languages" },
				{ name: "JavaScript", level: "Advanced", category: "Programming Languages" },
				{ name: "Go", level: "Intermediate", category: "Programming Languages" },
				{ name: "C/C++", level: "Intermediate", category: "Programming Languages" },
				{ name: "Rust", level: "Intermediate", category: "Programming Languages" },
				{ name: "SQL", level: "Advanced", category: "Programming Languages" },
				{ name: "Ruby on Rails", level: "Intermediate", category: "Programming Languages" }
			]
		},
		{
			category: "Frameworks & Software",
			skills: [
				{ name: "React.js", level: "Advanced", category: "Frameworks & Software" },
				{ name: "Svelte", level: "Advanced", category: "Frameworks & Software" },
				{ name: "Next.js", level: "Advanced", category: "Frameworks & Software" },
				{ name: "Tailwind CSS", level: "Advanced", category: "Frameworks & Software" },
				{ name: "Node.js", level: "Advanced", category: "Frameworks & Software" },
				{ name: "Express.js", level: "Advanced", category: "Frameworks & Software" },
				{ name: "FastAPI", level: "Advanced", category: "Frameworks & Software" },
				{ name: "AngularJS", level: "Intermediate", category: "Frameworks & Software" },
				{ name: "React Native", level: "Intermediate", category: "Frameworks & Software" },
				{ name: "Mobile Applications", level: "Intermediate", category: "Frameworks & Software" }
			]
		},
		{
			category: "Databases & Cloud",
			skills: [
				{ name: "MongoDB", level: "Advanced", category: "Databases & Cloud" },
				{ name: "PostgreSQL", level: "Advanced", category: "Databases & Cloud" },
				{ name: "MySQL", level: "Advanced", category: "Databases & Cloud" },
				{ name: "Google Cloud Platform", level: "Intermediate", category: "Databases & Cloud" },
				{ name: "Redis", level: "Intermediate", category: "Databases & Cloud" }
			]
		},
		{
			category: "Development Tools",
			skills: [
				{ name: "Git", level: "Advanced", category: "Development Tools" },
				{ name: "Jira", level: "Advanced", category: "Development Tools" },
				{ name: "Agile/Scrum", level: "Advanced", category: "Development Tools" },
				{ name: "Docker", level: "Advanced", category: "Development Tools" },
				{ name: "CI/CD Pipelines", level: "Advanced", category: "Development Tools" },
				{ name: "WebRTC", level: "Intermediate", category: "Development Tools" },
				{ name: "API Development", level: "Advanced", category: "Development Tools" },
				{ name: "Test-Driven Development (TDD)", level: "Advanced", category: "Development Tools" }
			]
		}
	],

	languages: [
		{ name: "English", proficiency: "Native" },
		{ name: "Hindi", proficiency: "Native" },
		{ name: "Punjabi", proficiency: "Fluent" },
		{ name: "Japanese", proficiency: "Conversational" }
	],

	volunteer: [
		{
			organization: "Japanese Culture Club, University of the Fraser Valley",
			role: "Club Secretary",
			startDate: "Sep 2023",
			endDate: "Present",
			description: "Facilitated club events and managed member communications",
			location: "Abbotsford, BC",
			responsibilities: [
				"Facilitated club events, boosting attendance by 25% through proactive promotion and concise scheduling",
				"Handled member updates and announcements on social media, ensuring everyone stayed informed of upcoming activities",
				"Compiled clear meeting records, maintaining an organized log of decisions and tasks for future reference"
			],
			achievements: [
				"Increased club event attendance by 25%",
				"Improved member engagement through effective communication"
			]
		},
		{
			organization: "UFV International, University of the Fraser Valley",
			role: "Student Ambassador",
			startDate: "Apr 2022",
			endDate: "Jan 2023",
			description: "Welcomed prospective students and promoted campus offerings",
			location: "Abbotsford, BC",
			responsibilities: [
				"Welcomed prospective students, highlighting campus offerings and improving enrollment interest by 15%",
				"Provided recommendations tailored to individual goals, showcasing adaptability and thorough program knowledge",
				"Resolved diverse student inquiries, fostering positive experiences and promoting strong institutional loyalty"
			],
			achievements: [
				"Improved enrollment interest by 15%",
				"Enhanced prospective student experience through personalized guidance"
			]
		}
	]
};
