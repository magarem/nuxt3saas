<template>
  <div class="grid grid-cols-8 gap-6">
    <div
      class="col-span-3"
      _class=" bg-gray-900 border-r border-gray-700 p-4 flex flex-col"
    >
      <div class="flex justify-between items-center mb-4">
        <Button
          label="Novo"
          icon="pi pi-plus"
          class="p-button-primary mb-4 mr-4 p-3"
          @click="openModal"
        />
        <Dropdown
          id="to"
          v-model="selectedMailbox"
          @change="selectMailbox"
          :options="mailboxes"
          optionLabel="name"
          optionValue="name"
          placeholder="Selecione"
          class="bg-gray-700 text-white border-gray-600 mb-3 p-1"
        />
      </div>
      <ul class="overflow-y-auto h-[calc(100vh - 180px)]">
        <li
          v-for="email in sortedEmails"
          :key="email.id"
          @click="selectEmail(email)"
          :class="[
            'p-3 rounded cursor-pointer border-b border-gray-700',
            selectedEmail?.id === email.id
              ? 'bg-blue-900 text-blue-300'
              : 'hover:bg-gray-800',
            !email.isRead ? 'font-semibold' : 'text-gray-400',
            'flex items-start space-x-2'
          ]"
        >
          <Avatar
            :image="
              '/api/' + domain + '/' + email.senderName + '/uploads/avatar.png'
            "
            :label="getInitials(email.from)"
            class="mr-2"
            shape="circle"
            size="xlarge"
            :class="!email.isRead ? 'border-2 border-blue-500' : ''"
          />
          <div class="flex-grow">
            <div class="flex justify-between items-center">
              <span class="block">{{ email.senderName }}</span>
              <span class="text-xs">{{ formatDate(email.date) }}</span>
            </div>
            <span class="block text-sm">{{ email.subject }}</span>
            <span class="block text-sm truncate">{{ email.body }}</span>
          </div>
        </li>
        <li v-if="filteredEmails.length === 0" class="p-3 text-gray-500">
          <h5>Nenhuma mensagem aqui</h5>
        </li>
      </ul>
    </div>

    <div
      v-if="selectedEmail"
      class="col-span-5"
      _class=" bg-gray-900 border-l border-gray-700 p-4 flex flex-col"
    >
      <div class="flex justify-between items-center mb-4">
        <!-- <Button
          icon="pi pi-arrow-left"
          class="p-button-rounded p-button-text text-white hover:bg-gray-700 mr-2"
          @click="selectedEmail = null"
        /> -->
        <div>
          <Button
            icon="pi pi-arrow-left"
            class="p-button-rounded p-button-text text-white hover:bg-gray-700 mr-2"
            @click="handleReplyEmail"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-text p-button-danger hover:bg-red-700"
            @click="deleteSelectedEmail"
          />
        </div>
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ selectedEmail.subject }}</h3>
      <div class="text-gray-400 mb-2">
        <div class="mb-2">
          De: <span class="text-white">{{ selectedEmail.senderName }}</span>
        </div>
        <div>
          Data: <i>{{ formatDateLong(selectedEmail.date) }}</i>
        </div>
      </div>
      <div class="prose prose-sm text-gray-300">
        <p>{{ selectedEmail.body }}</p>
        <!-- <hr class="border-gray-700 my-4"> -->
        <!-- <p>More email content could go here...</p> -->
        <Button
          icon="pi pi-arrow-left"
          label="Responder"
          class=" p-button-text text-white hover:bg-gray-700 mr-2"
          @click="handleReplyEmail"
        />
      </div>
    </div>
    <!-- <aside v-else class="md:col-span-2 bg-gray-900 border-l border-gray-700 p-4 flex items-center justify-center text-gray-500 italic">
        Select an email to view its content.
      </aside> -->

    <Dialog
    @show="handleShow"
      v-model:visible="isComposing"
      header="Nova mensagem"
      :style="{ width: '50vw' }"
      :breakpoints="{ '960px': '85vw', '640px': '95vw' }"
    >
      <InputText
        id="from"
        type="hidden"
        v-model="currentUser.id"
        class="w-full bg-gray-700 text-white border-gray-600"
      />

      <div class="flex mb-4 gap-4">
        <div class="flex-grow">
          <label for="to" class="block text-gray-300 mb-1">Para:</label>
          <Dropdown
            id="to"
            v-model="selectedRecipient"
            :options="usersList"
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione um destinatário"
            class="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
        <div class="flex-grow">
          <label for="subject" class="block text-gray-300 mb-1">Assunto:</label>
          <InputText
            id="subject"
            type="text"
            v-model="composeEmail.subject"
            class="w-full bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="body" class="block text-gray-300 mb-1">Mensagem:</label>
        <Textarea
        autofocus
          id="body"
          rows="10"
          v-model="composeEmail.body"
          class="w-full bg-gray-700 text-white border-gray-600"
          ref="bodyTextarea"
        />
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          class="p-button-secondary"
          @click="isComposing = false"
        />
        <Button
          label="Enviar"
          class="p-button-primary"
          @click="handleSendNewEmail"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
