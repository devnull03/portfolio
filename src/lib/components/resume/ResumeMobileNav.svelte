<script lang="ts">
  import { slide } from "svelte/transition";

  let {
    mounted = $bindable(),
    smoother = $bindable(),
    resumeSections,
    class: className,
  }: {
    mounted: boolean;
    smoother: globalThis.ScrollSmoother | null;
    resumeSections: Promise<Record<string, any[]>>;
    class?: string;
  } = $props();

  let sections = $state<{display: string, id: string}[]>([]);
  let isOpen = $state(false);

  resumeSections.then((data) => {
    const categoryNames: Record<string, string> = {
      'experience': 'Experience',
      'education': 'Education',
      'volunteering': 'Volunteering',
      'projects': 'Projects'
    };
    
    const resumeSectionItems = Object.keys(data).map(key => ({
      display: categoryNames[key] || key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      id: key
    }));
    
    sections = [
      ...resumeSectionItems,
      { display: "Projects", id: "projects" },
      { display: "Skills", id: "Skills" }
    ];
  }).catch(console.error);

  const scrollToSection = (id: string) => {
    if (!mounted) return;

    smoother?.scrollTo(`#${id}`, true, "top 200rem");
    isOpen = false;
  };

  const toggleCollapsible = () => {
    isOpen = !isOpen;
  };
</script>

<div class="w-[75vw] left-4 fixed bottom-4 md:hidden {className}">
  <div class="bg-white border-t border-black rounded-none flex flex-col-reverse">
    <!-- Trigger Button -->
    <button
      class="flex flex-col justify-center relative py-3 px-4 border border-t-0 bg-white"
      onclick={toggleCollapsible}
      aria-expanded={isOpen}
      aria-controls="collapsible-content"
    >
      <div
        class="font-courierPrime leading-[normal] not-italic text-sm text-left text-nowrap"
      >
        Resume sections
      </div>
    </button>

    <!-- Collapsible Content -->
    {#if isOpen}
      <div
        id="collapsible-content"
        class="bg-gray-50 border-t-black overflow-hidden"
        transition:slide={{ duration: 250 }}
      >
        <div class="flex flex-col py-2.5 px-4 gap-3 font-courierPrime *:text-left *:text-sm">
          {#each sections as section, idx}
            <button onclick={() => scrollToSection(section.id)}>
              {section.display}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style type="postcss">
  button {
    font-family: "Courier Prime", monospace;
  }

  button[aria-expanded="true"] {
    background-color: #f9f9f9;
  }
</style>
