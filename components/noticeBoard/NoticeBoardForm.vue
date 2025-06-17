<template>
  <div class="p-4 rounded-xl shadow">
    <form @submit.prevent="submitNotice">
      <textarea v-model="content" class="w-full p-2 border rounded mb-4" placeholder="Write your notice here..." rows="4"></textarea>
      <textarea v-model="role_ids" class="w-full p-2 border rounded mb-4" placeholder="Roles list" rows="1"></textarea>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Post Notice
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const role_ids = ref('')
const emit = defineEmits(['notice-created'])

async function submitNotice() {
  if (!content.value.trim()) return

  await fetch('/api/notice-board', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: content.value, role_ids: role_ids.value.split(',').map(role => role.trim()) })
  })

  content.value = ''
  emit('notice-created')
}
</script>
