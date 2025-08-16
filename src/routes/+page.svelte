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
  });

  $crtEffectEnabled = true;

  onDestroy(() => {
    smoother?.kill();
  });
</script>

<svelte:window />

<main id="smooth-content" class="font-majorMono h-[250vh]">
  <HomeIntro bind:smoother={smoother as globalThis.ScrollSmoother} />

  <section
    id="main-info"
    class="h-screen realtive w-full flex items-center justify-center flex-col gap-4 relative z-30 bg-background"
  >
    <p class="text-6xl">hello</p>
    <p class="">i make stuff</p>

    <div class="flex flex-wrap justify-center items-center gap-4 px-4">
      <Button href={resumeData.contact.github} target="_blank" size="sm"
        >Github</Button
      >
      <Button onclick={() => goto("/resume")} target="_blank" size="sm"
        >Resume</Button
      >
      <Button onclick={() => goto("/projects")} target="_blank" size="sm"
        >Projects</Button
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
      <Button href="https://devnull03.notion.site/thingys" target="_blank" size="sm"
        >Blog</Button
      >
    </div>
  </section>

  <footer data-speed="1" class="realtive z-10 h-[40vh] bg-orange-400 text-black font-black flex items-center justify-center p-2 text-center">
    how i built this: <a href="https://devnull03.notion.site/thingys" target="_blank">blog post thingy</a>
  </footer>
</main>

{#if loadFloatingWindow}
  <FunnyHaha show={showFloatingWindow} onClose={() => (showFloatingWindow = false)} />
{/if}
