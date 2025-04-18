<template>
</template>
<script setup>
definePageMeta({
  layout: false
})
const router = useRouter();
const currentPath = router.currentRoute.value.path
console.log('currentPath>>>>:', currentPath + '/dashboard');

const response = await $fetch(`/api${currentPath}/user`);

console.log('response>>>>:', response);

if (response.statusCode == 401) {
  // Redireciona para a página de login
  router.push(currentPath +'/auth/login');
} else {
  // Redireciona para a página de dashboard
  router.push(currentPath + '/dashboard');
}

</script>