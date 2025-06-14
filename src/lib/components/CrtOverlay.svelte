<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    Engine,
    Scene,
    TargetCamera,
    Vector2,
    Vector3,
  } from "@babylonjs/core";
  import { PostProcess } from "@babylonjs/core/PostProcesses";

  let canvas: HTMLCanvasElement;
  let engine: Engine;
  let scene: Scene;
  let camera: TargetCamera;
  let postProcess: PostProcess;

  export let enabled = false;

  // CRT shader parameters
  let screenCurvatureOn = new Vector2(4.0, 4.0);
  let scanLineOpacityOn = new Vector2(0.25, 0.25);
  let vignetteOpacityOn = 1;
  let brightnessOn = 1.5;
  let vignetteRoundnessOn = 1;

  let screenCurvatureOff = new Vector2(100.0, 100.0);
  let scanLineOpacityOff = new Vector2(0, 0);
  let vignetteOpacityOff = 0;
  let brightnessOff = 1;
  let vignetteRoundnessOff = 100;

  let screenCurvature = new Vector2();
  let scanLineOpacity = new Vector2();
  let vignetteOpacity = 0;
  let brightness = 0;
  let vignetteRoundness = 0;

  onMount(async () => {
    // Initialize Babylon.js
    engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });
    scene = new Scene(engine);

    // Create orthographic camera for full-screen effect
    camera = new TargetCamera("crtCamera", Vector3.Zero(), scene);
    camera.setTarget(Vector3.Zero());

    // Create the CRT post-process effect
    postProcess = new PostProcess(
      "CRTShaderPostProcess",
      "./assets/shaders/crt", // Path to your shader
      [
        "curvature",
        "screenResolution",
        "scanLineOpacity",
        "vignetteOpacity",
        "brightness",
        "vignetteRoundness",
      ],
      null,
      1.0,
      camera
    );

    postProcess.onApply = (effect) => {
      const canvas = effect.getEngine().getRenderingCanvas();
      effect.setFloat2("curvature", screenCurvature.x, screenCurvature.y);
      effect.setFloat2(
        "screenResolution",
        canvas!.width / 3,
        canvas!.height / 3
      );
      effect.setFloat2("scanLineOpacity", scanLineOpacity.x, scanLineOpacity.y);
      effect.setFloat("vignetteOpacity", vignetteOpacity);
      effect.setFloat("brightness", brightness);
      effect.setFloat("vignetteRoundness", vignetteRoundness);
    };

    // Set initial values
    updateShaderValues();

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
  });

  onDestroy(() => {
    engine?.dispose();
  });

  function handleResize() {
    engine.resize();
  }

  function updateShaderValues() {
    if (enabled) {
      screenCurvature.copyFrom(screenCurvatureOn);
      scanLineOpacity.copyFrom(scanLineOpacityOn);
      vignetteOpacity = vignetteOpacityOn;
      brightness = brightnessOn;
      vignetteRoundness = vignetteRoundnessOn;
    } else {
      screenCurvature.copyFrom(screenCurvatureOff);
      scanLineOpacity.copyFrom(scanLineOpacityOff);
      vignetteOpacity = vignetteOpacityOff;
      brightness = brightnessOff;
      vignetteRoundness = vignetteRoundnessOff;
    }
  }

  $: if (typeof window !== "undefined") {
    updateShaderValues();
  }

  export function toggle() {
    enabled = !enabled;
    updateShaderValues();
  }
</script>

<svelte:window onresize={handleResize} />

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none z-[999] transition-opacity duration-300 mix-blend-overlay md:!w-[calc(100vh*(4/3))] md:mx-auto w-full h-full"
  class:opacity-0={!enabled}
  class:opacity-100={enabled}
></canvas>
