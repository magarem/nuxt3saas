<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

function getDomainFromHref(href) {
  const match = href.split("/")[1];
  if (match) {
    return match;
  }
  return null;
}

function getUserFromHref(href) {
  const match = href.split("/")[2];
  if (match) {
    return match;
  }
  return null;
}


const route = useRoute();

const router = useRouter();
const currentPath = ref(router.currentRoute.value.path);


const domain = currentPath.value.split("/")[1];
const user = currentPath.value.split("/")[2];
const domain_ = capitalizeFirstLetter(domain);
console.log("domain>>>>:", domain);
console.log("route.fullPath>>>>:", route.fullPath);
console.log("location.href:", location?.href);

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
            label: "Categorias",
            icon: "pi pi-fw pi-id-card",
            to: `/${domain}/${user}/financial_category`
          },
          {
            label: "Lançamentos",
            icon: "pi pi-fw pi-id-card",
             items: [
                {
                  label: "Entrada",
                  icon: "pi pi-fw pi-id-card",
                  to: `/${domain}/${user}/financial_lancamentos?op=entrada`
                },
                {
                  label: "Saída",
                  icon: "pi pi-fw pi-id-card",
                  to: `/${domain}/${user}/financial_lancamentos?op=saída`
                }
              ]
          }
        ]
      }
    ]
  }
]);

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
