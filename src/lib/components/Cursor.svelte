<script lang="ts">
  import { onMount } from "svelte";
  import { Spring } from "svelte/motion";

  let mounted = false;
  let isPointer: boolean | null = false;
  let isOverStatic = false;

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
      { preserveMomentum: 5000 }
    );

    // Check if we're hovering over interactive elements
    const element = document.elementFromPoint(event.clientX, event.clientY);

    // Check for static effect first (higher priority)
    const newIsOverStatic = element
      ? element.classList.contains("effect-static") ||
        element.closest(".effect-static") !== null
      : false;
    
    // Enhanced pointer detection
    const isClickable = (el: Element | null): boolean => {
      if (!el) return false;
      
      // Get computed styles
      const style = getComputedStyle(el);
      
      // Check for pointer cursor style
      if (style.cursor === "pointer") return true;
      
      // Check common clickable elements
      const clickableTags = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "LABEL", "SUMMARY"];
      if (clickableTags.includes(el.tagName)) return true;
      
      // Check for role="button" and other interactive roles
      const interactiveRoles = ["button", "link", "checkbox", "menuitem", "tab"];
      if (el.getAttribute("role") && interactiveRoles.includes(el.getAttribute("role") || "")) return true;
      
      // Check for click event listeners (approximate method)
      if (el.hasAttribute("onclick") || el.hasAttribute("on:click")) return true;
      
      // Check for clickable class indicators
      const clickableClasses = ["clickable", "btn", "button"];
      if (Array.from(el.classList).some(cls => clickableClasses.some(c => cls.includes(c)))) return true;
      
      return false;
    };
    
    // Check element and its ancestors for clickability
    const newIsPointer = newIsOverStatic || 
      (element && (isClickable(element) || isClickable(element.closest("[role], a, button, input, .clickable"))));
    
    // Handle static effect hover state change
    if (newIsOverStatic !== isOverStatic) {
      isOverStatic = newIsOverStatic;
      
      if (isOverStatic) {
        // Create ring effect - larger scale with hollow inside
        dotScale.set(4);
        distortionPosition.set({
          ...distortionPosition.current,
          width: 120,
          height: 120,
        });
        // Static effect overrides pointer effect
        isPointer = true;
      } else {
        // Check if we should fall back to regular pointer state
        const element = document.elementFromPoint(event.clientX, event.clientY);
        const stillPointer = element
          ? isClickable(element) || isClickable(element.closest("[role], a, button, input, .clickable"))
          : false;
          
        isPointer = stillPointer;
        
        // Reset to appropriate state
        dotScale.set(isPointer ? 3 : 1);
        distortionPosition.set({
          ...distortionPosition.current,
          width: isPointer ? 100 : 80,
          height: isPointer ? 100 : 80,
        });
      }
    } 
    // Only handle pointer changes if not over static element
    else if (!isOverStatic && newIsPointer !== isPointer) {
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
    window.addEventListener("wheel", handleMouseMove);
    mounted = true;

    // Set initial positions to center of window
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    dotPosition.set({ x: initialX, y: initialY });
    distortionPosition.set({ x: initialX, y: initialY, width: 80, height: 80 });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleMouseMove);
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
    class="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000] mix-blend-exclusion will-change-transform"
    class:bg-white={!isPointer}
    class:border={isPointer}
    class:border-white={isPointer}
    class:bg-transparent={isPointer}
    style="transform: translate3d(calc({dotPosition.current
      .x}px - 50%), calc({dotPosition.current
      .y}px - 50%), 0) scale({dotScale.current});"
  ></div>
{/if}
