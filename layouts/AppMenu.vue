<script setup>
import { ref } from "vue";

import AppMenuItem from "./AppMenuItem.vue";

function getdomainFromHref(href) {
  const match = href.split("/")[1];
  if (match) {
    return match;
  }
  return null;
}


const route = useRoute();
const domain = getdomainFromHref(route.fullPath || "");
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
        to: "/" + domain + "/dashboard"
      },
      {
        label: "Teste",
        icon: "pi pi-fw pi-id-card",
        to: "/" + domain + "/teste"
      },
      {
        label: "Auth",
        icon: "pi pi-fw pi-briefcase",
        items: [
          {
            label: "Usuários",
            icon: "pi pi-fw pi-id-card",
            to: "/" + domain + "/users"
          },
          {
            label: "Categoria do usuário",
            icon: "pi pi-fw pi-id-card",
            to: "/" + domain + "/roles"
          },
          {
            label: "Páginas",
            icon: "pi pi-fw pi-id-card",
            to: "/" + domain + "/pages"
          }
          // { label: 'Lista', icon: 'pi pi-fw pi-id-card', to: '/'+domain + '/lista' }
        ]
      }
    ]
  }
]);
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
