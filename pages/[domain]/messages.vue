<template>
    <div class="grid grid-cols-8 gap-6">
      <div _class=" bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <Button label="Compose" icon="pi pi-plus" class="p-button-primary mb-4" @click="isComposing = true" />
        <h2 class="text-lg font-semibold mb-2"></h2>
        <ul class="mb-4">
          <li
            v-for="mailbox in mailboxes"
            :key="mailbox.name"
            @click="selectMailbox(mailbox.name)"
            :class="[
              'p-2 rounded cursor-pointer flex items-center',
              selectedMailbox === mailbox.name ? 'bg-blue-900 text-blue-300 font-semibold' : 'hover:bg-gray-700',
            ]"
          >
            <i :class="`pi ${mailbox.icon} mr-2`"></i>
            <span>{{ mailbox.name }}</span>
            <span v-if="mailbox.unread > 0" class="ml-auto bg-red-500 text-white rounded-full px-2 text-xs">{{ mailbox.unread }}</span>
          </li>
        </ul>
        <!-- <h3 class=" font-semibold mb-2">Marcadores</h3>
        <ul>
          <li
            v-for="label in labels"
            :key="label"
            class="p-2 rounded cursor-pointer hover:bg-gray-700 flex items-center"
          >
            <i class="pi pi-tag mr-2"></i>
            <span>{{ label }}</span>
          </li>
        </ul> -->
    </div>
  
      <div class="col-span-2" _class=" bg-gray-900 border-r border-gray-700 p-4 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ selectedMailbox || 'Inbox' }}</h2>
          <!-- <div class="flex items-center">
            <Button icon="pi pi-refresh" class="p-button-rounded p-button-text text-white hover:bg-gray-700 mr-2" />
            <Dropdown v-model="sortOption" :options="sortOptions" optionLabel="label" optionValue="value" placeholder="Sort by" class="w-full md:w-auto bg-gray-700 text-white border-gray-600" />
          </div> -->
        </div>
        <ul class="overflow-y-auto h-[calc(100vh - 180px)]">
          <li
            v-for="email in sortedEmails"
            :key="email.id"
            @click="selectEmail(email)"
            :class="[
              'p-3 rounded cursor-pointer border-b border-gray-700',
              selectedEmail?.id === email.id ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-800',
              !email.isRead ? 'font-semibold' : 'text-gray-400',
              'flex items-start space-x-2',
            ]"
          >
            <Avatar :label="getInitials(email.from)" class="mr-2" shape="circle" :class="!email.isRead ? 'border-2 border-blue-500' : ''" />
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <span class="block">{{ email.from }}</span>
                <span class="text-xs">{{ formatDate(email.date) }}</span>
              </div>
              <span class="block text-sm">{{ email.subject }}</span>
              <span class="block text-sm truncate">{{ email.body }}</span>
            </div>
          </li>
          <li v-if="filteredEmails.length === 0" class="p-3 text-gray-500">No emails in this mailbox.</li>
        </ul>
    </div>
  
      <div v-if="selectedEmail" class="col-span-5" _class=" bg-gray-900 border-l border-gray-700 p-4 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <Button icon="pi pi-arrow-left" class="p-button-rounded p-button-text text-white hover:bg-gray-700 mr-2" @click="selectedEmail = null" />
          <div>
            <Button icon="pi pi-reply" class="p-button-rounded p-button-text text-white hover:bg-gray-700 mr-2" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger hover:bg-red-700" />
          </div>
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ selectedEmail.subject }}</h3>
        <div class="text-gray-400 mb-2">
          From: <span class="text-white">{{ selectedEmail.from }}</span>
          <br>
          Date: {{ formatDateLong(selectedEmail.date) }}
        </div>
        <div class="prose prose-sm text-gray-300">
          <p>{{ selectedEmail.body }}</p>
          <!-- <hr class="border-gray-700 my-4"> -->
          <!-- <p>More email content could go here...</p> -->
        </div>
    </div>
      <!-- <aside v-else class="md:col-span-2 bg-gray-900 border-l border-gray-700 p-4 flex items-center justify-center text-gray-500 italic">
        Select an email to view its content.
      </aside> -->
  
      <Dialog v-model:visible="isComposing" header="Compose New Email" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
        
        <div class="mb-4">
          <label for="to" class="block text-gray-300 mb-1">De:</label>
          <InputText id="from" type="text" v-model="composeEmail.from" class="w-full bg-gray-700 text-white border-gray-600" />
        </div> 
        <div class="mb-4">
          <label for="to" class="block text-gray-300 mb-1">Para:</label>
          <InputText id="to" type="text" v-model="composeEmail.to" class="w-full bg-gray-700 text-white border-gray-600" />
        </div>
        <div class="mb-4">
          <label for="subject" class="block text-gray-300 mb-1">Assunto:</label>
          <InputText id="subject" type="text" v-model="composeEmail.subject" class="w-full bg-gray-700 text-white border-gray-600" />
        </div>
        <div class="mb-4">
          <label for="body" class="block text-gray-300 mb-1">Mensagem:</label>
          <Textarea id="body" rows="5" v-model="composeEmail.body" class="w-full bg-gray-700 text-white border-gray-600" />
        </div>
        <template #footer>
          <Button label="Cancel" class="p-button-secondary" @click="isComposing = false" />
          <Button label="Enviar" class="p-button-primary" @click="sendNewEmail" />
        </template>
      </Dialog>
    </div>
  </template>
  
  <script setup>

  import { format, formatDistanceToNow } from 'date-fns';
  
  const route = useRoute();
  const domain = route.params.domain;
  // Dummy Data (Replace with your actual data fetching)
  const mailboxes = ref([]);
  const labels = ref(['Important', 'Work', 'Personal']);
  const emails = ref([])
