<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Notice Board</h2>
    <div v-for="notice in notices" :key="notice.id" class="mb-4">
      <NoticeBoardItem :notice="notice" />
    </div>
  </div>
</template>

<script setup>
import NoticeBoardItem from './NoticeBoardItem.vue'
defineProps({ notices: Array })
</script>
