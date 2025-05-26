<script lang="ts">
	import type { ContactInfoProps } from '$lib/interfaces/resume.interface';
	
	let { contact, summary }: ContactInfoProps = $props();
</script>

<div class="text-center mb-8">
	<h1 class="text-4xl font-bold text-foreground mb-2">{contact.name}</h1>
	{#if contact.title}
		<p class="text-xl text-muted-foreground mb-4">{contact.title}</p>
	{/if}
	{#if summary}
		<p class="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">{summary}</p>
	{/if}
	
	<div class="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
		{#if contact.phone}
			<a href="tel:{contact.phone}" class="hover:text-foreground transition-colors">
				📞 {contact.phone}
			</a>
		{/if}
		<a href="mailto:{contact.email}" class="hover:text-foreground transition-colors">
			✉️ {contact.email}
		</a>
		{#if contact.location}
			<span>📍 {contact.location}</span>
		{/if}
	</div>
	
	<div class="flex flex-wrap justify-center gap-4 mt-4">
		{#if contact.website}
			<a href={contact.website} target="_blank" rel="noopener noreferrer" 
				 class="text-muted-foreground hover:text-foreground transition-colors">
				🌐 Portfolio
			</a>
		{/if}
		{#if contact.linkedin}
			<a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
				 class="text-muted-foreground hover:text-foreground transition-colors">
				💼 LinkedIn
			</a>
		{/if}
		{#if contact.github}
			<a href={contact.github} target="_blank" rel="noopener noreferrer" 
				 class="text-muted-foreground hover:text-foreground transition-colors">
				🐙 GitHub
			</a>
		{/if}
		{#if contact.resumePdf}
			<a href={contact.resumePdf} target="_blank" rel="noopener noreferrer" 
				 class="text-muted-foreground hover:text-foreground transition-colors">
				📄 PDF Resume
			</a>
		{/if}
	</div>
</div>
