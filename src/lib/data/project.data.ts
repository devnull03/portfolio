import type { Project } from '../interfaces/project.interface';

export const projects: Project[] = [
	{
		id: "slap-game",
		title: "Slap Game",
		organization: "nwHacks 2025",
		location: "Vancouver, BC",
		category: "hackathon",
		description: "Built an interactive multiplayer slap battle game for nwHacks 2025, integrating MediaPipe for real-time facial and hand tracking alongside WebRTC for low-latency peer-to-peer video streaming, reducing game lag by 50%.",
		details: [
			"Real-time facial and hand tracking with MediaPipe",
			"Low-latency peer-to-peer video streaming with WebRTC",
			"Solidity-based smart contracts for secure in-game wagers",
			"Deployed via Hardhat with 100+ decentralized transactions",
			"Zero security breaches",
			"50% reduction in game lag"
		],
		technologies: ["Next.js", "WebRTC", "Express.js", "Socket.IO", "MediaPipe", "Solidity", "Hardhat"],
		startDate: "Jan 2025",
		endDate: "Jan 2025",
		githubUrl: "https://github.com/devnull03/nwhacks25-nameTBA"
	},
	{
		id: "zkare",
		title: "zKare",
		organization: "ETH Global Waterloo 2023",
		location: "Waterloo, ON",
		category: "hackathon",
		description: "Developed a decentralized healthcare data platform that won the EAS Best Privacy-Preserving Project and The Graph Prize Pool at ETH Global Waterloo 2023, processing 10,000+ secure transactions.",
		details: [
			"Zero-knowledge proofs for secure, anonymous patient-researcher data sharing",
			"Reduced unauthorized access by 85%",
			"Improved healthcare data interoperability",
			"Won EAS Best Privacy-Preserving Project",
			"Won The Graph Prize Pool at ETH Global Waterloo 2023",
			"Processed 10,000+ secure transactions"
		],
		technologies: ["Python", "FastAPI", "Next.js", "Ethereum Attestation Service", "Solidity"],
		startDate: "June 2023",
		endDate: "June 2023",
		previewItems: [
			{
				link: "https://ethglobal.com/showcase/zkare-nxt7h",
				title: "ETH Global Showcase"
			}
		]
	},
	{
		id: "portfolio-website",
		title: "Portfolio Website",
		organization: "Personal Project",
		location: "Remote",
		category: "personal",
		description: "A modern, responsive portfolio website built with SvelteKit and TailwindCSS featuring dark mode, smooth animations, and optimized performance.",
		details: [
			"Responsive design with mobile-first approach",
			"Dark/light mode toggle",
			"Smooth scroll animations",
			"SEO optimized",
			"Fast loading times"
		],
		technologies: ["SvelteKit", "TypeScript", "TailwindCSS", "Vite"],
		startDate: "June 2025",
		endDate: "Present",
		githubUrl: "https://github.com/devnull03/portfolio",
		previewItems: [
			{
				link: "https://dvnl.work",
				title: "Live Site"
			}
		]
	},
	{
		id: "sustainsnap",
		title: "SustainSnap",
		organization: "NWhacks UBC",
		location: "Vancouver, BC",
		category: "hackathon",
		description: "Spearheaded the development of SustainSnap, a mobile web application at the NWhacks UBC hackathon, designed to tackle environmental challenges through waste management. Integrated OpenAI's GPT-4 for image recognition, enabling users to accurately identify different types of garbage and receive guidance on correct disposal methods, promoting recycling and sustainability.",
		details: [
			"Mobile web application for waste management",
			"Intuitive and responsive UI with SvelteKit and Tailwind CSS",
			"Express.js backend integration",
			"OpenAI GPT-4 powered image recognition for garbage classification",
			"Guidance for correct disposal methods",
			"Promotes recycling and sustainability efforts"
		],
		technologies: ["SvelteKit", "Tailwind CSS", "Express.js", "OpenAI GPT-4", "MongoDB"],
		startDate: "Jan 2024",
		endDate: "Jan 2024",
		githubUrl: "https://github.com/RichardOhata/SustainSnap"
	},
	{
		id: "booksplore",
		title: "Booksplore",
		organization: "Programming Addicts Codejam",
		location: "Remote",
		category: "hackathon",
		description: "Developed a winning website called Booksplore as part of a codejam, using Vue.js, TypeScript, Tailwind CSS, FastAPI, and Python. Implemented responsive web design and RESTful APIs for data retrieval.",
		details: [
			"Responsive web design",
			"RESTful API for data retrieval",
			"Full-stack development with Vue.js and FastAPI",
			"Collaborative codejam project",
			"Award-winning implementation"
		],
		technologies: ["Vue.js", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "REST APIs", "Node.js", "React.js", "Git"],
		startDate: "Jun 2021",
		endDate: "Jul 2021",
		githubUrl: "https://github.com/Programming-Addicts/BookSplore"
	},
	{
		id: "job-unicorn-platform",
		title: "Job Unicorn Platform",
		organization: "Job Unicorn",
		location: "Mumbai, India",
		category: "work-experience",
		description: "A decentralized platform for finding and hiring the best talent, connecting employers with skilled professionals through innovative blockchain-based solutions.",
		details: [
			"Decentralized talent marketplace",
			"Advanced web scraping system for job data aggregation",
			"RESTful APIs for enhanced analytics integration",
			"Backend services with TypeScript and Golang",
			"Improved server response times by 40%",
			"Reduced data retrieval latency by 35%"
		],
		technologies: ["TypeScript", "Golang", "Express.js", "Puppeteer", "RESTful APIs", "Blockchain", "Decentralized Systems"],
		startDate: "Feb 2022",
		endDate: "Apr 2022",
		githubUrl: "https://github.com/Job-Unicorn",
		previewItems: [
			{
				link: "https://github.com/Job-Unicorn",
				title: "GitHub Repository"
			}
		]
	},
	{
		id: "the-garden-platform",
		title: "The Garden Platform",
		organization: "IDS.company",
		location: "Remote",
		category: "work-experience",
		description: "The Garden is a creative platform where talents showcase their creativity and connect with fellow creatives. Developed interactive content and streamlined website management with automated solutions, increasing user engagement significantly.",
		details: [
			"Creative talent showcase platform",
			"Interactive content creation tools",
			"Community connection features",
			"Increased daily active users by 25%",
			"Enhanced page load speeds by 40%",
			"Improved content moderation workflows by 35%"
		],
		technologies: ["PHP", "Python", "Web Development", "Content Management", "Full-Stack Development"],
		startDate: "May 2022",
		endDate: "July 2024",
		previewItems: [
			{
				link: "https://thegarden.gg/explore",
				title: "Live Platform"
			}
		]
	},
	{
		id: "sacda-digital-archive",
		title: "South Asian Canadian Digital Archive (SACDA)",
		organization: "South Asian Studies Institute, University of the Fraser Valley",
		location: "Abbotsford, BC",
		category: "work-experience",
		description: "A pan-Canadian digital archive documenting the history and heritage of the South Asian diaspora in Canada. Developed interactive exhibits and automated metadata management systems to preserve and share cultural heritage materials.",
		details: [
			"Digital heritage preservation platform",
			"Interactive historical exhibits",
			"Automated metadata management with Python",
			"Improved digital archive accessibility",
			"Increased user engagement by 200%",
			"Reduced task completion time by 80%"
		],
		technologies: ["PHP", "Python", "Collective Access", "Web Development", "Digital Archive Systems"],
		startDate: "August 2022",
		endDate: "Present",
		previewItems: [
			{
				link: "https://sacda.ca/",
				title: "SACDA Website"
			}
		]
	},
	{
		id: "union-zindabad-exhibit",
		title: "Union Zindabad! Digital Exhibit",
		organization: "South Asian Studies Institute, University of the Fraser Valley",
		location: "Abbotsford, BC",
		category: "work-experience",
		description: "An interactive digital exhibit exploring South Asian labor history in Canada, featuring immersive storytelling and historical documentation through modern web technologies.",
		details: [
			"Interactive historical storytelling",
			"Digital exhibit platform",
			"Cultural heritage documentation",
			"Enhanced user engagement through interactive content",
			"Preservation of South Asian labor history"
		],
		technologies: ["PHP", "Web Development", "Digital Exhibits", "Historical Documentation"],
		startDate: "March 2024",
		endDate: "October 2024",
		previewItems: [
			{
				link: "https://sacda.ca/exhibits/union-zindabad/",
				title: "Union Zindabad Exhibit"
			}
		]
	},
	{
		id: "discriminatory-laws-timeline",
		title: "Timeline of Discriminatory Laws: A South Asian History",
		organization: "South Asian Studies Institute, University of the Fraser Valley",
		location: "Abbotsford, BC",
		category: "work-experience",
		description: "An interactive timeline exploring the historical records of adversities, obstacles, and victories of the South Asian community in dealing with systemic prejudice in Canada.",
		details: [
			"Interactive historical timeline",
			"Data visualization of discriminatory laws",
			"Educational content platform",
			"Historical research documentation",
			"Community heritage preservation"
		],
		technologies: ["PHP", "Web Development", "Interactive Timelines", "Historical Data Visualization"],
		startDate: "January 2024",
		endDate: "March 2024",
		previewItems: [
			{
				link: "https://sacda.ca/exhibits/legal-history/",
				title: "Legal History Timeline"
			}
		]
	},
	{
		id: "komagata-maru-lesson-plans",
		title: "Komagata Maru Educational Resources",
		organization: "South Asian Studies Institute, University of the Fraser Valley",
		location: "Abbotsford, BC",
		category: "work-experience",
		description: "Educational web platform telling the story of Abbotsford citizens who supported the 346 Komagata Maru passengers' bid to legally reside in Canada, featuring lesson plans and historical documentation.",
		details: [
			"Educational lesson plan platform",
			"Historical storytelling",
			"Community heritage documentation",
			"Interactive learning resources",
			"Cultural education materials"
		],
		technologies: ["Web Development", "Educational Content", "Historical Documentation"],
		startDate: "August 2023",
		endDate: "November 2023",
		previewItems: [
			{
				link: "https://www.southasiancanadianheritage.ca/kgm-lesson-plans/",
				title: "Komagata Maru Resources"
			}
		]
	}
];

export const getProjectById = (id: string): Project | undefined => {
	return projects.find(project => project.id === id);
}

export const getProjectsByIds = (ids: string[]): Project[] => {
	return projects.filter(project => ids.includes(project.id)).toSorted((a, b) => {
		return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
	});
}
