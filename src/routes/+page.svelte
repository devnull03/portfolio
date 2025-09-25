<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";
  import HomeIntro from "$lib/components/HomeIntro.svelte";
  import FunnyHaha from "$lib/components/FunnyHaha.svelte";
  import { goto } from "$app/navigation";
  import { crtEffectEnabled } from "$lib/stores";
  import { resumeData } from "$lib/data/resume.data";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let smoother: globalThis.ScrollSmoother | undefined = $state();
  let showFloatingWindow = $state(false);
  let loadFloatingWindow = $state(false);

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother = ScrollSmoother.create({
      smooth: 2,
      smoothTouch: 1,
      effects: true,
      normalizeScroll: true,
    });

    console.log("Spotify Data:", data.currentTrack);
    if (data.currentTrack) {
      console.log(
        `Currently ${data.currentTrack.isPlaying ? "Playing" : "Paused"}: ${data.currentTrack.display}`
      );
      console.log("URL:", data.currentTrack.link);
      console.log("image:", data.currentTrack.image);
    } else {
      console.log("No track playing");
    }
  });

  $crtEffectEnabled = true;

  onDestroy(() => {
    smoother?.kill();
  });
</script>

<svelte:window />

<main id="smooth-content" class="font-majorMono">
  <HomeIntro bind:smoother={smoother as globalThis.ScrollSmoother} />

  <section
    id="main-info"
    class="h-screen realtive w-full flex items-center justify-center flex-col gap-4 relative z-30 bg-background"
  >
    <p class="text-6xl">hello</p>
    <p class="">i make stuff</p>

    <div class="flex flex-wrap justify-center items-center gap-4 px-4">
      <Button href={resumeData.contact.linkedin} target="_blank" size="sm"
        >LinkedIn</Button
      >
      <Button href={resumeData.contact.github} target="_blank" size="sm"
        >Github</Button
      >
      <Button onclick={() => goto("/projects")} target="_blank" size="sm"
        >Projects</Button
      >
      <Button onclick={() => goto("/resume")} target="_blank" size="sm"
        >Resume</Button
      >

      <Button
        onclick={() => (showFloatingWindow = true)}
        onmouseover={() => (loadFloatingWindow = true)}
        variant="outline"
        size="sm"
        class="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
      >
        Surprize
      </Button>
      <Button
        href="https://devnull03.notion.site/thingys"
        target="_blank"
        size="sm">Blog</Button
      >
    </div>

    <p
      aria-label="summary"
      class="max-w-3xl text-justify text-sm font-courierPrime"
    >
      summary: <br />
      I've been creating projects since I was in 9th grade. I've worked with
      <b>automation</b> (<i>puppet browsers, discord bots, web scraping</i>),
      <b>web dev</b> (<i
        >fine tuning llms to use templates and create SEO optimised sites</i
      >), <b>optimisation</b> (<i
        >making the most efficient - websites, code, mass data processing
        scripts</i
      >). Also i've been making little cool tools with
      <b>notion integrations</b>
      recently. Contact me if you have something cool you want to work on.
    </p>

    <a
      href="mailto:arnav@dvnl.work"
      class="text-xs font-bold border-b border-b-white">email me here</a
    >
  </section>

  <!-- <div class="h-[39vh] -z-20 pointer-events-none!"></div> -->
  <footer
    data-speed="-0.5"
    class="h-[40vh] w-full bg-orange-400 text-black font-black flex items-center justify-center p-2 text-center"
  >
    how i built this: &nbsp; <a
      href="https://devnull03.notion.site/thingys"
      target="_blank"
      class="underline">blog post thingy</a
    >
  </footer>
</main>

{#if loadFloatingWindow}
  <FunnyHaha
    show={showFloatingWindow}
    onClose={() => (showFloatingWindow = false)}
  />
{/if}
