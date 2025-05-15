<script lang="ts">
  import Instagram from "$lib/icons/Instagram.svelte";
  import PhoneCall from "$lib/icons/PhoneCall.svelte";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Title } from "$lib/components/ui/card";
  import { Slider } from "$lib/components/ui/slider";
  import { Input } from "$lib/components/ui/input";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { isMobile, scrollThreshold } from "$lib/stores.svelte";
  import { slide } from "svelte/transition";
  import { toast } from "svelte-sonner";
  import { PUBLIC_COMPANY_NAME } from "$env/static/public";

  let initScroll = $state(0);
  let isLandingPage = $derived($page.route.id === "/");

  let mobileNavButtonWidth: number = $state(0);
  let mobileNavOpen = $state(false);

  $effect(() => {
    $isMobile = mobileNavButtonWidth !== 0;
  });

  let colorState = $derived(
    !$isMobile ? initScroll < $scrollThreshold && isLandingPage : false
  );

  onMount(() => {});
</script>

<svelte:window bind:scrollY={initScroll} />

<nav class="realtive">
  {#if !isLandingPage}
    <div class="fixed left-[6%] top-4 z-[55] aspect-square h-16 w-16 invert">
      <!-- <Logo /> -->
    </div>
  {/if}

  <div
    class="fixed top-0 z-50 flex h-24 w-full flex-row justify-between border-b px-[6%] {initScroll <
      $scrollThreshold && isLandingPage
      ? 'border-transparent bg-transparent'
      : 'bg-white'} border-black transition-all duration-500 ease-in-out"
  >
    <button
      class="flex items-center pl-20 font-[Cantarell] text-xl lg:text-2xl {initScroll <
        $scrollThreshold && isLandingPage
        ? 'text-transparent'
        : 'text-[#00000080]'}"
      id="header-logo-area"
      onclick={() => goto("/")}
    >
      {PUBLIC_COMPANY_NAME}
    </button>

    <button
      class="absolute right-4 top-0 px-8 py-10 md:hidden lg:hidden {initScroll <
        $scrollThreshold && isLandingPage
        ? 'text-white'
        : 'text-black'}"
      bind:clientWidth={mobileNavButtonWidth}
      onclick={() => (mobileNavOpen = !mobileNavOpen)}
    >
      {#if mobileNavOpen}
        <span class="fa fa-times scale-150"></span>
      {:else}
        <span class="fa fa-bars scale-150"></span>
      {/if}
    </button>

    {#if !$isMobile || mobileNavOpen}
      <div
        transition:slide
        class="absolute top-24 z-[999] -mx-[6%] flex w-screen flex-col items-center justify-evenly gap-8 border-b border-black bg-white py-4 lg:relative lg:top-0 lg:mx-0 lg:w-auto lg:flex-row lg:border-transparent lg:bg-transparent lg:py-0"
      >
        <!-- nav buttons -->
      </div>
    {/if}
  </div>
</nav>
