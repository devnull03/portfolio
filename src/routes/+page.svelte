<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import Button from "$lib/components/ui/button/button.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import * as Card from "$lib/components/ui/card";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { isMobile, scrollThreshold } from "$lib/stores.svelte";

  let initScroll = $state(0);

  onMount(() => {});
</script>

<svelte:window bind:scrollY={initScroll} />

<main class="relative min-h-screen w-full">

  <div class="absolute inset-0 z-0 w-full h-full select-none">
    <img src="/assets/Gradient.png" class="w-full h-full object-cover select-none" ondragstart={e => e.preventDefault()} alt="">
  </div>




</main>
