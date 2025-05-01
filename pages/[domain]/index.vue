<template>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: false
})
const router = useRouter();
const currentPath = router.currentRoute.value.path
console.log('currentPath>>>>:', currentPath + '/dashboard');

const checkDomain = async (inputString: string): Promise<boolean> => {
  try {
    const res = await $fetch(`/api/check-domain/${inputString}`);
    return res.exists;
  } catch (err) {
    console.error("Erro ao verificar domínio:", err);
    return false; // Assume false on error
  }
}
const checkDomain_ = async () => {
  try {
    const res = await $fetch(`/api/check-domain/${domain}`);
    domainExists.value = res.exists;
    if (!domainExists.value) {
      // Redirect to the "domain-not-exists" page if the domain doesn't exist
      router.push(`/${domain}/domain-not-exists`);
    }
  } catch (err) {
    console.error("Erro ao verificar domínio:", err);
    error.value = "Erro ao verificar domínio.";
    domainExists.value = false; // Assume false on error
    router.push(`/${domain}/domain-not-exists`); // Redirect on error as well
  }
};
const response = await $fetch(`/api/user`);


console.log('response>>>>:', response);

if (response.statusCode == 401) {
  // Redireciona para a página de login
  router.push((currentPath +'/auth/login').replaceAll('//', '/'));
} else {
  // Redireciona para a página de dashboard
  router.push((`${currentPath}/${response.user.username}/dashboard`).replaceAll('//', '/'));
}

</script>