<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { gsap } from "gsap";
  import { ScrollTrigger, ScrollSmoother } from "gsap/all";

  let initScroll = $state(0);
  let smoother: globalThis.ScrollSmoother;

  const clickIntro = (e: MouseEvent | KeyboardEvent) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" &&
        e instanceof KeyboardEvent &&
        (e.key === "Enter" || e.key === "Space"))
    ) {

      smoother?.scrollTo("#main-info", true)
      
    }
  };

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      normalizeScroll: true,
    });
  });
</script>

<svelte:window bind:scrollY={initScroll} />

  <main id="smooth-content" class="">
    <section
      onkeydown={clickIntro}
      onclick={clickIntro}
      role="button"
      tabindex="0"
      class="relative h-screen w-full object-cover overflow-hidden blur-[1px] z-10"
      id="intro-section"
      data-speed="0.7"
      data-cursor-state="indicate-scroll-down"
    >
      <div class="absolute inset-0 z-0 w-full h-full select-none">
        <img
          src="/assets/Gradient.png"
          class="w-full h-full object-cover select-none"
          ondragstart={(e) => e.preventDefault()}
          alt=""
        />
      </div>

      <img
        src="/assets/bg.png"
        alt=""
        ondragstart={(e) => e.preventDefault()}
        class="absolute object-contain h-full w-full p-4 select-none rotate-90 md:rotate-0"
      />

      <div class="effect-static"></div>

      <!-- <div class="borderAnimation"></div>
    <div class="borderAnimationBottom"></div> -->
    </section>

    <section
      id="main-info"
      class="h-screen w-full flex items-center justify-center flex-col gap-4 relative z-30 bg-background"
    >
      <p class="text-6xl">hello</p>

      <Button href="/resume" size="sm">Resume</Button>
    </section>
  </main>

<style>
  #smooth-content {
    overflow: visible;
    width: 100%;
    height: 100rem;
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
      url(https://www.dropbox.com/s/h7ab1c82ctzy83n/noise.png?raw=1) 0 0;
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
