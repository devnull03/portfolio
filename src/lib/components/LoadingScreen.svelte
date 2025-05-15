<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { PUBLIC_COMPANY_NAME } from "$env/static/public";

  interface Props {
    onComplete: () => void;
  }

  let { onComplete = $bindable() }: Props = $props();

  let loadingComplete = $state(false);
  let extendBar = $state(false);

  function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  onMount(() => {
    const duration = 1000;

    setTimeout(() => {
      loadingComplete = true;
      setTimeout(() => {
        extendBar = true;
      }, 500);

      setTimeout(() => {
        onComplete();
      }, 800);
    }, duration);
  });
</script>

<div
  class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
  out:fade={{ duration: 800 }}
>
  <div class="mb-12 text-2xl font-light text-black">
    {PUBLIC_COMPANY_NAME || "Loading"}
  </div>

  <div
    class="relative h-0.5 overflow-hidden transition-all duration-500 ease-out"
    class:w-[30%]={!extendBar}
    class:w-full={extendBar}
  >
    <div
      class="absolute top-0 h-full bg-black"
      class:loading-bar={!loadingComplete}
      class:loading-complete={extendBar}
    ></div>
  </div>
</div>

<style>
  .loading-bar {
    width: 30%;
    animation: loading-animation 1s infinite ease-in-out;
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      50% 0%,
      60% 50%,
      50% 100%,
      40% 50%
    );
  }

  .loading-complete {
    width: 100% !important;
    animation: none !important;
    transition: width 0.5s ease-in-out;
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  @keyframes loading-animation {
    0% {
      left: -30%;
    }
    100% {
      left: 100%;
    }
  }
</style>
