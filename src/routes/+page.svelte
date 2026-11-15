<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { ScrollSmoother } from "gsap/ScrollSmoother";
  import HomeIntro from "$lib/components/HomeIntro.svelte";
  import { goto } from "$app/navigation";
  import { crtEffectEnabled } from "$lib/stores";
  import type { PageData } from "./$types";
  import type { NowPlaying } from "$lib/interfaces/spotify.interface";
  import SpotifyInfo from "$lib/components/SpotifyInfo.svelte";
  import { Github, Linkedin } from "@lucide/svelte";

  let { data }: { data: PageData } = $props();

  let smoother: globalThis.ScrollSmoother | undefined = $state();
  let showFloatingWindow = $state(false);
  let loadFloatingWindow = $state(false);
  let nowPlaying = $state<NowPlaying | null>(null);

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother = ScrollSmoother.create({
      smooth: 2,
      smoothTouch: 1,
      effects: true,
      normalizeScroll: true,
    });

    // The widget only appears after scrolling, so this never delays first paint. Refresh it
    // every 30s while the tab is visible so it follows track changes (the API caches for 15s).
    const loadNowPlaying = () =>
      fetch("/api/now-playing")
        .then((res) => (res.ok ? (res.json() as Promise<NowPlaying>) : null))
        .then((body) => {
          if (body) nowPlaying = body;
        })
        .catch(() => {});
    loadNowPlaying();
    const poll = setInterval(() => {
      if (!document.hidden) loadNowPlaying();
    }, 30_000);
    const onVisible = () => {
      if (!document.hidden) loadNowPlaying();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  });

  $crtEffectEnabled = true;

  let scrollY = $state(0);

  onDestroy(() => {
    smoother?.kill();
  });
</script>

<svelte:window bind:scrollY />

<main id="smooth-content" class="font-majorMono">
  <HomeIntro bind:smoother={smoother as globalThis.ScrollSmoother} />

  <section
    id="main-info"
    class="h-screen realtive w-full flex items-center justify-center flex-col gap-4 relative z-30 bg-background"
  >
    <p class="text-6xl">hello</p>
    <p class="">i make stuff</p>

    <div class="flex flex-wrap justify-center items-center gap-4 px-4">
      <Button onclick={() => goto("/projects")} target="_blank" size="sm"
        >Projects</Button
      >
      <Button onclick={() => goto("/resume")} target="_blank" size="sm"
        >Resume</Button
      >

      <Button href={data.contact.linkedin} target="_blank" size="sm">
        <Linkedin class="stroke-[1.5]" />
      </Button>
      <Button
        href={data.contact.github}
        target="_blank"
        size="sm"
        class="group"
      >
        <Github class="stroke-[1.5]" />
        <!-- <span class="group-hover:w-full w-0 overflow-clip duration-400 transition-all ease-in-out">Github</span> -->
      </Button>
      {#if data.contact.discord}
        <Button href={data.contact.discord} target="_blank" size="sm" aria-label="Discord">
          <!-- Discord has no Lucide icon; this is the official logo mark (Simple Icons). -->
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
            />
          </svg>
        </Button>
      {/if}



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
      <b>generative AI</b> (<i
        >prototyping image and video workflows at Magic Hour, YC W24</i
      >), <b>desktop apps</b> (<i
        >qrate: a Rust/GPUI cataloguing tool used by real archivists</i
      >), <b>open source</b> (<i
        >Islandora: digital preservation and ingest tooling</i
      >), <b>agents</b> (<i
        >MCP servers, Poke integrations, Pokeforge at treehacks-stanford</i
      >) and <b>optimisation</b> (<i
        >fast sites, big data migrations: 3M+ archival photos</i
      >). Contact me if you have something cool you want to work on.
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

{#if scrollY !== 0 && nowPlaying?.currentTrack}
  <SpotifyInfo
    currentTrack={nowPlaying.currentTrack}
    trackType={nowPlaying.trackType}
    playedAt={nowPlaying.playedAt}
  />
{/if}

<!-- Loaded on first hover of the button, so Draggable/Inertia stay out of the initial bundle. -->
{#if loadFloatingWindow}
  {#await import("$lib/components/FunnyHaha.svelte") then { default: FunnyHaha }}
    <FunnyHaha
      show={showFloatingWindow}
      onClose={() => (showFloatingWindow = false)}
    />
  {/await}
{/if}
