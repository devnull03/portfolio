<script lang="ts">
  import { getSectionKeys, resumeData } from "$lib/data/resume.data";
  import { slide } from "svelte/transition";

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
  let isOpen = $state(false);

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
          {#each sections as sec, idxs}
            <button onclick={() => scrollToSection(sec)}>
              {sec}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style type="postcss">
  /* Custom styles for the mobile navigation */
  button {
    font-family: "Courier Prime", monospace;
  }

  /* Add visual feedback for the collapsible state */
  button[aria-expanded="true"] {
    background-color: #f9f9f9;
  }
</style>
