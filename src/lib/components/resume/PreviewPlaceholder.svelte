<script>
  let { title } = $props();
</script>

<div
  class="w-full h-full relative bg-gray-100 flex items-center justify-center"
>
  <div class="text-center">
    <div class="text-gray-400 mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <p class="text-xs text-gray-500 font-courierPrime px-2">
      {title}
    </p>
  </div>
</div>