const toast = useToast();
const route = useRoute();
const domain = route.params.domain;
const bodyTextarea = ref(null);
// Dummy Data (Replace with your actual data fetching)
const mailboxes = ref([
  { icon: "", name: "inbox" },
  { icon: "", name: "sent" },
  { icon: "", name: "drafts" },
  { icon: "", name: "deleted" }
]);
const labels = ref(["Important", "Work", "Personal"]);
const emails = ref([]);

const currentUser = ref(null);
const error = ref(null);

const selectedMailbox = ref("inbox");
const selectedEmail = ref(null);
const sortOption = ref("date-desc");
const sortOptions = ref([
  { label: "Date (Newest First)", value: "date-desc" },
  { label: "Date (Oldest First)", value: "date-asc" },
  { label: "From (A-Z)", value: "from-asc" },
  { label: "From (Z-A)", value: "from-desc" },
  { label: "Subject (A-Z)", value: "subject-asc" },
  { label: "Subject (Z-A)", value: "subject-desc" }
]);

var composeEmail = ref({
  from: "",
  to: "",
  subject: "",
  body: ""
});

const isComposing = ref(false);
const usersList = ref([]);
const selectedRecipient = ref(null);

function handleShow() {
  nextTick(() => {
    bodyTextarea.value?.focus()
    bodyTextarea.value.setSelectionRange(0, 0);
  })
}

watch(isComposing, async (val) => {
  if (val) {
    nextTick(() => {
        bodyTextarea.value?.focus()
    });
  }
})

const filteredEmails = computed(() => {
  return emails.value.filter(email => {
    // In a real app, you'd filter based on the selectedMailbox
    return (
      selectedMailbox.value === "inbox" ||
      selectedMailbox.value === "sent" ||
      selectedMailbox.value === "drafts" ||
      selectedMailbox.value === "deleted"
    ); // Basic example
  });
});

async function handleReplyEmail() {
  selectedRecipient.value = selectedEmail.value.senderId;
  // composeEmail.value.to = selectedEmail.value.from;
  composeEmail.value.subject = `Re: ${selectedEmail.value.subject}`;
//   composeEmail.value.body = `\n
//   Em ${formatDateLong(selectedEmail.value.date)}, ${selectedEmail.value.senderName} escreveu:\n
//     ${selectedEmail.value.body}`;

  isComposing.value = true;
  setTimeout(() => bodyTextarea.value.setSelectionRange(0, 0))
//   nextTick(() => {
//     // bodyTextarea.value?.focus()
//     bodyTextarea.value.setSelectionRange(0, 0);
//   })
}

