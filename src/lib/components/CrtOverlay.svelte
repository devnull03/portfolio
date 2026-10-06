<script lang="ts">
  import { onMount } from "svelte";
  import { crtEffectBlendMode, crtEffectEnabled } from "$lib/stores";
  import fragmentSource from "$lib/shaders/crt.frag?raw";

  // The overlay is a static image for a given canvas size and on/off state, so it is drawn once
  // on mount, on resize and on toggle rather than every frame. (It used to be a full Babylon.js
  // engine re-rendering the same image 60 times a second.)

  let canvas: HTMLCanvasElement;

  // CRT shader parameters
  const on = {
    curvature: [4.0, 4.0],
    scanLineOpacity: [0.25, 0.25],
    vignetteOpacity: 1,
    brightness: 1.5,
    vignetteRoundness: 1,
  };
  const off = {
    curvature: [100.0, 100.0],
    scanLineOpacity: [0, 0],
    vignetteOpacity: 0,
    brightness: 1,
    vignetteRoundness: 100,
  };

  // Babylon's post-process vertex shader and quad, kept as-is so the interpolated UVs (and so
  // the output) match it exactly.
  const vertexSource = `
    attribute vec2 position;
    varying vec2 vUV;
    const vec2 madd = vec2(0.5, 0.5);
    void main(void) {
      vUV = position * madd + madd;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  let frame = 0;

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      throw new Error(gl!.getShaderInfoLog(shader) ?? "shader compile failed");
    }
    return shader;
  }

  // On WebGL2, compile as GLSL ES 3.00, the same way Babylon compiled this shader.
  const glsl3 = {
    vertex: "#version 300 es\n#define attribute in\n#define varying out\n",
    fragment:
      "#version 300 es\nprecision highp float;\n#define varying in\nout vec4 glFragColor;\n#define gl_FragColor glFragColor\n",
  };

  function init() {
    const attributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    };
    gl =
      canvas.getContext("webgl2", attributes) ??
      canvas.getContext("webgl", attributes);
    if (!gl) return;

    const program = gl.createProgram()!;
    const isWebGL2 = "texStorage2D" in gl;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, (isWebGL2 ? glsl3.vertex : "") + vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, (isWebGL2 ? glsl3.fragment : "") + fragmentSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen quad as two triangles.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms = Object.fromEntries(
      [
        "curvature",
        "screenResolution",
        "scanLineOpacity",
        "vignetteOpacity",
        "brightness",
        "vignetteRoundness",
      ].map((name) => [name, gl!.getUniformLocation(program, name)])
    );
  }

  function draw() {
    frame = 0;
    if (!gl) return;

    // One canvas pixel per CSS pixel, like Babylon's default (no device-pixel-ratio scaling).
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);

    const p = $crtEffectEnabled ? on : off;
    gl.uniform2f(uniforms.curvature, p.curvature[0], p.curvature[1]);
    gl.uniform2f(uniforms.screenResolution, width / 3, height / 3);
    gl.uniform2f(uniforms.scanLineOpacity, p.scanLineOpacity[0], p.scanLineOpacity[1]);
    gl.uniform1f(uniforms.vignetteOpacity, p.vignetteOpacity);
    gl.uniform1f(uniforms.brightness, p.brightness);
    gl.uniform1f(uniforms.vignetteRoundness, p.vignetteRoundness);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  // The overlay is decorative: if WebGL is unavailable or the shader fails, render nothing
  // rather than breaking the page.
  function setup() {
    try {
      init();
      draw();
    } catch (error) {
      console.error("CRT overlay disabled:", error);
      gl = null;
    }
  }

  onMount(() => {
    setup();

    const restore = setup;
    const lose = (e: Event) => e.preventDefault();
    canvas.addEventListener("webglcontextlost", lose);
    canvas.addEventListener("webglcontextrestored", restore);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", lose);
      canvas.removeEventListener("webglcontextrestored", restore);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      gl = null;
    };
  });

  // Redraw whenever the effect is switched on or off.
  $effect(() => {
    void $crtEffectEnabled;
    scheduleDraw();
  });

  export function toggle() {
    $crtEffectEnabled = !$crtEffectEnabled;
  }
</script>

<svelte:window onresize={scheduleDraw} />

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 {$crtEffectBlendMode} aspect-crt w-full h-full"
  class:opacity-0={!$crtEffectEnabled}
  class:opacity-100={$crtEffectEnabled}
></canvas>
