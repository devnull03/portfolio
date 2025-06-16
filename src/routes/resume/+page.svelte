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
  class="bg-[url('/assets/resume-bg.png')] {$crtEffectEnabled
    ? 'bg-black/20'
    : 'bg-white/70'} h-full bg-blend-overlay bg-cover rounded-lg px-16 py-4 flex gap-6 font-courierPrime text-black"
>
  <div class="absolute top-4 right-4 z-50 flex flex-col gap-2">
    <Button
      class=""
      variant="outline"
      size="icon"
      target="_blank"
      href="{base}/resume.pdf"
    >
      <Download class="w-6 h-6 text-white" />
    </Button>

    <Button
      class="relative hover:text-black"
      variant="outline"
      size="icon"
      onclick={() => ($crtEffectEnabled = !$crtEffectEnabled)}
      title={$crtEffectEnabled ? "Disable CRT Effect" : "Enable CRT Effect"}
    >
      <div class="relative w-5 h-5">
        <div
          class={`absolute inset-0 rounded-sm border-2 ${
            $crtEffectEnabled ? "border-green-500" : "border-red-500"
          }`}
        ></div>
        <div
          class={`absolute inset-1 rounded-sm ${
            $crtEffectEnabled ? "bg-green-500/50" : "bg-red-500/50"
          }`}
        ></div>
        <div class="absolute inset-0 flex items-center justify-center">
          {#if !$crtEffectEnabled}
            <div class="w-6 h-0.5 bg-red-500 rotate-45"></div>
          {/if}
        </div>
      </div>
      <span class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-courierPrime whitespace-nowrap">
        CRT: {$crtEffectEnabled ? 'ON' : 'OFF'}
      </span>
    </Button>
  </div>

  <div class="!w-3/4 relative">
    <div class="main-borders left-0">&nbsp;</div>
    <main
      id="smooth-content"
      class="px-6 *:px-4 flex flex-col gap-8 !h-[400rem]"
    >
      <section
        data-speed="clamp(0.09)"
        class="w-full flex flex-col items-center mt-4 mb-8 backdrop-blur-lg z-20 text-center"
      >
        <h1 class="text-5xl w-1/2 border-b-2 border-b-black">Resume</h1>

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

      {#each getSectionKeys() as secId, idxsi}
        <section id={secId} class="mb-12 rounded-lg p-6 shadow-sm">
          <!-- Section Title with Underline -->
          <div class="mb-6">
            <h2 class="text-2xl font-courierPrime text-black mb-2">{secId}</h2>
            <div class="w-full max-w-md h-0.5 bg-black"></div>
          </div>

          <!-- Section Entries -->
          <div class="space-y-8">
            {#each resumeData.resumeSections[secId] as entry, idxe}
              <div class="entry-item">
                <!-- Job Title and Date -->
                <div
                  class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2"
                >
                  <h3
                    class="text-lg font-courierPrime font-semibold text-black"
                  >
                    {entry.title}
                  </h3>
                  <span
                    class="text-sm font-courierPrime text-black/70 mt-1 sm:mt-0"
                  >
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
                      <li class="flex items-start">
                        <span class="text-black mr-2 mt-1">•</span>
                        <span
                          class="font-courierPrime text-black leading-relaxed"
                        >
                          {detail}
                        </span>
                      </li>
                    {/each}
                  </ul>
                {/if}

                <!-- Technologies -->
                {#if entry.technologies && entry.technologies.length > 0}
                  <div class="mb-3">
                    <p class="text-sm font-courierPrime text-black/60 mb-1">
                      Technologies:
                    </p>
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
            {/each}
          </div>
        </section>
      {/each}

      <section id="Skills" class="mb-12 rounded-lg p-6 shadow-sm">
        <!-- Section Title with Underline -->
        <div class="mb-6">
          <h2 class="text-2xl font-courierPrime text-black mb-2">Skills</h2>
          <div class="w-full max-w-md h-0.5 bg-black"></div>
        </div>

        <!-- Skills Grid -->
        <div class="space-y-6">
          {#each Object.entries(resumeData.skillSections) as [categoryName, skills]}
            <div class="skill-category">
              <h3
                class="text-lg font-courierPrime font-semibold text-black mb-3"
              >
                {categoryName}
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {#each skills as skill}
                  <div class="skill-item">
                    <span
                      class="bg-black/10 hover:bg-black/20 transition-colors duration-200 px-3 py-2 rounded-lg text-sm font-courierPrime text-black block text-center"
                    >
                      {skill.name}
                      {#if skill.proficiency}
                        <span class="block text-xs text-black/60 mt-1">
                          {skill.proficiency}
                        </span>
                      {/if}
                    </span>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </section>
    </main>
    <div class="main-borders right-0">&nbsp;</div>
  </div>

  <!-- Right Nav -->
  <div class="w-1/4 relative">
    <nav class="*:px-4 text-left w-full mt-4 nav-position">
      <h2 class="border-b-2 border-b-black mb-4 font-courierPrime text-2xl">
        Sections
      </h2>
      <div class="flex flex-col items-start gap-2 *:text-lg">
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
