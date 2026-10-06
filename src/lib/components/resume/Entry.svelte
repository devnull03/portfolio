<script lang="ts">
  import type { PreviewItem, Project, ResumeEntry } from "$lib/content/types";
  import PreviewPlaceholder from "./PreviewPlaceholder.svelte";

  interface Props {
    entry: ResumeEntry | Project;
  }

  let { entry }: Props = $props();

  const isProject = (entry: ResumeEntry | Project): entry is Project =>
    entry.kind === "project";

  const getAllUrls = (): PreviewItem[] => {
    const urls: PreviewItem[] = [...(entry.previewItems ?? [])];

    if (!isProject(entry) && entry.relatedProjects) {
      urls.push(
        ...entry.relatedProjects.map((p) => ({
          title: p.title || "Untitled Project",
          link: p.githubUrl || p.url || "#",
          image: p.previewItems?.[0]?.image,
        }))
      );
    }

    return urls;
  };

  const allUrls = getAllUrls();
  const maxPreviewsToShow = 2;
  const urlsToPreview = allUrls.slice(0, maxPreviewsToShow);
  const remainingUrlsCount = Math.max(0, allUrls.length - maxPreviewsToShow);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present";

    // Dates are calendar months, so format in UTC: the server and every visitor's timezone
    // then agree on the month.
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  };
</script>

<div class="entry-item">
  <!-- Job Title and Date -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
    <h3 class="text-lg font-courierPrime font-semibold text-black">
      {entry.title}
    </h3>
    <span class="text-sm font-courierPrime text-black/70 mt-1 sm:mt-0">
      {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
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
    <ul class="mb-4 list-disc">
      {#each entry.details as detail}
        <li class="font-courierPrime text-black leading-relaxed">
            {detail}
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
  {#if (isProject(entry) && entry.githubUrl) || urlsToPreview.length > 0}
    <div class="mt-4">
      <!-- Preview thumbnails -->
      {#if urlsToPreview.length > 0}
        <div class="mb-3">
          <div class="grid grid-cols-7 gap-3">
            {#each urlsToPreview as urlItem}
              <button
                class="relative group cursor-pointer w-full text-left col-span-3"
                onclick={() => window.open(urlItem.link, "_blank")}
                type="button"
                aria-label={`Open ${urlItem.title}`}
              >
                <div
                  class="w-full h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  {#if urlItem.image}
                    <div class="w-full h-full relative">
                      <img
                        src={urlItem.image}
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
        {#if isProject(entry) && entry.githubUrl}
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
