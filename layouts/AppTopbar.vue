<script setup>
// import AppConfigurator from './AppConfigurator.vue';
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
function getUsernameFromHref(href) {
  const match = href.split('/')[1]
  if (match) {
    return match;
  }
  return null;
}

const route = useRoute();
const username = getUsernameFromHref(route.fullPath||'');
console.log('username>>>>:', username);
const { data: ret } = await useFetch('/api/' + username + '/user');
console.log('ret>>>>:::', ret.value);
if (!ret.value?.user) {
    // Redireciona para a página de login
    navigateTo('/' + username + '/auth/login');
}
const menu = ref();
const items = ref([
    {
        label: ret.value.user?.username,
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-user-edit',
                command: () => {
                    profileEdit();
                }
            },
            {
                label: 'Sair',
                icon: 'pi pi-sign-out',
                command: () => {
                    logout();
                }
            }
        ]
    }
]);

// onMounted(() => {
//     items.value[0].label = ret.value.user.nome;
// });

const toggle = (event) => {
    menu.value.toggle(event);
};

const profileEdit = async () => {
  navigateTo('/' + username + '/profile')
}

const logout = async () => {
  await $fetch('/api/' + username + '/logout')
  useCookie('auth_token').value = null
  navigateTo('/' + username + '/auth/login')
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <span>Nuxt3 Saas</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
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
