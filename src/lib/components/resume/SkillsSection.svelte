<script lang="ts">
	import type { SkillsSectionProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import ToolsIcon from '@lucide/svelte/icons/wrench';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
	
	let { skills }: SkillsSectionProps = $props();
	
	function getSkillLevelColor(level: string | undefined): { variant: any; color: string } {
		switch (level) {
			case 'Expert':
				return { variant: 'destructive' as const, color: 'text-red-600' };
			case 'Advanced':
				return { variant: 'default' as const, color: 'text-orange-600' };
			case 'Intermediate':
				return { variant: 'secondary' as const, color: 'text-yellow-600' };
			case 'Beginner':
				return { variant: 'outline' as const, color: 'text-green-600' };
			default:
				return { variant: 'outline' as const, color: 'text-gray-600' };
		}
	}
	
	function getSkillProgress(level: string | undefined): number {
		switch (level) {
			case 'Expert':
				return 95;
			case 'Advanced':
				return 80;
			case 'Intermediate':
				return 60;
			case 'Beginner':
				return 35;
			default:
				return 50;
		}
	}
</script>

<div class="space-y-6">
	{#each skills as skillCategory}
		<Card class="hover:shadow-lg transition-shadow duration-200">
			<CardHeader class="pb-4">
				<CardTitle class="flex items-center gap-2 text-lg">
					<ToolsIcon class="h-5 w-5 text-primary" />
					{skillCategory.category}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each skillCategory.skills as skill}
						<div class="space-y-2 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
							<div class="flex items-center justify-between">
								<span class="font-medium text-sm">{skill.name}</span>
								{#if skill.level}
									{@const { variant, color } = getSkillLevelColor(skill.level)}
									<Badge {variant} class="text-xs {color}">
										{skill.level}
									</Badge>
								{/if}
							</div>
							{#if skill.level}
								<div class="space-y-1">
									<div class="flex items-center justify-between text-xs text-muted-foreground">
										<TrendingUpIcon class="h-3 w-3" />
										<span>{getSkillProgress(skill.level)}%</span>
									</div>
									<Progress value={getSkillProgress(skill.level)} class="h-2" />
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/each}
</div>
