<script lang="ts">
  import type { ResumeEntry } from "$lib/interfaces/resume.interface";
  import { getProjectById } from "$lib/data/project.data";
  import PreviewPlaceholder from "./PreviewPlaceholder.svelte";

  interface Props {
    entry: ResumeEntry;
  }

  let { entry }: Props = $props();

  // Compute related project data if available
  const relatedProjectsData = $derived(
    entry.relatedProjects && entry.relatedProjects.length > 0
      ? entry.relatedProjects.map((projectId) => {
          const project = getProjectById(projectId);
          return {
            id: projectId,
            name:
              project?.title ||
              projectId
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()),
            url:
              project?.previewItems?.[0]?.link || project?.githubUrl || `#project-${projectId}`,
          };
        })
      : []
  );

  // Get all URLs to preview from previewItems or related projects
  const getAllUrls = () => {
    // If entry has previewItems, use those
    if (entry.previewItems && entry.previewItems.length > 0) {
      return entry.previewItems.map((item) => ({
        title: item.title,
        url: item.link,
        image: item.image,
        isPrimary: false,
        isRelatedProject: false,
      }));
    }

    // For experience entries with related projects, create preview items from project IDs
    if (entry.relatedProjects && entry.relatedProjects.length > 0) {
      return relatedProjectsData.map((projectData) => ({
        title: projectData.name,
        url: projectData.url,
        image: undefined,
        isPrimary: false,
        isRelatedProject: true,
      }));
    }

    return [];
  };

  const allUrls = getAllUrls();
  const maxPreviewsToShow = 2;
  const urlsToPreview = allUrls.slice(0, maxPreviewsToShow);
  const remainingUrlsCount = Math.max(0, allUrls.length - maxPreviewsToShow);
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

  <!-- Details/Responsibilities -->
  {#if entry.details && entry.details.length > 0}
    <ul class="mb-4">
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
  {#if entry.githubUrl || (entry.previewItems && entry.previewItems.length > 0) || (entry.relatedProjects && entry.relatedProjects.length > 0)}
    <div class="mt-4">
      <!-- Preview thumbnails -->
      {#if urlsToPreview.length > 0}
        <div class="mb-3">
          <div class="grid grid-cols-7 gap-3">
            {#each urlsToPreview as urlItem, index}
              {@const previewItem = entry.previewItems?.[index]}

              <button
                class="relative group cursor-pointer w-full text-left col-span-3"
                onclick={() => window.open(urlItem.url, "_blank")}
                type="button"
                aria-label={`Open ${urlItem.title}`}
              >
                <div
                  class="w-full h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  {#if previewItem?.image}
                    <!-- Use provided image -->
                    <div class="w-full h-full relative">
                      <img
                        src={previewItem.image}
                        alt={urlItem.title}
                        class="w-full h-full object-cover"
                      />
                    </div>
                  {:else}
                    <PreviewPlaceholder title={urlItem.title} />
                  {/if}

                  <!-- Overlay with title -->
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-end"
                  >
                    <div
                      class="w-full p-2 bg-gradient-to-t from-black/60 to-transparent"
                    >
                      <p class="text-white text-xs font-courierPrime truncate">
                        {urlItem.title}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            {/each}

            <!-- "+more" indicator if there are additional URLs -->
            {#if remainingUrlsCount > 0}
              <div class="h-28 rounded-lg border border-gray-200 flex items-center justify-center col-span-1">
                <div class="text-center">
                  <div class="text-xl text-gray-400 mb-1">+</div>
                  <p class="text-xs font-courierPrime text-gray-600">
                    {remainingUrlsCount} more
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-2">
        {#if entry.githubUrl}
          <button
            class="text-sm font-courierPrime text-black underline hover:no-underline transition-all duration-200"
            onclick={() => window.open(entry.githubUrl, "_blank")}
          >
            GitHub
          </button>
        {/if}

      </div>
    </div>
  {/if}
</div>
