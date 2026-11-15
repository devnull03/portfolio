<script lang="ts">
  import { fade } from "svelte/transition";
  import type { CurrentTrackData } from "$lib/interfaces/spotify.interface";
  import SpotifyLogo from "$lib/assets/Spotify_Primary_Logo_RGB_White.png";
  import Vinyl from "$lib/assets/vecteezy_black-vinyl-disc-record-for-music-album-cover-design_9393830.png";

  interface Props {
    currentTrack: CurrentTrackData | null;
    trackType?: "current" | "recent";
    playedAt?: string;
  }

  let { currentTrack, trackType, playedAt }: Props = $props();

  // Seconds. Seeded from the API response, then ticked locally while the track plays.
  let progress = $state(0);
  let duration = $state(0);

  const isCurrent = $derived(trackType === "current");
  const isPlaying = $derived(isCurrent && !!currentTrack?.isPlaying);
  const percent = $derived(duration > 0 ? Math.min(100, (progress / duration) * 100) : 0);
  const artists = $derived(currentTrack?.artists?.join(", ") || "Unknown artist");

  $effect(() => {
    const track = currentTrack;
    const total = isCurrent && track?.duration ? Math.floor(track.duration / 1000) : 0;
    progress = isCurrent && track?.progress ? Math.floor(track.progress / 1000) : 0;
    duration = total;
    if (!isPlaying || total === 0) return;

    const interval = setInterval(() => {
      if (progress < total) progress += 1;
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
</script>

<div
  class="fixed md:absolute bottom-6 left-6 z-[9999] w-[19rem] max-w-[calc(100vw-3rem)] font-courierPrime text-white"
  data-name="spotifyPlayer"
  transition:fade
>
  <div class="inline-block mb-1 rounded-lg bg-[#1e1e1e] px-1.5 text-[0.6rem]">
    {isCurrent ? (isPlaying ? "Now Listening to" : "Paused") : "Last Played"}
  </div>

  <div class="rounded-lg border-2 border-[#696969] bg-[#1e1e1e] p-2.5 shadow-lg">
    <div class="flex items-start gap-3">
      <!-- Record with the album art as its label; it spins while the track is playing. -->
      <div class="relative size-16 shrink-0">
        <img
          alt=""
          src={Vinyl}
          class="absolute inset-0 size-full rounded-full object-cover pointer-events-none {isPlaying
            ? 'animate-[spin_3s_linear_infinite]'
            : ''}"
        />
        <div
          class="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#444444]"
        >
          {#if currentTrack?.image}
            <img
              alt="Album cover"
              src={currentTrack.image}
              class="size-full object-cover pointer-events-none {isPlaying
                ? 'animate-[spin_3s_linear_infinite]'
                : ''}"
            />
          {/if}
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <a
          href={currentTrack?.link}
          target="_blank"
          rel="noopener"
          class="line-clamp-2 break-words text-sm font-bold leading-tight hover:underline"
          title={currentTrack?.name}
        >
          {currentTrack?.name || "Song name"}
        </a>
        <p class="mt-0.5 truncate text-[0.7rem] text-[#b3b3b3]" title={artists}>
          {artists}
        </p>
      </div>

      <a
        href={currentTrack?.link}
        target="_blank"
        rel="noopener"
        class="shrink-0 opacity-80 transition-opacity hover:opacity-100"
        aria-label="Open in Spotify"
      >
        <img alt="" src={SpotifyLogo} class="size-5" />
      </a>
    </div>

    {#if isCurrent && duration > 0}
      <!-- Transport row: status, elapsed, scrubber, total. -->
      <div class="mt-2.5 flex items-center gap-2 text-[0.6rem] tabular-nums text-[#b3b3b3]">
        <span class="flex h-2.5 w-3 shrink-0 items-end gap-[2px]" aria-label={isPlaying ? "Playing" : "Paused"}>
          {#each [0, 1, 2] as bar}
            <span
              class="eq-bar w-[3px] rounded-[1px] {isPlaying ? 'bg-[#1db954]' : 'h-[3px] bg-[#696969]'}"
              class:playing={isPlaying}
              style="animation-delay: {bar * -0.35}s"
            ></span>
          {/each}
        </span>
        <span class="w-7 shrink-0 text-right">{formatTime(progress)}</span>
        <div class="relative h-1 flex-1 rounded-full bg-[#444444]">
          <div
            class="absolute inset-y-0 left-0 rounded-full bg-[#1db954] transition-[width] duration-1000 ease-linear"
            style="width: {percent}%"
          ></div>
          <div
            class="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-[left] duration-1000 ease-linear"
            style="left: {percent}%"
          ></div>
        </div>
        <span class="w-7 shrink-0">{formatTime(duration)}</span>
      </div>
    {:else if !isCurrent}
      <div class="mt-2 flex items-center justify-between text-[0.6rem] text-[#b3b3b3]">
        <span>played {playedAt || "recently"}</span>
        <a href={currentTrack?.link} target="_blank" rel="noopener" class="underline hover:text-white">
          Open in Spotify
        </a>
      </div>
    {/if}
  </div>
</div>

<style>
  .eq-bar.playing {
    animation: eq 0.9s ease-in-out infinite;
  }

  @keyframes eq {
    0%,
    100% {
      height: 30%;
    }
    50% {
      height: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .eq-bar.playing {
      animation: none;
      height: 70%;
    }
  }
</style>
