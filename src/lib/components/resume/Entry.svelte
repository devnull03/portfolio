<script lang="ts">
  import type { ResumeEntry } from "$lib/interfaces/resume.interface";

  interface Props {
    entry: ResumeEntry;
  }

  let { entry }: Props = $props();
</script>

<div class="entry-item">
  <!-- Job Title and Date -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
    <h3 class="text-lg font-courierPrime font-semibold text-black">
      {entry.title}
    </h3>
    <span class="text-sm font-courierPrime text-black/70 mt-1 sm:mt-0">
      {entry.startDate} – {entry.endDate}
    </span>
  </div>

  <!-- Organization and Location -->
  <div class="mb-3">
    <p class="text-base font-courierPrime text-black">
      {entry.organization}
      <span class="text-black/70 ml-2">{entry.location}</span>
    </p>
  </div>

  <!-- Description -->
  {#if entry.description}
    <p class="text font-courierPrime text-black/80 mb-3 italic">
      {entry.description}
    </p>
  {/if}

  <!-- Details/Responsibilities -->
  {#if entry.details && entry.details.length > 0}
    <ul class="space-y-2 mb-4">
      {#each entry.details as detail}
        <li class="flex items-center">
          <span class="text-black mr-2 mt-1">•</span>
          <span class="font-courierPrime text-black leading-relaxed">
            {detail}
          </span>
        </li>
      {/each}
    </ul>
  {/if}

  <!-- Technologies -->
  {#if entry.technologies && entry.technologies.length > 0}
    <div class="mb-3">
      <p class="text-sm font-courierPrime text-black/60 mb-1">Technologies:</p>
      <div class="flex flex-wrap gap-1">
        {#each entry.technologies as tech}
          <span
            class="bg-black/10 px-2 py-1 rounded text-sm font-courierPrime text-black"
          >
            {tech}
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Project Links for Projects section -->
  {#if entry.githubUrl || entry.liveUrl}
    <div class="flex gap-3 mt-3">
      {#if entry.githubUrl}
        <button
          class="text-sm font-courierPrime text-black underline hover:no-underline transition-all duration-200"
          onclick={() => window.open(entry.githubUrl, "_blank")}
        >
          GitHub
        </button>
      {/if}
      {#if entry.liveUrl}
        <button
          class="text-sm font-courierPrime text-black underline hover:no-underline transition-all duration-200"
          onclick={() => window.open(entry.liveUrl, "_blank")}
        >
          Live Demo
        </button>
      {/if}
    </div>
  {/if}
</div>
