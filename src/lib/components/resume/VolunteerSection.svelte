<script lang="ts">
	import type { VolunteerSectionProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import BuildingIcon from '@lucide/svelte/icons/building-2';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CheckCircleIcon from '@lucide/svelte/icons/check-circle';
	import AwardIcon from '@lucide/svelte/icons/award';
	
	let { volunteer }: VolunteerSectionProps = $props();
</script>

<div class="space-y-6">
	{#each volunteer as vol}
		<Card class="hover:shadow-lg transition-shadow duration-200">
			<CardHeader class="pb-4">
				<div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
					<div class="space-y-2">
						<CardTitle class="flex items-center gap-2 text-lg">
							<HeartIcon class="h-5 w-5 text-primary" />
							{vol.role}
						</CardTitle>
						<div class="flex items-center gap-2 text-base font-medium text-purple-600 dark:text-purple-400">
							<BuildingIcon class="h-4 w-4" />
							{vol.organization}
						</div>
					</div>
					<div class="flex flex-col gap-1 text-sm text-muted-foreground md:text-right">
						<div class="flex items-center gap-1 md:justify-end">
							<CalendarIcon class="h-4 w-4" />
							{vol.startDate} - {vol.endDate}
						</div>
						{#if vol.location}
							<div class="flex items-center gap-1 md:justify-end">
								<MapPinIcon class="h-4 w-4" />
								{vol.location}
							</div>
						{/if}
					</div>
				</div>
			</CardHeader>
			
			<CardContent class="space-y-4">
				<p class="text-muted-foreground leading-relaxed">{vol.description}</p>
				
				{#if vol.responsibilities && vol.responsibilities.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<CheckCircleIcon class="h-4 w-4 text-primary" />
							<h4 class="text-sm font-semibold">Responsibilities</h4>
						</div>
						<ul class="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-6">
							{#each vol.responsibilities as responsibility}
								<li class="leading-relaxed">{responsibility}</li>
							{/each}
						</ul>
					</div>
					{#if vol.achievements && vol.achievements.length > 0}
						<Separator />
					{/if}
				{/if}
				
				{#if vol.achievements && vol.achievements.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<AwardIcon class="h-4 w-4 text-primary" />
							<h4 class="text-sm font-semibold">Key Achievements</h4>
						</div>
						<ul class="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-6">
							{#each vol.achievements as achievement}
								<li class="font-medium leading-relaxed">{achievement}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</CardContent>
		</Card>
	{/each}
</div>
