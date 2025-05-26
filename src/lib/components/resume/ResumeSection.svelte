<script lang="ts">
	import type { ResumeSectionProps } from '$lib/interfaces/resume.interface';
	
	let { id, title, className = '' }: ResumeSectionProps = $props();
</script>

<section {id} class="mb-12 scroll-mt-20 {className}">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-blue-500 pb-2">
		{title}
	</h2>
	<slot />
</section>
