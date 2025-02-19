<template>
  <div class="flex justify-center py-10 bg-gray-100 space-x-3">
    <button
      class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
      :disabled="isFirstPage"
      @click="$router.push({ query: { page: page - 1 } })"
    >
      <ArrowLeftIcon />
      <span>Anteriores</span>
    </button>

    <button
      class="flex items-center space-x-1.5 rounded-lg px-4 py-1.5 text-white bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
      :disabled="hasMoreData"
      @click="$router.push({ query: { page: page + 1 } })"
    >
      <span>Siguientes</span>
      <ArrowRightIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    page: number;
    isFirstPage: boolean;
    hasMoreData: boolean;
  }

  defineProps<Props>();

  import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
  import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';
</script>
