<template>
  <div class="p-4 rounded-xl shadow">
    <p class="mb-2">{{ notice.content }}</p>
    <small class="text-gray-500">{{ formatDate(notice.created_at) }}</small>
  </div>
</template>

<script setup>
defineProps({ notice: Object })

function formatDate(date) {
  return new Date(date).toLocaleString()
}
</script>
