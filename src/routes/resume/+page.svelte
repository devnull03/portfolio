<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    getSectionKeys,
    resumeData,
    getSelectedProjects,
  } from "$lib/data/resume.data";
  import { Button } from "$lib/components/ui/button";
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

  let mounted = $state(false);
  let smoother: globalThis.ScrollSmoother | null = $state(null);

  onMount(() => {
    Promise.all(Object.values(data))
      .then((v) => {
        console.log(v);
      })
      .catch((err) => {
        console.error("Error loading resume data:", err);
      });

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
      class="px-6 *:px-4 flex flex-col gap-8 !h-[650rem] md:!h-[450rem]"
    >
      <section
        data-speed="clamp(0.09)"
        class="flex w-full flex-col items-center mt-4 mb-8 backdrop-blur-lg z-20 text-center"
      >
        <h1 class="text-5xl w-1/2 border-b-2 border-b-black">Resume</h1>

        <p class="text-sm">
          <span
            >{resumeData.contact.name} | {resumeData.contact.location} |
          </span>
          <a
            href={`mailto:${resumeData.contact.email}`}
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
            href={resumeData.contact.github || "#"}
            class="underline hover:no-underline transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          <span> | </span>
          <a
            href={resumeData.contact.linkedin || "#"}
            class="underline hover:no-underline transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
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
            {#if secId === "Projects"}
              {#each getSelectedProjects() as entry, idxe}
                <Entry {entry} />
              {/each}
            {:else}
              {#each resumeData.resumeSections[secId] as entry, idxe}
                {#if typeof entry === "object"}
                  <Entry {entry} />
                {/if}
              {/each}
            {/if}
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
    <div class="main-borders right-0 mr-4">&nbsp;</div>
  </div>

  <ResumeNav bind:mounted bind:smoother class="nav-position" />

  <ResumeMobileNav bind:mounted bind:smoother />
</div>

<style type="postcss">
  .main-borders {
    @apply border-l-2 border-l-black w-0.5 h-[41vh] nav-position;
  }

  .nav-position {
    @apply fixed md:absolute top-[21vh];
  }
</style>