//   const emails = ref([
//     { id: 'e1', from: 'Alice Smith', subject: 'Project Update', body: 'Hi team, here\'s the latest update...', date: new Date(Date.now() - 86400000), isRead: false },
//     { id: 'e2', from: 'Bob Johnson', subject: 'Meeting Schedule', body: 'Please find the schedule for our next meeting...', date: new Date(Date.now() - 3600000), isRead: true },
//     { id: 'e3', from: 'Charlie Brown', subject: 'Quick Question', body: 'Just a quick question about the new feature...', date: new Date(), isRead: false },
//     // ... more emails
//   ]);
  
  const selectedMailbox = ref('Inbox');
  const selectedEmail = ref(null);
  const sortOption = ref('date-desc');
  const sortOptions = ref([
    { label: 'Date (Newest First)', value: 'date-desc' },
    { label: 'Date (Oldest First)', value: 'date-asc' },
    { label: 'From (A-Z)', value: 'from-asc' },
    { label: 'From (Z-A)', value: 'from-desc' },
    { label: 'Subject (A-Z)', value: 'subject-asc' },
    { label: 'Subject (Z-A)', value: 'subject-desc' },
  ]);


  var composeEmail = ref({
    from: '',
    to: '',
    subject: '',
    body: ''
  });

  const isComposing = ref(false);
  
  const filteredEmails = computed(() => {
    return emails.value.filter(email => {
      // In a real app, you'd filter based on the selectedMailbox
      return selectedMailbox.value === 'Inbox' || selectedMailbox.value === 'Sent' || selectedMailbox.value === 'Drafts'; // Basic example
    });
  });

  async function fetchMailboxes() {
    try {
      const response = await fetch(`/api/${domain}/messages/mailboxes`);
      const data = await response.json();
      if (Array.isArray(data)) {
        mailboxes.value = data;
      } else {
        console.error('Failed to fetch mailboxes:', data);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error('Error fetching mailboxes:', error);
      // Optionally display an error message to the user
    }
  }

  async function fetchEmails() {
    if (selectedMailbox.value) {
      try {
        const response = await fetch(`/api/${domain}/messages/${selectedMailbox.value}/emails`);
        const data = await response.json();
        console.log('Fetched emails:', data);
        if (Array.isArray(data)) {
          emails.value = data;
        } else {
          console.error('Failed to fetch emails:', data);
          emails.value = []; // Ensure emails are empty on failure
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
        emails.value = []; // Ensure emails are empty on error
      }
    } else {
      emails.value = []; // No mailbox selected, clear emails
    }
  }
  
  const sortedEmails = computed(() => {
    const emailsToSort = [...filteredEmails.value];
    switch (sortOption.value) {
      case 'date-desc':
        return emailsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-asc':
        return emailsToSort.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'from-asc':
        return emailsToSort.sort((a, b) => a.from.localeCompare(b.from));
      case 'from-desc':
        return emailsToSort.sort((a, b) => b.from.localeCompare(a.from));
      case 'subject-asc':
        return emailsToSort.sort((a, b) => a.subject.localeCompare(b.subject));
      case 'subject-desc':
        return emailsToSort.sort((a, b) => b.subject.localeCompare(a.subject));
      default:
        return emailsToSort;
    }
  });
  
  const selectMailbox = (mailboxName) => {
    selectedMailbox.value = mailboxName;
    selectedEmail.value = null; // Deselect email when switching mailboxes
  };
  
  const selectEmail = (email) => {
    selectedEmail.value = email;
    email.isRead = true; // Mark as read when selected (for UI purposes)
  };
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const formatDate = (date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const formatDateLong = (date) => {
    return format(date, 'MMMM d, yyyy h:mm a');
  };
  
//   const sendNewEmail = () => {
//     // In a real application, you would handle sending the email here
//     console.log('Sending new email...');
//     isComposing.value = false;
//   };


  const sendNewEmail = async () => {
    try {
      const response = await fetch(`/api/${domain}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(composeEmail.value),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Email sent and saved on the server. Message ID:', data.messageId);

        // Update the local UI (add to sent emails)
        const newEmail = {
          id: `e${Date.now()}`, // Temporary ID for UI
          from: composeEmail.value.from,
          to: composeEmail.value.to,
          subject: composeEmail.value.subject,
          body: composeEmail.value.body,
          sent_at: new Date(),
          isRead: true,
          mailbox_id: mailboxes.value.find(m => m.name === 'Sent')?.id, // Try to get the ID
        };
        emails.value.push(newEmail);

        const sentMailbox = mailboxes.value.find(mailbox => mailbox.name === 'Sent');
        if (sentMailbox && sentMailbox.unread > 0) {
          sentMailbox.unread--;
        }

        composeEmail.value = { from: '', to: '', subject: '', body: '' };
        isComposing.value = false;
      } else {
        console.error('Failed to send email:', data.error);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error sending email:', error);
      // Optionally show an error message to the user
    }
  };

  onMounted(async () => {
    await fetchMailboxes();
    await fetchEmails();
  });


  </script>
  
  <style scoped>
  .prose {
    max-width: none; /* Override default prose max-width */
  }
  </style>