<script lang="ts">
	import type { ExperienceSectionProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { getProjectById } from '$lib/data/project.data';
	import { goto } from '$app/navigation';
	import BriefcaseIcon from '@lucide/svelte/icons/briefcase';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import StarIcon from '@lucide/svelte/icons/star';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	
	let { experience }: ExperienceSectionProps = $props();

	// Function to navigate to project page
	function navigateToProject(projectId: string) {
		goto(`/projects/${projectId}`);
	}
</script>

<div class="space-y-6">
	{#each experience as exp}
		<Card class="hover:shadow-lg transition-shadow duration-200">
			<CardHeader class="pb-4">
				<div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
					<div class="space-y-2">
						<CardTitle class="flex items-center gap-2 text-lg">
							<BriefcaseIcon class="h-5 w-5 text-muted-foreground" />
							{exp.position}
						</CardTitle>
						<div class="flex items-center gap-2 text-base font-medium text-foreground">
							<BuildingIcon class="h-4 w-4" />
							{exp.company}
						</div>
					</div>
					<div class="flex flex-col gap-1 text-sm text-muted-foreground md:text-right">
						<div class="flex items-center gap-1 md:justify-end">
							<CalendarIcon class="h-4 w-4" />
							{exp.startDate} - {exp.endDate}
						</div>
						<div class="flex items-center gap-1 md:justify-end">
							<MapPinIcon class="h-4 w-4" />
							{exp.location}
						</div>
					</div>
				</div>
			</CardHeader>
			
			<CardContent class="space-y-4">
				<p class="text-muted-foreground leading-relaxed">{exp.description}</p>
				
				{#if exp.responsibilities && exp.responsibilities.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<CheckCircleIcon class="h-4 w-4 text-muted-foreground" />
							<h4 class="text-sm font-semibold">Key Responsibilities</h4>
						</div>
						<ul class="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-6">
							{#each exp.responsibilities as responsibility}
								<li class="leading-relaxed">{responsibility}</li>
							{/each}
						</ul>
					</div>
					<Separator />
				{/if}
				
				{#if exp.technologies && exp.technologies.length > 0}
					<div>
						<h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
							<span class="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center text-xs">T</span>
							Technologies
						</h4>
						<div class="flex flex-wrap gap-2">
							{#each exp.technologies as tech}
								<Badge variant="secondary" class="text-xs">{tech}</Badge>
							{/each}
						</div>
					</div>
					{#if exp.achievements && exp.achievements.length > 0}
						<Separator />
					{/if}
				{/if}
				
				{#if exp.achievements && exp.achievements.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<StarIcon class="h-4 w-4 text-muted-foreground" />
							<h4 class="text-sm font-semibold">Key Achievements</h4>
						</div>
						<ul class="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-6">
							{#each exp.achievements as achievement}
								<li class="font-medium leading-relaxed">{achievement}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if exp.relatedProjects && exp.relatedProjects.length > 0}
					{#if (exp.achievements && exp.achievements.length > 0) || (exp.technologies && exp.technologies.length > 0)}
						<Separator />
					{/if}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<FolderIcon class="h-4 w-4 text-muted-foreground" />
							<h4 class="text-sm font-semibold">Related Projects</h4>
						</div>
						<div class="space-y-2">
							{#each exp.relatedProjects as projectId}
								{@const project = getProjectById(projectId)}
								{#if project}
									<button
										class="w-full p-3 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-200 text-left group"
										onclick={() => navigateToProject(projectId)}
									>
										<div class="flex items-start justify-between gap-3">
											<div class="space-y-1 flex-1">
												<div class="flex items-center gap-2">
													<h5 class="text-sm font-medium group-hover:text-primary transition-colors">
														{project.name}
													</h5>
													<ExternalLinkIcon class="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
												</div>
												<p class="text-xs text-muted-foreground overflow-hidden">
													{project.description.length > 80 ? project.description.substring(0, 80) + '...' : project.description}
												</p>
												<div class="flex flex-wrap gap-1 mt-2">
													{#each project.technologies.slice(0, 3) as tech}
														<Badge variant="outline" class="text-xs px-1 py-0">
															{tech}
														</Badge>
													{/each}
													{#if project.technologies.length > 3}
														<Badge variant="outline" class="text-xs px-1 py-0">
															+{project.technologies.length - 3} more
														</Badge>
													{/if}
												</div>
											</div>
										</div>
									</button>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</CardContent>
		</Card>
	{/each}
</div>
