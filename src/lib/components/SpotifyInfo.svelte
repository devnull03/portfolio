<script lang="ts">
  import type { CurrentTrackData } from "$lib/interfaces/spotify.interface";

  interface Props {
    currentTrack: CurrentTrackData;
  }

  let { currentTrack }: Props = $props();
</script>

<div></div>
