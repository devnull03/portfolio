<script lang="ts">
  import { onMount } from "svelte";
  import { Spring } from "svelte/motion";

  let mounted = false;
  let isPointer: boolean | null = false;
  let isOverText: boolean | null = false;
  
  // Spring for dot scale animations
  const dotScale = new Spring(1, {
    stiffness: 0.3,
    damping: 0.6,
  });

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

  function isPointOverText(x: number, y: number) {
    const element = document.elementFromPoint(x, y);
    if (element == null) return false;
    const nodes = element.childNodes;
    for (let i = 0, node; (node = nodes[i++]); ) {
      if (node.nodeType === 3) {
        const range = document.createRange();
        range.selectNode(node);
        const rects = range.getClientRects();
        for (let j = 0, rect; (rect = rects[j++]); ) {
          if (
            x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom
          ) {
            if (node.nodeType === Node.TEXT_NODE) return true;
          }
        }
      }
    }
    return false;
  }

  const isClickable = (el: Element | null): boolean => {
    if (!el) return false;

    // Get computed styles
    const style = getComputedStyle(el);

    // Check for pointer cursor style
    if (style.cursor === "pointer") return true;

    // Check common clickable elements
    const clickableTags = [
      "A",
      "BUTTON",
      "INPUT",
      "SELECT",
      "TEXTAREA",
      "LABEL",
      "SUMMARY",
    ];
    if (clickableTags.includes(el.tagName)) return true;

    // Check for role="button" and other interactive roles
    const interactiveRoles = ["button", "link", "checkbox", "menuitem", "tab"];
    if (
      el.getAttribute("role") &&
      interactiveRoles.includes(el.getAttribute("role") || "")
    )
      return true;

    // Check for click event listeners (approximate method)
    if (el.hasAttribute("onclick") || el.hasAttribute("on:click")) return true;

    // Check for clickable class indicators
    const clickableClasses = ["clickable", "btn", "button"];
    if (
      Array.from(el.classList).some((cls) =>
        clickableClasses.some((c) => cls.includes(c))
      )
    )
      return true;

    return false;
  };

  function handleMouseMove(event: MouseEvent | WheelEvent) {
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
      { preserveMomentum: 1000 }
    );

    // Check if we're hovering over interactive elements
    const element = document.elementFromPoint(event.clientX, event.clientY);

    const newIsOverText = isPointOverText(event.clientX, event.clientY);

    // Check element and its ancestors for clickability
    const newIsPointer =
      element &&
      (isClickable(element) ||
        isClickable(element.closest("[role], a, button, input, .clickable")));

    // Track if we're over text elements
    if (newIsOverText !== isOverText) {
      isOverText = newIsOverText;
    }

    // Handle pointer changes if not over text
    else if (!isOverText && newIsPointer !== isPointer) {
      isPointer = newIsPointer;
    }

    // Decide cursor scale based on its current state
    if (isOverText) {
      // Text cursor (I-beam) - medium scale
      dotScale.set(1.5);
    } else if (isPointer) {
      // Pointer cursor - larger scale
      dotScale.set(2);
    } else {
      // Default cursor - normal scale
      dotScale.set(1);
    }
  }

  onMount(() => {
    mounted = true;

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    dotPosition.set({ x: initialX, y: initialY });
    distortionPosition.set({ x: initialX, y: initialY, width: 80, height: 80 });
  });
</script>

<svelte:window onmousemove={handleMouseMove} onwheel={handleMouseMove} />

{#if mounted}
  <div
    class="hidden sm:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white/[0.02] will-change-transform"
    style="transform: translate3d(calc({distortionPosition.current
      .x}px - 50%), calc({distortionPosition.current.y}px - 50%), 0); 
           width: {distortionPosition.current
      .width}px; height: {distortionPosition.current.height}px;"
  ></div>
  <div
    class="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-exclusion will-change-transform bg-white rounded-full size-2"
    class:interactive-cursor={isPointer}
    class:text-cursor={isOverText}
    style="transform: translate3d(calc({dotPosition.current
      .x}px - 50%), calc({dotPosition.current.y}px - 50%), 0) scale({dotScale.current});"
  ></div>
{/if}

<style type="postcss">
  .interactive-cursor {
    @apply size-4 border-2 border-white bg-transparent rounded-full;
  }

  .text-cursor {
    @apply w-0.5 h-4 bg-white;
  }
</style>
