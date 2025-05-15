<script lang="ts">
  import { onMount } from "svelte";
  import { Spring } from "svelte/motion";

  let mounted = false;
  let isPointer = false;

  // Create new Spring stores for cursor positions
  const dotPosition = new Spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.2,
      damping: 0.7,
    }
  );

  const distortionPosition = new Spring(
    { x: 0, y: 0, width: 80, height: 80 },
    {
      stiffness: 0.05,
      damping: 1,
    }
  );

  // Spring for dot scale
  const dotScale = new Spring(1, {
    stiffness: 0.3,
    damping: 0.6,
  });

  function handleMouseMove(event: MouseEvent) {
    if (!mounted) return;

    // Update spring positions with mouse coordinates
    dotPosition.set({ x: event.clientX, y: event.clientY });
    distortionPosition.set(
      {
        x: event.clientX,
        y: event.clientY,
        width: distortionPosition.current.width,
        height: distortionPosition.current.height,
      },
      { preserveMomentum: 10000 }
    );

    // Check if we're hovering over interactive elements
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const newIsPointer = element
      ? getComputedStyle(element).cursor === "pointer"
      : false;

    if (newIsPointer !== isPointer) {
      isPointer = newIsPointer;

      if (isPointer) {
        dotScale.set(3);
        distortionPosition.set({
          ...distortionPosition.current,
          width: 100,
          height: 100,
        });
      } else {
        dotScale.set(1);
        distortionPosition.set({
          ...distortionPosition.current,
          width: 80,
          height: 80,
        });
      }
    }
  }

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    mounted = true;

    // Set initial positions to center of window
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    dotPosition.set({ x: initialX, y: initialY });
    distortionPosition.set({ x: initialX, y: initialY, width: 80, height: 80 });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });
</script>

{#if mounted}
  <div
    class="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white/[0.02] will-change-transform"
    style="transform: translate3d(calc({distortionPosition.current
      .x}px - 50%), calc({distortionPosition.current.y}px - 50%), 0); 
           width: {distortionPosition.current
      .width}px; height: {distortionPosition.current.height}px;"
  ></div>
  <div
    class="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[10000] mix-blend-exclusion will-change-transform"
    style="transform: translate3d(calc({dotPosition.current
      .x}px - 50%), calc({dotPosition.current
      .y}px - 50%), 0) scale({dotScale.current});"
  ></div>
{/if}
