<script lang="ts">
  import { PUBLIC_COMPANY_NAME, PUBLIC_DOMAIN } from "$env/static/public";

  const menuItems: { label: string; route: string }[] = [];
</script>

<footer
  class="flex h-[70vh] flex-col items-center gap-8 bg-black px-[6%] pb-4 pt-16 text-white"
>
  <div
    class="flex w-full flex-row justify-between text-[#FFFFFF99] *:*:underline *:*:transition-all *:*:duration-300 *:*:ease-in-out hover:*:*:text-white"
  >
    <div class=""></div>
    <div class="flex gap-2 lg:gap-8">
      <a href="">Instagram</a>
      <a href="">TikTok</a>
    </div>
  </div>

  <div class="foot-logo aspect-square h-[40vh] overflow-hidden">
    <!-- <Logo /> -->
  </div>

  <div
    class="flex w-full flex-wrap justify-evenly gap-4 *:transition-all *:duration-300 *:ease-in-out lg:justify-around"
  >
    {#each menuItems as item, i}
      <a
        href={item.route}
        class="whitespace-normal break-keep font-[Cantarell] text-sm font-bold text-white hover:text-[#FFFFFF99] lg:text-lg"
      >
        {item.label}
      </a>
    {/each}
  </div>

  <div class="w-full text-center font-[Cantarell] text-sm text-[#FFFFFF99]">
    <p>{PUBLIC_DOMAIN}</p>
    <p>
      Copyright © 2024 - 2028 {PUBLIC_COMPANY_NAME}. All rights reserved.
    </p>
  </div>
</footer>
