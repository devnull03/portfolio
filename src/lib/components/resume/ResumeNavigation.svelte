<script lang="ts">
	import { onMount } from 'svelte';
	import type { ResumeNavigationProps } from '$lib/interfaces/resume.interface';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import NavigationIcon from '@lucide/svelte/icons/navigation';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import InfoIcon from '@lucide/svelte/icons/info';
	
	let { sections, activeSection = $bindable('') }: ResumeNavigationProps = $props();
	
	let mounted = $state(false);
	
	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
	
	// Simple intersection observer to highlight active section
	function updateActiveSection() {
		if (!mounted) return;
		
		const sectionElements = sections.map(section => document.getElementById(section.id)).filter(Boolean);
		const scrollPosition = window.scrollY + 100;
		
		for (let i = sectionElements.length - 1; i >= 0; i--) {
			const element = sectionElements[i];
			if (element && element.offsetTop <= scrollPosition) {
				activeSection = sections[i].id;
				break;
			}
		}
	}
	
	onMount(() => {
		mounted = true;
		window.addEventListener('scroll', updateActiveSection);
		window.addEventListener('resize', updateActiveSection);
		
		// Initial check
		updateActiveSection();
		
		// Cleanup
		return () => {
			window.removeEventListener('scroll', updateActiveSection);
			window.removeEventListener('resize', updateActiveSection);
		};
	});
</script>

<nav class="fixed left-0 top-0 h-screen w-64 z-40">
	<Card class="h-full rounded-none border-r shadow-lg">
		<CardHeader class="pb-4">
			<CardTitle class="flex items-center gap-2">
				<FileTextIcon class="h-5 w-5 text-muted-foreground" />
				Resume
			</CardTitle>
			<div class="flex items-center gap-2 text-sm text-muted-foreground">
				<NavigationIcon class="h-4 w-4" />
				Navigation
			</div>
		</CardHeader>
		
		<CardContent class="p-0 flex-1">
			<ScrollArea class="h-[calc(100vh-140px)] px-6">
				<div class="space-y-2 pb-6">
					{#each sections as section}
						<Button
							variant={activeSection === section.id ? 'default' : 'ghost'}
							class="w-full justify-start text-left h-auto py-3 px-3 {
								activeSection === section.id 
									? 'bg-accent text-accent-foreground shadow-sm border-l-4 border-accent-foreground/20' 
									: 'hover:bg-accent hover:text-accent-foreground'
							}"
							onclick={() => scrollToSection(section.id)}
						>
							{section.title}
						</Button>
					{/each}
				</div>
				
				<Separator class="mx-6" />
				
				<div class="p-6">
					<div class="flex items-start gap-2 text-xs text-muted-foreground">
						<InfoIcon class="h-3 w-3 mt-0.5 flex-shrink-0" />
						<p class="leading-relaxed">
							Use the navigation above to jump to different sections of the resume.
						</p>
					</div>
				</div>
			</ScrollArea>
		</CardContent>
	</Card>
</nav>
