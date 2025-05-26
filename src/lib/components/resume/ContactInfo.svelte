<script lang="ts">
	import type { ContactInfoProps } from '$lib/interfaces/resume.interface';
	
	let { contact, summary }: ContactInfoProps = $props();
</script>

<div class="text-center">
	<div class="mb-6">
		<h1 class="text-5xl md:text-6xl font-bold text-foreground mb-3 tracking-tight">{contact.name}</h1>
		{#if contact.title}
			<p class="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">{contact.title}</p>
		{/if}
		{#if summary}
			<p class="text-lg text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">{summary}</p>
		{/if}
	</div>
	
	<!-- Contact Links Grid -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
		{#if contact.phone}
			<a href="tel:{contact.phone}" 
				 class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group">
				<span class="text-lg">📞</span>
				<span class="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">Phone</span>
			</a>
		{/if}
		
		<a href="mailto:{contact.email}" 
			 class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group">
			<span class="text-lg">✉️</span>
			<span class="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">Email</span>
		</a>
		
		{#if contact.location}
			<div class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/30">
				<span class="text-lg">📍</span>
				<span class="text-sm font-medium text-muted-foreground hidden sm:block">Location</span>
			</div>
		{/if}
		
		{#if contact.website}
			<a href={contact.website} target="_blank" rel="noopener noreferrer" 
				 class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group">
				<span class="text-lg">🌐</span>
				<span class="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">Portfolio</span>
			</a>
		{/if}
		
		{#if contact.linkedin}
			<a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
				 class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group">
				<span class="text-lg">💼</span>
				<span class="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">LinkedIn</span>
			</a>
		{/if}
		
		{#if contact.github}
			<a href={contact.github} target="_blank" rel="noopener noreferrer" 
				 class="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200 group">
				<span class="text-lg">🐙</span>
				<span class="text-sm font-medium text-muted-foreground group-hover:text-foreground hidden sm:block">GitHub</span>
			</a>
		{/if}
	</div>
	
	<!-- Contact Details (Mobile) -->
	<div class="mt-6 space-y-2 sm:hidden">
		{#if contact.phone}
			<p class="text-sm text-muted-foreground">{contact.phone}</p>
		{/if}
		<p class="text-sm text-muted-foreground">{contact.email}</p>
		{#if contact.location}
			<p class="text-sm text-muted-foreground">{contact.location}</p>
		{/if}
	</div>
</div>
