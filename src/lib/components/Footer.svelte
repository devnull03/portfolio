<script lang="ts">
  import { PUBLIC_COMPANY_NAME, PUBLIC_DOMAIN } from "$env/static/public";

  const menuItems: { label: string; route: string }[] = [];
</script>

<footer
  class="flex h-[70vh] flex-col items-center gap-8 bg-black px-[6%] pb-4 pt-16 text-white"
>

  <div class="w-full text-center font-[Cantarell] text-sm text-[#FFFFFF99]">
    <p>{PUBLIC_DOMAIN}</p>
    <p>
      Copyright © 2024 - 2028 {PUBLIC_COMPANY_NAME}. All rights reserved.
    </p>
  </div>
</footer>
