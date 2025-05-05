<script setup>
import { da } from "date-fns/locale";

// import AppConfigurator from './AppConfigurator.vue';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const route = useRoute();
const router = useRouter();
const unreadNotificationsCount = ref(0);
let websocket = null;

onMounted(() => {
  websocket = new WebSocket("ws://localhost:3001"); // Endereço do seu servidor WebSocket

  websocket.onopen = async () => {
    console.log("Conectado ao WebSocket.");
    //     const { data, error: fetchError } = await useFetch(
    //   `/api/${domain}/messages/totalUnreadMessages`,
    //   {
    //     method: "GET"
    //   }
    // );

    // console.log("Total de mensagens não lidas:", data.value);

    // unreadNotificationsCount.value = data.value;
  };

  websocket.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      console.log(data);
    
      if (data && data.type == "unreadCountUpdatedPlus" && data.receiverId == userId.value) {
        unreadNotificationsCount.value++;
      }

      if (
        data &&
        data.type == "unreadCountUpdated" &&
        data.unreadCount !== undefined
      ) {
        unreadNotificationsCount.value = data.unreadCount;
      }
    } catch (error) {
      console.error("Erro ao processar mensagem WebSocket:", error);
    }
  };

  websocket.onclose = () => {
    console.log("Desconectado do WebSocket.");
    // Lógica para reconectar se necessário
  };

  websocket.onerror = error => {
    console.error("Erro no WebSocket:", error);
  };
});

onUnmounted(() => {
  if (websocket) {
    websocket.close();
  }
});

const { data: ret } = await useFetch("/api/user");
const userId = ref(ret.value.user?.id);
const domain = ret.value.user?.domain;
if (!ret.value?.user) {
  // Redireciona para a página de login
  navigateTo("/" + domain + "/auth/login");
}
const menu = ref();
const items = ref([
  {
    label: ret.value.user?.username,
    items: [
      {
        label: "Profile",
        icon: "pi pi-user-edit",
        command: () => {
          profileEdit();
        }
      },
      {
        label: "Sair",
        icon: "pi pi-sign-out",
        command: () => {
          logout();
        }
      }
    ]
  }
]);

const onClick = () => {
  // alert(`/${domain}/${ret.value?.user.username}/messages`)
  router.push(`/${domain}/${ret.value?.user.username}/messages`);
};

// onMounted(() => {
//     items.value[0].label = ret.value.user.nome;
// });

const toggle = event => {
  menu.value.toggle(event);
};

const profileEdit = async () => {
  navigateTo(`/${domain}/${ret.value.user?.username}/profile`);
};

const logout = async () => {
  await $fetch("/api/" + domain + "/logout");
  useCookie("auth_token").value = null;
  navigateTo("/" + domain + "/auth/login");
};
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button
        class="layout-menu-button layout-topbar-action text-gray-400 hover:text-white opacity-70 hover:opacity-100 transition duration-200"
        @click="toggleMenu"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <img src="/assets/logo2.png" alt="SuryaNet" class="h-6 w-auto" />
      </router-link>
      <div></div>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <!-- <button
          type="button"
          class="layout-topbar-action"
          @click="toggleDarkMode"
        >
          <i
            :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"
          ></i>
        </button> -->

        <button
          v-if="unreadNotificationsCount > 0"
          class="notification-bell-icon"
          @click="onClick"
        >
          <i class="pi pi-bell"></i>

          <Badge
            size="small"
            @click="onClick"
            v-if="unreadNotificationsCount > 0"
            :value="unreadNotificationsCount"
            class="absolute top-3 right-20 p-0"
            severity="danger"
          />
        </button>
        <button type="button" class="layout-topbar-action" @click="toggle">
          <i class="pi pi-user"></i>
          <!-- <span>Messages</span> -->
        </button>

        <!-- <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div> -->
      </div>

      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      <!-- <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button> -->
    </div>
  </div>
</template>

<style scoped>
.badge {
  transform: translate(50%, -50%);
}

.notification-bell-icon .pi-bell {
  font-size: 1.5em; /* Ajuste o tamanho desejado aqui */
}
</style>
