<script lang="ts">
	import type { EducationSectionProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { GraduationCap, MapPin, Calendar } from '@lucide/svelte';
	
	let { education }: EducationSectionProps = $props();
</script>

<div class="space-y-6">
	{#each education as edu}
		<Card class="transition-all duration-200 hover:shadow-md">
			<CardHeader>
				<div class="flex items-start justify-between">
					<div class="space-y-2">
						<CardTitle class="flex items-center gap-2">
							<GraduationCap class="h-5 w-5 text-muted-foreground" />
							{edu.degree}
						</CardTitle>
						{#if edu.field}
							<p class="text-lg font-medium text-muted-foreground">{edu.field}</p>
						{/if}
						<p class="text-base font-semibold text-foreground">{edu.institution}</p>
					</div>
					<div class="text-right space-y-1">
						<div class="flex items-center gap-1 text-sm text-muted-foreground">
							<Calendar class="h-4 w-4" />
							<span>{edu.startDate} - {edu.endDate}</span>
						</div>
						{#if edu.location}
							<div class="flex items-center gap-1 text-sm text-muted-foreground">
								<MapPin class="h-4 w-4" />
								<span>{edu.location}</span>
							</div>
						{/if}
						{#if edu.gpa}
							<p class="font-medium text-sm">GPA: {edu.gpa}</p>
						{/if}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{#if edu.description}
					<p class="text-muted-foreground mb-4">{edu.description}</p>
				{/if}
				
				{#if edu.coursework && edu.coursework.length > 0}
					<div class="mb-4">
						<h4 class="font-semibold mb-2">Relevant Coursework:</h4>
						<div class="flex flex-wrap gap-2">
							{#each edu.coursework as course}
								<Badge variant="secondary">{course}</Badge>
							{/each}
						</div>
					</div>
				{/if}
				
				{#if edu.achievements && edu.achievements.length > 0}
					<div>
						<h4 class="font-semibold mb-2">Achievements:</h4>
						<ul class="list-disc list-inside space-y-1 text-muted-foreground">
							{#each edu.achievements as achievement}
								<li>{achievement}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</CardContent>
		</Card>
	{/each}
</div>
