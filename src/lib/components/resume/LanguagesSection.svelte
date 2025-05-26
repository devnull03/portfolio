<script lang="ts">
	import type { LanguagesSectionProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	
	let { languages }: LanguagesSectionProps = $props();
	
	function getProficiencyColor(proficiency: string): { variant: any; color: string } {
		switch (proficiency) {
			case 'Native':
				return { variant: 'default' as const, color: 'text-blue-600' };
			case 'Fluent':
				return { variant: 'secondary' as const, color: 'text-green-600' };
			case 'Conversational':
				return { variant: 'outline' as const, color: 'text-yellow-600' };
			case 'Basic':
				return { variant: 'outline' as const, color: 'text-orange-600' };
			default:
				return { variant: 'outline' as const, color: 'text-gray-600' };
		}
	}
	
	function getProficiencyProgress(proficiency: string): number {
		switch (proficiency) {
			case 'Native':
				return 100;
			case 'Fluent':
				return 85;
			case 'Conversational':
				return 65;
			case 'Basic':
				return 35;
			default:
				return 50;
		}
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{#each languages as language}
		<Card class="hover:shadow-md transition-shadow duration-200">
			<CardContent class="p-4">
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<GlobeIcon class="h-4 w-4 text-primary" />
							<h3 class="text-sm font-semibold">{language.name}</h3>
						</div>
						{#each [getProficiencyColor(language.proficiency)] as colorInfo}
							<Badge variant={colorInfo.variant} class="text-xs {colorInfo.color}">
								{language.proficiency}
							</Badge>
						{/each}
					</div>
					<div class="space-y-1">
						<div class="flex justify-between text-xs text-muted-foreground">
							<span>Proficiency</span>
							<span>{getProficiencyProgress(language.proficiency)}%</span>
						</div>
						<Progress value={getProficiencyProgress(language.proficiency)} class="h-2" />
					</div>
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
