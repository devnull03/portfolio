<script lang="ts">
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
  };
</script>

<div class="w-1/4 relative hidden md:block">
  <nav class="*:px-4 text-left w-full mt-4 {className}">
    <h2 class="border-b-2 border-b-black mb-4 font-courierPrime text-2xl">
      Sections
    </h2>
    <div class="flex flex-col items-start gap-2 *:text-lg">
      {#each sections as section, idx}
        <button
          class="group font-courierPrime text-sm text-left"
          onclick={() => scrollToSection(section.id)}
        >
          {section.display}
          <hr
            class="w-0 group-hover:w-1/2 -mt-1 transition-all duration-200 border-black"
          />
        </button>
      {/each}
    </div>
  </nav>
</div>

<style type="postcss">
  .nav-position {
    @apply absolute top-[21vh];
  }
</style>
