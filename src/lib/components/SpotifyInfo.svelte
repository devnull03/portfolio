<script lang="ts">
  import type { CurrentTrackData } from "$lib/interfaces/spotify.interface";

  interface Props {
    currentTrack: CurrentTrackData | null;
  }

  let { currentTrack }: Props = $props();

  // Progress tracking
  let progress = $state(0); // Current position in seconds
  let duration = $state(0); // Total duration in seconds

  // Update progress every second when playing
  $effect(() => {
    if (
      currentTrack?.isPlaying &&
      currentTrack?.progress &&
      currentTrack?.duration
    ) {
      progress = Math.floor(currentTrack.progress / 1000);
      duration = Math.floor(currentTrack.duration / 1000);

      const interval = setInterval(() => {
        if (progress < duration) {
          progress += 1;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Use the localhost assets from Figma and local assets
  const vinyl =
    "http://localhost:3845/assets/5b7639aae5a66cb855fe431e9086c04d3858fd7b.png";
  import SpotifyLogo from "$lib/assets/Spotify_Primary_Logo_RGB_White.png";
  import { fade } from "svelte/transition";
</script>

<div
  class="bg-[#1e1e1e] rounded-lg h-[10vh] w-[30vh] fixed md:absolute bottom-6 left-6 z-[9999] font-['Ubuntu_Mono'] border-2 border-[#696969]"
  data-name="spotifyPlayer"
  transition:fade
>
  <div
    class="text-[0.6rem] absolute -top-[1.4rem] bg-[#1e1e1e] rounded-lg px-1.5"
  >
    Now Listening to
  </div>

  <div
    class="box-border flex gap-4 items-end overflow-hidden p-2 relative w-full h-full"
  >
    <div
      class=" h-full relative rounded-sm aspect-square flex items-center justify-center"
    >
      <!-- Vinyl disk background -->
      <div class="absolute inset-0 w-full h-full">
        <img
          alt="Vinyl disk background"
          class="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-[calc(100%+1rem)] rounded-full animate-spin -m-2"
          src={vinyl}
        />
      </div>

      <div
        class="absolute bg-[#444444] rounded-full w-[55%] aspect-square overflow-hidden"
      >
        {#if currentTrack?.image}
          <img
            alt="Album cover"
            class="absolute inset-0 max-w-none object-center object-cover pointer-events-none w-full h-full rounded-full"
            src={currentTrack.image}
          />
        {:else}
          <div
            class="absolute font-normal leading-normal left-1/2 text-[0.25rem] text-center text-nowrap text-white top-1/2 translate-x-[-50%] translate-y-[-50%] whitespace-pre"
          >
            <p class="mb-0">album art</p>
            <p class="mb-0">here</p>
          </div>
        {/if}
      </div>
    </div>

    <div
      class=" flex flex-col font-normal gap-0 h-full items-start leading-none overflow-hidden relative shrink-0 text-nowrap text-white *:*:text-ellipsis"
    >
      <div class="relative shrink-0">
        <p class="leading-tight text-nowrap whitespace-pre">
          {currentTrack?.name || "Song Name"}
        </p>
      </div>
      <div class="relative shrink-0 text-[0.6rem]">
        <p class="leading-tight text-nowrap whitespace-pre">
          by {currentTrack?.artists?.[0] || "artist"}
        </p>
      </div>

      <!-- Progress bar and time display -->
      <div class="w-[80%] flex flex-col gap-1 mt-auto">
        <div class="w-full bg-[#444444] rounded-full h-[2px] overflow-hidden">
          <div
            class="h-full bg-[#1db954] rounded-full transition-all duration-1000 ease-linear"
            style="width: {duration > 0 ? (progress / duration) * 100 : 0}%"
          ></div>
        </div>
        <div class="flex justify-between text-[0.5rem] text-[#b3b3b3]">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>

    <a
      href={currentTrack?.link}
      class="aspect-square size-5 shrink-0 absolute right-2"
    >
      <img alt="Spotify logo" class="size-5 aspect-square" src={SpotifyLogo} />
    </a>
  </div>
</div>
