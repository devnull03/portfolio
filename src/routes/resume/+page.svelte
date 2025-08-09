<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { ArrowLeft, Download } from "@lucide/svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";
  import { base } from "$app/paths";
  import { crtEffectBlendMode, crtEffectEnabled } from "$lib/stores";
  import { CrtEffectBlendMode } from "$lib/interfaces/sys.interface";
  import Entry from "$lib/components/resume/Entry.svelte";
  import ResumeNav from "$lib/components/resume/ResumeNav.svelte";
  import ResumeMobileNav from "$lib/components/resume/ResumeMobileNav.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let resumeEntryScrollerHeight = $state(0);
  let scrollerSectionHeightMultiplier = 62;

  let mounted = $state(false);
  let smoother: globalThis.ScrollSmoother | null = $state(null);

  onMount(() => {

    data.resumeSections.then((s) => {
      resumeEntryScrollerHeight = Object.values(s).flat().length * scrollerSectionHeightMultiplier;
    })

    // Debug data loading
    Promise.all([
      data.contact,
      data.resumeSections, 
      data.projects,
      data.skills
    ]).then(([contact, sections, projects, skills]) => {
      console.log('Loaded data:', {
        contact,
        sections,
        projects: projects?.length || 0,
        skills: skills?.length || 0
      });
    }).catch(console.error);

    $crtEffectBlendMode = CrtEffectBlendMode.ColorDodge;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
    });

    mounted = true;
  });

  onDestroy(() => {
    $crtEffectBlendMode = CrtEffectBlendMode.Overlay;
    smoother?.kill();
  });
</script>

<svelte:head>
  {#await data.contact then contact}
    <title>Resume - {contact?.name || 'Loading...'}</title>
    <meta
      name="description"
      content="Professional resume of {contact?.name || 'Loading...'}"
    />
  {/await}
  <meta
    name="keywords"
    content="resume, software developer, computer science, full-stack, web development"
  />
</svelte:head>

<div
  class="bg-[url('/assets/resume-bg.png')] {$crtEffectEnabled
    ? 'bg-black/20'
    : 'bg-white/70'} h-full bg-blend-overlay bg-cover rounded-lg md:px-16 py-4 flex gap-6 font-courierPrime text-black"
