<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";
  import HomeIntro from "$lib/components/HomeIntro.svelte";
  import { goto } from "$app/navigation";
  import { crtEffectEnabled } from "$lib/stores";
  import { resumeData } from "$lib/data/resume.data";

  let smoother: globalThis.ScrollSmoother | undefined = $state();

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

<main id="smooth-content" class="font-majorMono">
  <HomeIntro bind:smoother={smoother as globalThis.ScrollSmoother} />

  <section
    id="main-info"
    class="h-screen realtive w-full flex items-center justify-center flex-col gap-4 relative z-30 bg-background"
  >
    <p class="text-6xl">hello</p>
    <p class="">i make stuff</p>

    <div class="flex items-center gap-4">
      <Button href={resumeData.contact.github} target="_blank" size="sm"
        >Github</Button
      >
      <Button onclick={() => goto("/resume")} target="_blank" size="sm"
        >Resume</Button
      >
      <Button onclick={() => goto("/projects")} target="_blank" size="sm"
        >Projects</Button
      >
    </div>
  </section>

  <footer data-speed="0.5" class="realtive z-10 h-screen bg-orange-400">
    alkfd
  </footer>
</main>
