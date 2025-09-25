<script lang="ts">
  import type { CurrentTrackData } from "$lib/interfaces/spotify.interface";

  interface Props {
    currentTrack: CurrentTrackData | null;
  }

  let { currentTrack }: Props = $props();

  // Use the localhost assets from Figma and local assets
  const vinyl =
    "http://localhost:3845/assets/5b7639aae5a66cb855fe431e9086c04d3858fd7b.png";
  import SpotifyLogo from "$lib/assets/Spotify_Primary_Logo_RGB_White.png";
  import { fade } from "svelte/transition";
</script>

<div
  class="bg-[#1e1e1e] rounded-lg h-[10vh] w-[30vh] fixed md:absolute bottom-6 left-6 z-[9999] font-['Ubuntu_Mono'] border-2 border-[#4e4e4e]"
  data-name="spotifyPlayer"
  transition:fade
>
  <div class="text-[0.6rem] absolute -top-[1.4rem] bg-[#1e1e1e] rounded-lg px-1.5">Now Listening to</div>

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
          class="absolute inset-0 max-w-none object-center object-cover opacity-60 pointer-events-none w-full h-full rounded-sm animate-spin"
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
      class=" flex flex-col font-normal gap-[2%] h-full items-start leading-none overflow-hidden relative shrink-0 text-nowrap text-white *:*:text-ellipsis"
    >
      <div class="relative shrink-0">
        <p class="leading-normal text-nowrap whitespace-pre">
          {currentTrack?.name || "Song Name"}
        </p>
      </div>
      <div class="relative shrink-0 text-[0.6rem]">
        <p class="leading-normal text-nowrap whitespace-pre">
          by {currentTrack?.artists?.[0] || "artist"}
        </p>
      </div>
    </div>

    <a href={currentTrack?.link} class="aspect-square size-5 shrink-0 absolute right-2">
      <img alt="Spotify logo" class="size-5 aspect-square" src={SpotifyLogo} />
    </a>

  </div>
</div>
