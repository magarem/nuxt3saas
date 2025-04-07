<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';


function getUsernameFromHref(href) {
  const match = href.split('/')[1]
  if (match) {
    return match;
  }
  return null;
}


// function getUsernameFromPath(fullPath) {
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
const username = getUsernameFromHref(route.fullPath||'');
console.log('username>>>>:', username);
console.log('route.fullPath>>>>:', route.fullPath);
console.log('location.href:', location?.href);


const model = ref([
    {
        label: '',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'+username +'/dashboard' },
            { label: 'Usuários', icon: 'pi pi-fw pi-id-card', to: '/'+username + '/users' },
            { label: 'Permissões', icon: 'pi pi-fw pi-id-card', to: '/'+username + '/page_roles' },
            { label: 'Teste', icon: 'pi pi-fw pi-id-card', to: '/'+username + '/teste' }
            // { label: 'Lista', icon: 'pi pi-fw pi-id-card', to: '/'+username + '/lista' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
