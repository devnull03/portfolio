<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { PUBLIC_COMPANY_NAME, PUBLIC_DOMAIN } from "$env/static/public";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";

  import Cursor from "$lib/components/Cursor.svelte";
  import LoadingScreen from "$lib/components/LoadingScreen.svelte";
  import CrtOverlay from "$lib/components/CrtOverlay.svelte";
  import { page } from "$app/stores";
  import { ChevronUp } from "@lucide/svelte";
  import { crtEffectEnabled } from "$lib/stores";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let scrollY = $state(0);
  let { children }: Props = $props();

  let isLoading = $state($crtEffectEnabled);
  let crtEffect: CrtOverlay | undefined = $state(undefined);

  const siteData = {
    description: "",
    keywords: [],
    placename: "",
    region: "",
  };

  // injectAnalytics({ mode: dev ? "development" : "production" });
  // injectSpeedInsights();

  onMount(() => {});

  function handleLoadingComplete() {
    isLoading = false;
  }

  function toggleCRT() {
    crtEffect?.toggle();
  }
</script>

<svelte:head>
  <title>{PUBLIC_COMPANY_NAME}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Major+Mono+Display&display=swap"
    rel="stylesheet"
  />

  <!-- <script
    src="https://kit.fontawesome.com/30f055fc02.js"
    crossorigin="anonymous"
  ></script> -->

  <!-- <meta name="description" content={siteData.description} />
  <meta name="keywords" content={siteData.keywords.join(", ")} />
  <meta property="og:title" content={PUBLIC_COMPANY_NAME} />
  <meta property="og:description" content={siteData.description} />
  <meta property="og:image" content="/favicon-96x96.png" />
  <meta property="og:url" content={PUBLIC_DOMAIN} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={PUBLIC_COMPANY_NAME} />
  <meta name="twitter:description" content={siteData.description} />
  <meta name="twitter:image" content="/favicon-96x96.png" />

  <meta name="author" content={PUBLIC_COMPANY_NAME} />
  <meta name="geo.placename" content={siteData.placename} />
  <meta name="geo.region" content={siteData.region} /> -->

  <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
  <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
  <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
  <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
  <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
  <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
  <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
  <link
    rel="icon"
    type="image/png"
    sizes="192x192"
    href="/android-icon-192x192.png"
  />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="msapplication-TileColor" content="#ffffff" />
  <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
  <meta name="theme-color" content="#ffffff" />

</svelte:head>

<svelte:window bind:scrollY />

<CrtOverlay bind:this={crtEffect} />
<Cursor />
<ModeWatcher />
<Toaster />

{#if isLoading}
  <LoadingScreen onComplete={handleLoadingComplete} />
{:else}
  <div id="smooth-wrapper" class="aspect-crt h-full relative">
    <!-- <Header /> -->
    {@render children?.()}
    <!-- <Footer /> -->

    {#if scrollY !== 0}
      <button
        transition:fade
        class="group fixed md:absolute bottom-6 right-6 z-[999] rounded-full bg-primary object-cover p-3 shadow-lg transition-all duration-500 hover:-translate-y-1"
        aria-label="yuh"
        onclick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ChevronUp
          color="black"
          class="transition-all duration-500 group-hover:scale-110"
        ></ChevronUp>
      </button>
    {/if}
  </div>
{/if}
