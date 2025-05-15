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

<main class="flex w-screen flex-col items-center gap-16 lg:gap-8 pb-48"></main>
