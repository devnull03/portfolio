<script lang="ts">
  import { onMount } from "svelte";
  import { Spring } from "svelte/motion";
  import { gsap } from "gsap";
  import { MorphSVGPlugin } from "gsap/all";
  import { CursorState } from "$lib/interfaces/cursor.interface";
  import { currentState } from "$lib/stores.svelte";

  let mounted = $state(false);

  let cursorSvg: SVGElement | undefined = $state();
  let currentPath: SVGPathElement;

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

  const isPointOverText = (x: number, y: number): boolean => {
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
  };

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

  const isOverScrollDownIndicator = (x: number, y: number): boolean => {
    const element = document.elementFromPoint(x, y);
    if (!element) return false;

    if (element.getAttribute("data-cursor-state") === "indicate-scroll-down") {
      return true;
    }

    let parent = element.parentElement;
    while (parent) {
      if (parent.getAttribute("data-cursor-state") === "indicate-scroll-down") {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  };

  function handleMouseMove(event: MouseEvent | WheelEvent) {
    if (!mounted) return;

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

    const element = document.elementFromPoint(event.clientX, event.clientY);

    const isOverText = isPointOverText(event.clientX, event.clientY);
    const isPointer =
      element &&
      (isClickable(element) ||
        isClickable(element.closest("[role], a, button, input, .clickable")));
    const isOverScrollDown = isOverScrollDownIndicator(
      event.clientX,
      event.clientY
    );

    // Determine the new cursor state
    let newState: CursorState;
    if (isOverScrollDown) {
      newState = CursorState.ArrowDown;
    } else if (isPointer) {
      newState = CursorState.Pointer;
    } else if (isOverText) {
      newState = CursorState.Text;
    } else {
      newState = CursorState.Default;
    }

    // Update state if changed
    if (newState !== $currentState) {
      $currentState = newState;
      // updateCursorAppearance($currentState);
    }
  }

  function updateCursorAppearance(state: CursorState) {
    switch (state) {
      case CursorState.Text:
        // Text cursor (I-beam) - medium scale
        dotScale.set(1.5);
        break;
      case CursorState.Pointer:
        // Pointer cursor - larger scale
        dotScale.set(2);
        break;
      case CursorState.ArrowDown:
        // Down arrow cursor - normal scale
        dotScale.set(1);
        break;
      case CursorState.Default:
      default:
        // Default cursor - normal scale
        dotScale.set(1);
        break;
    }

    morphToShape(state);
  }

  function morphToShape(shapeName: string) {
    if (!mounted || !currentPath) {
      console.log(
        "Morph failed: mounted=",
        mounted,
        "currentPath=",
        currentPath
      );
      return;
    }

    const targetPath = cursorSvg?.querySelector(
      `#${shapeName}`
    ) as SVGPathElement;
    if (!targetPath) {
      console.log("Target path not found:", shapeName);
      return;
    }

    try {
      gsap.to(currentPath, {
        morphSVG: `#${shapeName}`,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          console.log("Morph completed to:", shapeName);
        },
        onError: (error: any) => {
          console.log("Morph error:", error);
          // Fallback: directly set the path data
          const targetPathData = targetPath.getAttribute("d");
          if (targetPathData) {
            currentPath.setAttribute("d", targetPathData);
          }
        },
      });
    } catch (error) {
      console.log("MorphSVG plugin error:", error);
      // Fallback: directly set the path data
      const targetPathData = targetPath.getAttribute("d");
      if (targetPathData) {
        gsap.to(currentPath, {
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            currentPath.setAttribute("d", targetPathData);
          },
        });
      }
    }
  }

  $effect(() => updateCursorAppearance($currentState));

  onMount(() => {
    gsap.registerPlugin(MorphSVGPlugin);

    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    dotPosition.set({ x: initialX, y: initialY });
    distortionPosition.set({ x: initialX, y: initialY, width: 80, height: 80 });

    mounted = true;

    // Get reference to the current path for morphing after mount
    setTimeout(() => {
      if (cursorSvg) {
        currentPath = cursorSvg.querySelector(
          "#current-path"
        ) as SVGPathElement;
        console.log("Current path set:", currentPath);
        console.log("Cursor SVG:", cursorSvg);
      }
    }, 100);
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

  <svg
    bind:this={cursorSvg}
    class="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-exclusion will-change-transform"
    style="transform: translate3d(calc({dotPosition.current
      .x}px - 35%), calc({dotPosition.current
      .y}px - 35%), 0) scale({dotScale.current});"
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <path id="dot" d="M16 16m-6 0a6 6 0 1 1 12 0a6 6 0 1 1 -12 0" />

      <path
        id="ring"
        d="M16 16m-9 0a9 9 0 1 1 18 0a9 9 0 1 1 -18 0 M16 16m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"
        fill-rule="evenodd"
      />

      <path id="caret" d="M15 8h2v16h-2z" fill="white" />

      <!-- <path id="arrow-down" d="M15 8h2v12h4l-5 6-5-6h4V8z" /> -->
      <path
        id="arrow-down"
        d="M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0ZM25.4297 27.5479L32.0889 20.8887C32.6473 20.3302 33.5529 20.3302 34.1113 20.8887C34.6698 21.4471 34.6698 22.3527 34.1113 22.9111L25.0107 32.0107C24.4523 32.5692 23.5477 32.5692 22.9893 32.0107L13.8887 22.9111C13.3302 22.3527 13.3302 21.4471 13.8887 20.8887C14.4471 20.3302 15.3527 20.3302 15.9111 20.8887L22.5703 27.5479V4.05078C12.1919 4.78383 4 13.435 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 13.435 35.8081 4.78383 25.4297 4.05078V27.5479Z"
        fill="white"
      />
    </defs>

    <path
      id="current-path"
      d="M16 16m-6 0a6 6 0 1 1 12 0a6 6 0 1 1 -12 0"
      fill="white"
      stroke="none"
    />
  </svg>
{/if}