async function fetchUsers() {
  try {
    const response = await fetch(`/api/${domain}/users`); // Create this API endpoint
    const data = await response.json();
    if (Array.isArray(data)) {
      usersList.value = data;
    } else {
      console.error("Failed to fetch users:", data);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function fetchUser() {
  try {
    const response = await fetch("/api/user");
    const data = await response.json();
    currentUser.value = data.user;
    error.value = data.error || null;
  } catch (err) {
    console.error("Error fetching user data:", err);
    error.value = "Failed to fetch user data.";
  }
}

async function fetchEmails() {
  if (selectedMailbox.value) {
    try {
      let apiUrl = `/api/${domain}/messages/${selectedMailbox.value}/messages?userId=${currentUser.value.id}`;

      // Add a query parameter to explicitly request non-deleted emails
      if (selectedMailbox.value !== "deleted") {
        apiUrl += "&excludeDeleted=true"; // Or a similar parameter
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Fetched emails:", data);
      if (Array.isArray(data)) {
        emails.value = data;
      } else {
        console.error("Failed to fetch emails:", data);
        emails.value = [];
      }
    } catch (error) {
      console.error("Error fetching emails:", error);
      emails.value = [];
    }
  } else {
    emails.value = [];
  }
}

const sortedEmails = computed(() => {
  const emailsToSort = [...filteredEmails.value];
  switch (sortOption.value) {
    case "date-desc":
      return emailsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
    case "date-asc":
      return emailsToSort.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "from-asc":
      return emailsToSort.sort((a, b) => a.from.localeCompare(b.from));
    case "from-desc":
      return emailsToSort.sort((a, b) => b.from.localeCompare(a.from));
    case "subject-asc":
      return emailsToSort.sort((a, b) => a.subject.localeCompare(b.subject));
    case "subject-desc":
      return emailsToSort.sort((a, b) => b.subject.localeCompare(a.subject));
    default:
      return emailsToSort;
  }
});

const selectMailbox = mailboxName => {
  //   selectedMailbox.value = mailboxName;
  selectedEmail.value = null; // Deselect email when switching mailboxes
  fetchEmails();
};

const selectEmail = email => {
  selectedEmail.value = email;
  email.isRead = true; // Mark as read when selected (for UI purposes)
};

const getInitials = name => {
  return name; //.split(' ').map(n => n[0]).join('').toUpperCase();
};

const formatDate = date => {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
};

const formatDateLong = date => {
  return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

//   const sendNewEmail = () => {
//     // In a real application, you would handle sending the email here
//     console.log('Sending new email...');
//     isComposing.value = false;
//   };

async function deleteSelectedEmail() {
  if (selectedEmail.value) {
    try {
      const sendVar = { userId: currentUser.value.id, mailbox: "deleted" };

      console.log("sendVar:", sendVar);
      const response = await fetch(
        `/api/${domain}/messages/delete/${selectedEmail.value.id}`,
        {
          method: "POST", // Or PUT, depending on your API design
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(sendVar) // Indicate the new mailbox
        }
      );

      if (response.ok) {
        console.log(`Email ${selectedEmail.value.id} moved to deleted.`);
        // Update the local emails array
        emails.value = emails.value.map(email => {
          if (email.id === selectedEmail.value.id) {
            return {
              ...email,
              mailbox: "deleted",
              isDeleted: true,
              deletedAt: new Date()
            };
          }
          return email;
        });
        selectedEmail.value = null; // Clear the selected email after deletion
        // Optionally, if the 'deleted' mailbox is currently viewed, you might want to refetch
        if (selectedMailbox.value !== "deleted") {
          // If not in the deleted box, you might want to remove it from the current view
          //   emails.value = emails.value.filter(
          //     email => email.id !== selectedEmail.value.id
          //   );
          await fetchEmails();
        } else {
          // If in the deleted box, the list should already reflect the change
          await fetchEmails(); // Or update the pagination/list if needed
        }
        toast.add({
          severity: "success",
          summary: "Mensagem excluída",
          detail: "Mensagem movida para itens excluídos",
          life: 3000
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to move email to deleted:", errorData);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error moving email to deleted:", error);
      // Optionally show an error message to the user
    }
  }
}

const handleSendNewEmail = async () => {
  // if (!composeEmail.value.to || !composeEmail.value.subject || !composeEmail.value.body) {
  //   // Handle validation errors on the frontend
  //   return;
  // }

  const messageData = {
    senderId: currentUser.value.id,
    receiverId: selectedRecipient.value, // Assuming this is the receiver's ID
    subject: composeEmail.value.subject,
    body: composeEmail.value.body
  };

  console.log("messageData:", messageData);

  try {
    const response = await fetch(`/api/${domain}/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageData)
    });

    const data = await response.json();
    console.log("response:", response);
    console.log("data:", data);

    if (response.ok && data.success) {
      console.log("Message sent and saved with ID:", data.messageId);
      // Optionally update your local UI (e.g., clear compose form, navigate to sent messages)
      composeEmail.value = { from: "", to: "", subject: "", body: "" };
      isComposing.value = false;

      toast.add({
        severity: "success",
        summary: "Mensagem enviado",
        detail: "Mensagem enviada com sucesso",
        life: 3000
      });

      // You might want to trigger a refetch of the 'Sent' mailbox messages
    } else {
      console.error("Failed to send message:", data);
      // Optionally display an error message to the user
    }
  } catch (error) {
    console.error("Error sending message:", error);
    // Optionally display an error message to the user
  }
};

function openModal() {
  isComposing.value = true
  composeEmail.value.subject = "" 
  composeEmail.value.body = "" 
  nextTick(() => {
    bodyTextarea.value?.focus()
    // bodyTextarea.value?.$el?.querySelector("textarea")?.focus()
  })
}

// // Watch when dialog opens
// watch(isComposing, newVal => {
//   if (newVal) {
//     setTimeout(() => {
//     //   bodyTextarea.value?.$el?.querySelector("textarea")?.focus();
//     bodyTextarea.value.focus()
//     }, 100); // small delay to wait for dialog animation
//   }
// });

onMounted(async () => {
  await fetchUsers();
  await fetchUser();
  await fetchEmails();
});
</script>

<style scoped>
.prose {
  max-width: none; /* Override default prose max-width */
}
</style>
