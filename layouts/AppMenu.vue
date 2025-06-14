<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

const { data: ret } = await useFetch("/api/user")

const route = useRoute();

const router = useRouter();
const currentPath = ref(router.currentRoute.value.path);


const domain = currentPath.value.split("/")[1];
const user = currentPath.value.split("/")[2];
const domain_ = capitalizeFirstLetter(domain);
console.log("domain>>>>:", domain);
console.log("route.fullPath>>>>:", route.fullPath);
console.log("location.href:", location?.href);


const { data: tokenUser, error } = await useFetch('/api/showuser');

console.log("tokenUser>>>>:", tokenUser.value);
if (error.value) {
  console.error('Erro ao buscar usuário:', error.value);
}


const model = ref([
  {
    label: '',
    items: [
      {
        label: domain_,
        icon: "pi pi-fw pi-home",
        to: `/${domain}/${user}/dashboard`
      },
      {
        label: "Contatos",
        icon: "pi pi-fw pi-id-card",
        to: `/${domain}/${user}/contacts`
      },
      {
        label: "Teste",
        icon: "pi pi-fw pi-id-card",
        to: `/${domain}/${user}/teste`
      },
      {
        label: "Caixa postal",
        icon: "pi pi-envelope",
        to: `/${domain}/${user}/messages`
      },
      {
        label: "Controle de acesso",
        icon: "pi pi-fw pi-briefcase",
        items: [
          {
            label: "Usuários",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/users`
          },
          {
            label: "Categoria do usuário",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/roles`
          },
          {
            label: "Páginas",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/pages`
          }
          // { label: 'Lista', icon: 'pi pi-fw pi-id-card', to: '/'+domain + '/lista' }
        ]
      } ,
      {
        label: "Financeiro",
        icon: "pi pi-fw pi-id-card",
        items: [
          {
            label: "Métodos de pagamento",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/financial_payment_method`
          },
          {
            label: "Relatórios",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/reports`
          },
           {
            label: "Categorias",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/financial_category`
          },
          {
            label: "Lançamentos",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/financial_lancamentos`
          }
          // {
          //   label: "Lançamentos",
          //   icon: "pi pi-fw pi-id-card",
          //    items: [
          //       {
          //         label: "Entrada",
          //         icon: "pi pi-fw pi-id-card",
          //         to: `/${domain}/${user}/financial_lancamentos?op=entrada`
          //       },
          //       {
          //         label: "Saída",
          //         icon: "pi pi-fw pi-id-card",
          //         to: `/${domain}/${user}/financial_lancamentos?op=saída`
          //       }
          //     ]
          // }
        ]
      }
    ]
  }
]);


function filterMenuByAllowedPages(menu, allowedPages, domain, user) {
    const filteredMenu = [];

    for (const menuItem of menu) {
        // If it has sub-items, process them
        if (menuItem.items && Array.isArray(menuItem.items)) {
            const filteredItems = menuItem.items
                .map(item => {
                    if (item.items && Array.isArray(item.items)) {
                        // Recursively filter submenus
                        const subItems = filterMenuByAllowedPages([item], allowedPages, domain, user);
                        return subItems.length > 0 ? subItems[0] : null; // Keep only if submenu has allowed items
                    } else {
                        // Extract the page name from the path
                        const parts = item.to.split('/');
                        const pageName = parts[3]; // Assuming /{domain}/{user}/{page}

                        // Keep the item only if the user has access to this page
                        return allowedPages.includes(pageName) ? item : null;
                    }
                })
                .filter(item => item !== null); // Remove null (disallowed) items

            // Only keep this group if it has at least one allowed item
            if (filteredItems.length > 0) {
                filteredMenu.push({
                    ...menuItem,
                    items: filteredItems
                });
            }
        }
    }

    return filteredMenu;
}

console.log("model.value before filtering:", model.value);
console.log("tokenUser.value.user.allowedPages:", tokenUser.value?.user?.allowedPages);
console.log("domain:", tokenUser.value.user.domain);
// console.log("user:", user);
model.value = filterMenuByAllowedPages(model.value, tokenUser.value.user.allowedPages, tokenUser.value.user.domain, tokenUser.value.user.username);


watch(() => router.currentRoute.value.path, (newPath) => {
  currentPath.value = newPath;
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <!-- <div class="mt-3 text-sm font-bold text-xl ml-3 text-surface-900 dark:text-surface-0">
        {{ domain }}
      </div> -->
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
