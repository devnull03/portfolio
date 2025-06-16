<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { getSectionKeys, resumeData } from "$lib/data/resume.data";
  import { Button } from "$lib/components/ui/button";
  import { Download } from "@lucide/svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";
  import { base } from "$app/paths";
  import { crtEffectBlendMode, crtEffectEnabled } from "$lib/stores";
  import { CrtEffectBlendMode } from "$lib/interfaces/sys.interface";

  let mounted = $state(false);
  let smoother: globalThis.ScrollSmoother;

  let sections = $derived([...getSectionKeys(), "Skills"]);

  const scrollToSection = (idxs: number) => {};

  onMount(() => {
    $crtEffectBlendMode = CrtEffectBlendMode.ColorDodge;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true,
    });

    mounted = true;
  });

  onDestroy(() => {
    $crtEffectBlendMode = CrtEffectBlendMode.Overlay;
    smoother.kill();
  });
</script>

<svelte:head>
  <title>Resume - {resumeData.contact.name}</title>
  <meta
    name="description"
    content="Professional resume of {resumeData.contact
      .name} - {resumeData.summary}"
  />
  <meta
    name="keywords"
    content="resume, software developer, computer science, full-stack, web development"
  />
</svelte:head>

<div
  class="bg-[url('/assets/resume-bg.png')] bg-black/20 bg-blend-overlay bg-cover h-screen rounded-lg px-16 py-4 flex gap-6 font-courierPrime text-black"
>
  <div id="smooth-wrapper" class="w-3/4 h-full relative">
    <div class="main-borders left-0">&nbsp;</div>
    <main id="smooth-content">
      <section
        data-speed="clamp(0.09)"
        class="w-full flex flex-col items-center mt-4"
      >
        <h1 class="text-5xl w-1/2 border-b-2 border-b-black text-center">
          Resume
        </h1>

        <p class="text-sm font-courierPrime text-black">
          <span
            >{resumeData.contact.name} | {resumeData.contact.location} |
          </span>
          <button
            class="underline hover:no-underline transition-all duration-200"
            onclick={() =>
              window.open(`mailto:${resumeData.contact.email}`, "_blank")}
          >
            Contact
          </button>
          <span> | </span>
          <button
            class="underline hover:no-underline transition-all duration-200"
            onclick={() => window.open("/resume.pdf", "_blank")}
          >
            Download PDF Version
          </button>
        </p>
      </section>

      <section></section>
    </main>
    <div class="main-borders right-0">&nbsp;</div>
  </div>

  <!-- Right Nav -->
  <div class="w-1/4 relative">
    <nav class="*:px-4 text-left w-full mt-4 nav-position">
      <h2 class="border-b-2 border-b-black mb-4 text-lg font-courierPrime">
        Resume
      </h2>
      <div class="flex flex-col items-start gap-2">
        {#each sections as sec, idxs}
          <button
            class="group font-courierPrime text-sm text-left"
            onclick={() => scrollToSection(idxs)}
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
</div>

<style type="postcss">
  .main-borders {
    @apply border-l-2 border-l-black w-0.5 h-[41vh] nav-position;
  }

  .nav-position {
    @apply absolute top-[21vh];
  }
</style>
