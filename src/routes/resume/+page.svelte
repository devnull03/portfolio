<script lang="ts">
	import { onMount } from 'svelte';
	import { resumeData } from '$lib/data/resume.data';
	import ContactInfo from '$lib/components/resume/ContactInfo.svelte';
	import EducationSection from '$lib/components/resume/EducationSection.svelte';
	import ExperienceSection from '$lib/components/resume/ExperienceSection.svelte';
	import ProjectsSection from '$lib/components/resume/ProjectsSection.svelte';
	import SkillsSection from '$lib/components/resume/SkillsSection.svelte';
	import LanguagesSection from '$lib/components/resume/LanguagesSection.svelte';
	import VolunteerSection from '$lib/components/resume/VolunteerSection.svelte';
	import ResumeNavigation from '$lib/components/resume/ResumeNavigation.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Download, Menu } from '@lucide/svelte';
  import { Sheet, SheetContent, SheetTrigger } from '$lib/components/ui/sheet';

	let mounted = $state(false);
	let activeSection = $state('contact');
	let mobileNavOpen = $state(false);

	const sections = [
		{ id: 'contact', title: 'Contact' },
		{ id: 'education', title: 'Education' },
		{ id: 'experience', title: 'Experience' },
		{ id: 'projects', title: 'Projects' },
		{ id: 'skills', title: 'Skills' },
		{ id: 'languages', title: 'Languages' },
		{ id: 'volunteer', title: 'Volunteer' }
	];

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Resume - {resumeData.contact.name}</title>
	<meta name="description" content="Professional resume of {resumeData.contact.name} - {resumeData.summary}" />
	<meta name="keywords" content="resume, software developer, computer science, full-stack, web development" />
</svelte:head>

<div class="resume-container">
	<!-- Mobile Navigation Sheet -->
	<div class="lg:hidden fixed top-4 left-4 z-50">
		<Sheet>
			<SheetTrigger>
				<Button variant="outline" size="icon">
					<Menu class="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" class="w-80">
				{#if mounted}
					<ResumeNavigation {sections} bind:activeSection />
				{/if}
			</SheetContent>
		</Sheet>
	</div>

	<!-- Desktop Navigation -->
	<div class="hidden lg:block">
		{#if mounted}
			<ResumeNavigation {sections} bind:activeSection />
		{/if}
	</div>

	<!-- Main Content -->
	<main class="resume-main">
		<!-- Contact Information Header -->
		<section id="contact" class="resume-header">
			<ContactInfo contact={resumeData.contact} summary={resumeData.summary} />
		</section>

		<!-- Resume Sections -->
		<div class="resume-content">
			<!-- Education Section -->
			<section id="education" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Education</h2>
						<EducationSection education={resumeData.education} />
					</CardContent>
				</Card>
			</section>

			<Separator class="my-8" />

			<!-- Experience Section -->
			<section id="experience" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Experience</h2>
						<ExperienceSection experience={resumeData.experience} />
					</CardContent>
				</Card>
			</section>

			<Separator class="my-8" />

			<!-- Projects Section -->
			<section id="projects" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Projects</h2>
						<ProjectsSection projects={resumeData.projects} />
					</CardContent>
				</Card>
			</section>

			<Separator class="my-8" />

			<!-- Skills Section -->
			<section id="skills" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Skills</h2>
						<SkillsSection skills={resumeData.skills} />
					</CardContent>
				</Card>
			</section>

			<Separator class="my-8" />

			<!-- Languages Section -->
			<section id="languages" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Languages</h2>
						<LanguagesSection languages={resumeData.languages} />
					</CardContent>
				</Card>
			</section>

			<Separator class="my-8" />

			<!-- Volunteer Section -->
			<section id="volunteer" class="resume-section">
				<Card class="border-0 shadow-lg">
					<CardContent class="p-6">
						<h2 class="text-3xl font-bold mb-6 text-primary">Volunteer Experience</h2>
						<VolunteerSection volunteer={resumeData.volunteer} />
					</CardContent>
				</Card>
			</section>
		</div>

		<!-- Download Resume Button -->
		<div class="download-section">
			<Button 
				href={resumeData.contact.resumePdf} 
				target="_blank" 
				rel="noopener noreferrer"
				size="lg"
				class="gap-2"
			>
				<Download class="h-5 w-5" />
				Download PDF Resume
			</Button>
		</div>
	</main>
</div>

<style>
	.resume-container {
		min-height: 100vh;
		background: var(--bg-primary, #ffffff);
		color: var(--text-primary, #1a1a1a);
		position: relative;
	}

	.resume-main {
		margin-left: 0;
		transition: margin-left 0.3s ease;
	}

	@media (min-width: 1024px) {
		.resume-main {
			margin-left: 250px;
		}
	}

	.resume-header {
		background: linear-gradient(135deg, var(--primary-color, #3b82f6) 0%, var(--secondary-color, #8b5cf6) 100%);
		color: white;
		padding: 2rem 1rem;
		margin-bottom: 0;
	}

	@media (min-width: 768px) {
		.resume-header {
			padding: 3rem 2rem;
		}
	}

	.resume-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	@media (min-width: 768px) {
		.resume-content {
			padding: 0 2rem;
		}
	}

	.resume-section {
		padding: 2rem 0;
		border-bottom: 1px solid var(--border-color, #e5e7eb);
	}

	.resume-section:last-child {
		border-bottom: none;
	}

	.download-section {
		text-align: center;
		padding: 3rem 1rem;
		background: var(--bg-secondary, #f8fafc);
		border-top: 1px solid var(--border-color, #e5e7eb);
	}

	.download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 2rem;
		background: var(--primary-color, #3b82f6);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.download-btn:hover {
		background: var(--primary-hover, #2563eb);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.download-btn:active {
		transform: translateY(0);
	}

	/* Dark mode styles */
	@media (prefers-color-scheme: dark) {
		.resume-container {
			background: var(--bg-primary, #0f172a);
			color: var(--text-primary, #f1f5f9);
		}

		.resume-section {
			border-bottom-color: var(--border-color, #334155);
		}

		.download-section {
			background: var(--bg-secondary, #1e293b);
			border-top-color: var(--border-color, #334155);
		}
	}

	/* Print styles */
	@media print {
		.resume-container {
			background: white;
			color: black;
		}

		.resume-main {
			margin-left: 0;
		}

		.resume-header {
			background: #3b82f6 !important;
			color: white !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.download-section {
			display: none;
		}

		.resume-section {
			page-break-inside: avoid;
			break-inside: avoid;
		}

		/* Hide navigation for print */
		:global(.resume-navigation) {
			display: none !important;
		}
	}

	/* Smooth scrolling for anchor links */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Add scroll padding to account for navigation */
	:global([id]) {
		scroll-margin-top: 2rem;
	}

	@media (min-width: 1024px) {
		:global([id]) {
			scroll-margin-top: 1rem;
		}
	}
</style>