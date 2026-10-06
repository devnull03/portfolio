<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, Download } from "@lucide/svelte";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";
  import { crtEffectBlendMode, crtEffectEnabled } from "$lib/stores";
  import { CrtEffectBlendMode } from "$lib/interfaces/sys.interface";
  import Entry from "$lib/components/resume/Entry.svelte";
  import ResumeNav from "$lib/components/resume/ResumeNav.svelte";
  import ResumeMobileNav from "$lib/components/resume/ResumeMobileNav.svelte";
  import type { PageProps } from "./$types";
  import { isRecruiter } from "$lib/stores";
  // import { fade } from "svelte/transition";

  let { data }: PageProps = $props();

  const scrollerSectionHeightMultiplier = 62;
  const resumeEntryScrollerHeight = $derived(
    Object.values(data.resumeSections).flat().length * scrollerSectionHeightMultiplier
  );

  let mounted = $state(false);
  let smoother: globalThis.ScrollSmoother | null = $state(null);

  onMount(() => {
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
  <title>Resume - {data.contact.name}</title>
  <meta
    name="description"
    content="Professional resume of {data.contact.name}"
  />
  <meta
    name="keywords"
    content="resume, software developer, computer science, full-stack, web development"
  />
</svelte:head>

<div
  class="bg-[url('/assets/resume-bg.png')] {!$isRecruiter && $crtEffectEnabled
    ? 'bg-black/20'
    : 'bg-white/70'} h-full bg-blend-overlay bg-cover rounded-lg md:px-16 py-4 flex gap-6 font-courierPrime text-black"
>
  <div class="fixed md:absolute top-4 right-4 z-50 flex md:flex-col gap-2">
    <Button
      class=""
      variant="outline"
      size="icon"
      target="_blank"
      href="/resume.pdf"
    >
      <Download class="w-6 h-6 text-white" />
    </Button>

    <Button
      class="relative hover:text-black {$isRecruiter && 'hidden'}"
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
    <Button class="" variant="outline" size="icon" href="/">
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

        {#if data.contact}
          {@const contact = data.contact}
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
      </section>

      {#each Object.entries(data.resumeSections) as [categoryKey, entries]}
          <section id={categoryKey} class="mb-12 rounded-lg p-6 ">
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

      <!-- Projects Section -->
      {#if data.projects.length > 0}
          <section id="projects" class="mb-12 rounded-lg p-6 ">
            <!-- Section Title with Underline -->
            <div class="mb-6">
              <h2 class="text-2xl font-courierPrime text-black mb-2">Projects</h2>
              <div class="w-full max-w-md h-0.5 bg-black"></div>
            </div>

            <!-- Project Entries -->
            <div class="space-y-8">
              {#each data.projects as project}
                <Entry entry={project} />
              {/each}
            </div>
          </section>
        {:else}
          <section class="mb-12 rounded-lg p-6 ">
            <p class="text-black/60">No projects to display</p>
          </section>
      {/if}

      <section id="Skills" class="mb-12 rounded-lg p-6 ">
        <!-- Section Title with Underline -->
        <div class="mb-6">
          <h2 class="text-2xl font-courierPrime text-black mb-2">Skills</h2>
          <div class="w-full max-w-md h-0.5 bg-black"></div>
        </div>

        <!-- Skills Grid -->
          <div class="space-y-6">
            {#each data.skills as section}
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
