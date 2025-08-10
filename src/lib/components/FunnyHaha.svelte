<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { Draggable } from "gsap/Draggable";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { X } from "@lucide/svelte";

  let {
    show,
    onClose,
  }: {
    show: boolean;
    onClose?: () => void;
  } = $props();

  let windowRef: HTMLDivElement;
  let headerRef: HTMLDivElement;
  let videoRef: HTMLVideoElement;

  onMount(() => {
    gsap.registerPlugin(Draggable);

    // Set initial position
//     gsap.set(windowRef, {
//       x: 100,
//       y: 100,
//     });

    Draggable.create(windowRef, {
      trigger: headerRef,
      cursor: "grab",
      activeCursor: "grabbing",
      bounds: "body",
      inertia: true,
      onDragStart: () => {
        gsap.to(windowRef, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      },
      onDragEnd: () => {
        gsap.to(windowRef, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      },
    });
  });

  function handleClose() {
    console.log("Closing window");
    if (windowRef) {
      show = false;
      gsap.to(windowRef, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          onClose?.();
        },
      });
    } else {
      onClose?.();
    }
  }

  $effect(() => {
    if (show && videoRef) {
      videoRef.play().catch(() => {});
    } else {
      videoRef?.pause();
    }
  });
</script>

<div
  bind:this={windowRef}
  class="fixed w-[700px] select-none shadow-2xl transform-gpu will-change-transform"
  style="z-index: {show ? 9999 : -10}; left: 100px; top: 100px;"
  class:invisible={!show}
>
  <Card
    class="overflow-hidden bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700"
  >
    <div
      bind:this={headerRef}
      class="flex flex-row items-center justify-between space-y-0 p-4 pb-3 cursor-grab active:cursor-grabbing bg-gray-50 dark:bg-gray-800 border-b"
    >
      <!-- <h3 class="font-semibold text-lg">Video Player</h3> -->
      <Button
        variant="ghost"
        size="icon"
        class="h-6 w-6 rounded-md hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
        onclick={handleClose}
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </Button>
    </div>

    <CardContent class="p-0">
      <div class="aspect-video w-full">
        <!-- svelte-ignore a11y_media_has_caption -->
        <video
          bind:this={videoRef}
          src="https://cdn.sanity.io/files/wt0c9f6z/production/6e17d07f3db2cb408a8d8119c9693800bb1a15cf.mp4"
          autoplay
          playsinline
          controls
          class="h-full w-full"
        >
        </video>
      </div>
    </CardContent>
  </Card>
</div>
