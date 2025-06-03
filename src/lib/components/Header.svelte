<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { isMobile, scrollThreshold } from "$lib/stores.svelte";

  let initScroll = $state(0);
  let isLandingPage = $derived($page.route.id === "/");

  let mobileNavButtonWidth: number = $state(0);
  let mobileNavOpen = $state(false);

  $effect(() => {
    $isMobile = mobileNavButtonWidth !== 0;
  });

  onMount(() => {});
</script>

<svelte:window bind:scrollY={initScroll} />

<nav class="realtive">




</nav>
