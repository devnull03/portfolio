<script lang="ts">
  const { smoother = $bindable() }: { smoother: globalThis.ScrollSmoother } =
    $props();

  const clickIntro = (e: MouseEvent | KeyboardEvent) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" &&
        e instanceof KeyboardEvent &&
        (e.key === "Enter" || e.key === "Space"))
    ) {
      smoother?.scrollTo("#main-info", true);
    }
  };

  // Each image "paints in" top to bottom like an old TV once it has loaded (this used to happen
  // by accident while the large PNGs streamed in after the loading screen).
  let gradientLoaded = $state(false);
  let bgLoaded = $state(false);
</script>

<section
  onkeydown={clickIntro}
  onclick={clickIntro}
  role="button"
  tabindex="0"
  class="relative h-screen w-full object-cover overflow-hidden blur-[1px] z-10"
  id="intro-section"
  data-speed="0.5"
  data-cursor-state="indicate-scroll-down"
>
  <!-- bg-background is only visible while the images are still drawing in (they are opaque),
       so the not-yet-drawn part looks like a dark screen instead of showing what's behind. -->
  <div class="absolute inset-0 z-0 w-full h-full select-none bg-background">
    <img
      src="/assets/Gradient.webp"
      class="tv-load w-full h-full md:object-cover select-none"
      class:loaded={gradientLoaded}
      onload={() => (gradientLoaded = true)}
      ondragstart={(e) => e.preventDefault()}
      alt=""
    />
  </div>

  <img
    src="/assets/bg.webp"
    alt=""
    ondragstart={(e) => e.preventDefault()}
    onload={() => (bgLoaded = true)}
    class:loaded={bgLoaded}
    style="--tv-load-duration: 1.6s; --tv-load-steps: 20; --tv-load-delay: 1.1s"
    class="tv-load absolute object-cover object-center md:object-contain h-full w-[100vh] md:w-full md:h-full p-4 select-none"
  />

  <div class="effect-static"></div>
</section>

<style>
  /* Top-to-bottom reveal in chunky steps, like a picture drawing in on an old TV. The default
     delay waits out the loading screen's 0.8s fade so the reveal is actually visible. */
  .tv-load {
    clip-path: inset(0 0 100% 0);
  }

  .tv-load.loaded {
    animation: tv-load var(--tv-load-duration, 2.4s)
      steps(var(--tv-load-steps, 30), end) var(--tv-load-delay, 0.8s) forwards;
  }

  @keyframes tv-load {
    from {
      clip-path: inset(0 0 100% 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tv-load,
    .tv-load.loaded {
      animation: none;
      clip-path: none;
    }
  }

  .effect-static {
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    width: 200%;
    height: 200vh;
    background: #000
      url(/assets/noise.webp) 0 0;
    background-size: 620px 620px;
    opacity: 0.3;
    animation: static-animation 0.3s infinite;
    visibility: visible;
  }

  @keyframes static-animation {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-5%, -5%);
    }
    20% {
      transform: translate(-10%, 5%);
    }
    30% {
      transform: translate(5%, -10%);
    }
    40% {
      transform: translate(-5%, 15%);
    }
    50% {
      transform: translate(-10%, 5%);
    }
    60% {
      transform: translate(15%, 0);
    }
    70% {
      transform: translate(0, 10%);
    }
    80% {
      transform: translate(-15%, 0);
    }
    90% {
      transform: translate(10%, 5%);
    }
    100% {
      transform: translate(5%, 0);
    }
  }
</style>
