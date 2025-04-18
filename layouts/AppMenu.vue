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

// function getdomainFromPath(fullPath) {
//   const atIndex = fullPath.indexOf('/@');
//   if (atIndex === -1) {
//     return null; // ou '', dependendo do que você quer retornar se não encontrar
//   }

//   const start = atIndex + 2; // Início do nome do usuário (após '/@')
//   const end = fullPath.indexOf('/', start);
//   if (end === -1) {
//     return fullPath.substring(start); // Se não houver mais '/', pegue até o final
//   }

//   return fullPath.substring(start, end);
// }

//

const route = useRoute();
const domain = getdomainFromHref(route.fullPath || "");
console.log("domain>>>>:", domain);
console.log("route.fullPath>>>>:", route.fullPath);
console.log("location.href:", location?.href);

const model = ref([
  {
    label: "",
    items: [
      {
        label: "Dashboard",
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
