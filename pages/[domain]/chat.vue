<template>
  <div class="grid grid-cols-1 md:grid-cols-3 h-screen bg-gray-900 text-white">
    <div class="md:col-span-1 bg-gray-800 border-r border-gray-700 p-4">
      <h2 class="text-xl font-semibold mb-4">Contacts</h2>
      <InputText v-model="searchQuery" placeholder="Search contacts" class="mb-2 w-full bg-gray-700 border-gray-600 text-white" />
      <ul class="overflow-y-auto h-[calc(100vh - 150px)]">
        <li
          v-for="contact in filteredContacts"
          :key="contact.id"
          @click="selectContact(contact)"
          :class="[
            'p-3 rounded cursor-pointer',
            selectedContact?.id === contact.id ? 'bg-blue-900 text-blue-300 font-semibold' : 'hover:bg-gray-700',
          ]"
        >
          <div class="flex items-center">
            <Avatar :label="getInitials(contact.name)" class="mr-2" shape="circle" />
            <span>{{ contact.name }}</span>
          </div>
        </li>
        <li v-if="filteredContacts.length === 0" class="p-3 text-gray-500">No contacts found.</li>
      </ul>
    </div>

    <div class="md:col-span-2 flex flex-col h-full bg-gray-900">
      <div v-if="selectedContact" class="bg-gray-800 border-b border-gray-700 p-4 flex items-center">
        <Button icon="pi pi-arrow-left" class="mr-2 p-button-rounded p-button-text text-white hover:bg-gray-700" @click="selectedContact = null" />
        <Avatar :label="getInitials(selectedContact.name)" class="mr-2" shape="circle" />
        <h3 class="font-semibold">{{ selectedContact.name }}</h3>
      </div>
      <div v-else class="bg-gray-800 border-b border-gray-700 p-4">
        <h3 class="font-semibold text-gray-500">Select a contact to start messaging.</h3>
      </div>

      <div class="flex-grow overflow-y-auto p-4">
        <div v-if="selectedContact && messages[selectedContact.id]" v-for="message in messages[selectedContact.id]" :key="message.id" :class="[
          'mb-2 p-3 rounded-lg',
          message.sender === 'me' ? 'bg-blue-800 text-blue-200 self-end' : 'bg-gray-700 text-gray-300 self-start',
        ]">
          {{ message.text }}
          <div class="text-xs text-gray-500 mt-1">{{ formatDate(message.timestamp) }}</div>
        </div>
        <div v-else-if="selectedContact" class="text-gray-500 italic">No messages yet. Start a conversation!</div>
      </div>

      <div v-if="selectedContact" class="bg-gray-800 border-t border-gray-700 p-4">
        <div class="flex items-center">
          <Textarea v-model="newMessage" rows="1" autoResize class="flex-grow mr-2 bg-gray-700 border-gray-600 text-white" @keydown.enter.prevent="sendMessage" />
          <Button label="Send" @click="sendMessage" class="p-button-primary" :disabled="!newMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { format } from 'date-fns';

// Dummy Data (Replace with your actual data fetching)
const contacts = ref([
  { id: 1, name: 'Alice Smith' },
  { id: 2, name: 'Bob Johnson' },
  { id: 3, name: 'Charlie Brown' },
  // ... more contacts
]);

const messages = ref({
  1: [
    { id: 'm1', sender: 'them', text: 'Hello!', timestamp: new Date() },
    { id: 'm2', sender: 'me', text: 'Hi Alice, how are you?', timestamp: new Date() },
  ],
  2: [
    { id: 'm3', sender: 'them', text: 'Hey there!', timestamp: new Date() },
  ],
  // ... messages for other contacts
});

const selectedContact = ref(null);
const searchQuery = ref('');
const newMessage = ref('');

const filteredContacts = computed(() => {
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectContact = (contact) => {
  selectedContact.value = contact;
};

const sendMessage = () => {
  if (selectedContact.value && newMessage.value.trim() !== '') {
    const newMessageObject = {
      id: `m${Date.now()}`,
      sender: 'me',
      text: newMessage.value.trim(),
      timestamp: new Date(),
    };
    if (!messages.value[selectedContact.value.id]) {
      messages.value[selectedContact.value.id] = [];
    }
    messages.value[selectedContact.value.id].push(newMessageObject);
    newMessage.value = '';
    // In a real application, you would send this message to the server
  }
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const formatDate = (date) => {
  return format(date, 'HH:mm');
};
</script>

<style scoped>
/* Add any specific styling here if needed */
</style>