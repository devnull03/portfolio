<script lang="ts">
  import { getSectionKeys } from "$lib/data/resume.data";

  let {
    mounted = $bindable(),
    smoother = $bindable(),
    class: className,
  }: {
    mounted: boolean;
    smoother: globalThis.ScrollSmoother | null;
    class?: string;
  } = $props();

  let sections = $derived([...getSectionKeys(), "Skills"]);

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
      {#each sections as sec, idxs}
        <button
          class="group font-courierPrime text-sm text-left"
          onclick={() => scrollToSection(sec)}
        >
          {sec}
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
