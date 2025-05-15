<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { navigating } from "$app/stores";
  import { PUBLIC_COMPANY_NAME, PUBLIC_DOMAIN } from "$env/static/public";
  import { dev } from "$app/environment";

  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let scrollY = $state(0);
  let { children }: Props = $props();

  let firstLoad = $state(true);
  let load = $derived(firstLoad || !$navigating);

  const siteData = {
    description: "",
    keywords: [],
    placename: "",
    region: "",
  }

  injectAnalytics({ mode: dev ? "development" : "production" });
  injectSpeedInsights();

  onMount(() => {
    firstLoad = false;
  });
</script>

<svelte:head>
  <title>{PUBLIC_COMPANY_NAME}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <!-- <link
		href="https://fonts.googleapis.com/css2?family=Alatsi&family=Cantarell:ital,wght@0,400;0,700;1,400;1,700&display=swap"
		rel="stylesheet"
	/> -->

  <script
    src="https://kit.fontawesome.com/30f055fc02.js"
    crossorigin="anonymous"
  ></script>

  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content={PUBLIC_COMPANY_NAME} />
  <link rel="manifest" href="/site.webmanifest" />

  <meta
    name="description"
    content={siteData.description}
  />
  <meta
    name="keywords"
    content={siteData.keywords.join(", ")}
  />
  <meta property="og:title" content={PUBLIC_COMPANY_NAME} />
  <meta
    property="og:description"
    content={siteData.description}
  />
  <meta property="og:image" content="/favicon-96x96.png" />
  <meta property="og:url" content={PUBLIC_DOMAIN} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={PUBLIC_COMPANY_NAME} />
  <meta
    name="twitter:description"
    content={siteData.description}
  />
  <meta name="twitter:image" content="/favicon-96x96.png" />

  <meta name="author" content={PUBLIC_COMPANY_NAME} />
  <meta name="geo.placename" content={siteData.placename} />
  <meta name="geo.region" content={siteData.region} />
</svelte:head>

<svelte:window bind:scrollY />

<Toaster />

{#key load}
  <div
    in:fade={{ duration: 400 }}
    class="flex h-screen flex-col justify-between"
  >
    <Header />
    <main class="">
      {@render children?.()}
    </main>
    <Footer />
  </div>
{/key}

{#if scrollY !== 0}
  <button
    transition:fade
    class="group fixed bottom-6 right-6 z-[999] rounded-full bg-[#C7A865] object-cover py-0.5 shadow-lg transition-all duration-500 hover:-translate-y-1"
    aria-label="yuh"
    onclick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  >
    <span
      class="fa fa-angle-left rotate-90 px-5 py-4 text-white transition-all duration-500 group-hover:scale-110"
    ></span>
  </button>
{/if}