>
  <div class="fixed md:absolute top-4 right-4 z-50 flex md:flex-col gap-2">
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
      <span
        class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-courierPrime whitespace-nowrap"
      >
        CRT: {$crtEffectEnabled ? "ON" : "OFF"}
      </span>
    </Button>
  </div>

  <div class="fixed md:absolute top-4 left-4 z-50 flex flex-col gap-2">
    <Button class="" variant="outline" size="icon" href="{base}/">
      <!-- <Download class="w-6 h-6 text-white" /> -->
      <ArrowLeft class="w-6 h-6 text-white" />
    </Button>
  </div>

  <div class="md:!w-3/4 !w-full relative">
    <div class="main-borders left-0 ml-4">&nbsp;</div>
    <main
      id="smooth-content"
      class="px-6 *:px-4 flex flex-col gap-8"
      style:height="{200 + resumeEntryScrollerHeight}rem"
    >
      <section
        data-speed="clamp(0.09)"
        class="flex w-full flex-col items-center mt-4 mb-8 backdrop-blur-lg z-20 text-center"
      >
        <h1 class="text-5xl w-1/2 border-b-2 border-b-black">Resume</h1>

        {#await data.contact}
          <div class="w-full flex flex-col items-center gap-2 mt-4">
            <Skeleton class="h-5 w-[40%]" />
            <Skeleton class="h-5 w-[30%]" />
          </div>
        {:then contact}
          {#if contact}
            <p class="text-sm">
              <span>{contact.name} | {contact.location} | </span>
              <a
                href="mailto:{contact.email}"
                class="underline hover:no-underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
              <span> | </span>
              <a
                href="/resume.pdf"
                class="underline hover:no-underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF Version
              </a>
            </p>

            <p class="text-sm">
              <a
                href="{contact.github || '#'}"
                class="underline hover:no-underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
              <span> | </span>
              <a
                href="{contact.linkedin || '#'}"
                class="underline hover:no-underline transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </p>
          {/if}
        {/await}
      </section>

      {#await data.resumeSections}
        <!-- Resume sections skeleton -->
        <div class="flex flex-col gap-8">
          {#each Array(3) as _}
            <section class="mb-12 rounded-lg p-6 shadow-sm">
              <div class="mb-6">
                <Skeleton class="h-6 w-40 mb-2" />
                <Skeleton class="h-0.5 w-full max-w-md" />
              </div>
              <div class="space-y-6">
                {#each Array(2) as __}
                  <Skeleton class="h-24 w-full" />
                {/each}
              </div>
            </section>
          {/each}
        </div>
      {:then sections}
        {#each Object.entries(sections) as [categoryKey, entries]}
          <section id={categoryKey} class="mb-12 rounded-lg p-6 shadow-sm">
            <!-- Section Title with Underline -->
            <div class="mb-6">
              <h2 class="text-2xl font-courierPrime text-black mb-2">
                {(() => {
                  const categoryNames: Record<string, string> = {
                    'experience': 'Experience',
                    'education': 'Education',
                    'volunteering': 'Volunteering',
                    'projects': 'Projects'
                  };
                  return categoryNames[categoryKey] || categoryKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                })()}
              </h2>
              <div class="w-full max-w-md h-0.5 bg-black"></div>
            </div>

            <!-- Section Entries -->
            <div class="space-y-8">
              {#each entries as entry}
                <Entry {entry} />
              {/each}
            </div>
          </section>
        {/each}
      {/await}

      <!-- Projects Section -->
      {#await data.projects}
        <!-- Projects skeleton -->
        <section class="mb-12 rounded-lg p-6 shadow-sm">
          <div class="mb-6">
            <Skeleton class="h-6 w-32 mb-2" />
            <Skeleton class="h-0.5 w-full max-w-md" />
          </div>
          <div class="space-y-6">
            {#each Array(3) as _}
              <Skeleton class="h-32 w-full" />
            {/each}
          </div>
        </section>
      {:then projects}
        {#if projects && projects.length > 0}
          <section id="projects" class="mb-12 rounded-lg p-6 shadow-sm">
            <!-- Section Title with Underline -->
            <div class="mb-6">
              <h2 class="text-2xl font-courierPrime text-black mb-2">Projects</h2>
              <div class="w-full max-w-md h-0.5 bg-black"></div>
            </div>

            <!-- Project Entries -->
            <div class="space-y-8">
              {#each projects as project}
                <Entry entry={project} />
              {/each}
            </div>
          </section>
        {:else}
          <section class="mb-12 rounded-lg p-6 shadow-sm">
            <p class="text-black/60">No projects to display</p>
          </section>
        {/if}
      {:catch error}
        <section class="mb-12 rounded-lg p-6 shadow-sm">
          <p class="text-red-600">Error loading projects: {error.message}</p>
        </section>
      {/await}

      <section id="Skills" class="mb-12 rounded-lg p-6 shadow-sm">
        <!-- Section Title with Underline -->
        <div class="mb-6">
          <h2 class="text-2xl font-courierPrime text-black mb-2">Skills</h2>
          <div class="w-full max-w-md h-0.5 bg-black"></div>
        </div>

        <!-- Skills Grid -->
        {#await data.skills}
          <div class="space-y-6">
            {#each Array(3) as _}
              <div>
                <Skeleton class="h-5 w-64 mb-3" />
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {#each Array(6) as __}
                    <Skeleton class="h-8" />
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {:then skillSections}
          <div class="space-y-6">
            {#each skillSections as section}
              <div class="skill-category">
                <h3 class="text-lg font-courierPrime font-semibold text-black mb-3">
                  {section.title}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {#each section.skills || [] as skill}
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
        {/await}
      </section>
    </main>
    <div class="main-borders right-0 mr-4">&nbsp;</div>
  </div>

  <ResumeNav bind:mounted bind:smoother resumeSections={data.resumeSections} class="nav-position" />

  <ResumeMobileNav bind:mounted bind:smoother resumeSections={data.resumeSections} />
</div>

<style type="postcss">
  .main-borders {
    @apply border-l-2 border-l-black w-0.5 h-[41vh] nav-position;
  }

  .nav-position {
    @apply fixed md:absolute top-[21vh];
  }
</style>
