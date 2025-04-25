<template>
  <div>
    <h1>Bem-vindo, {{ ret.user?.username }}!</h1>
    {{domain}}
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
const route = useRoute();
const router = useRouter();
const domain = route.params.domain;
const { data: ret } = await useFetch("/api/user"); 

let domainExists = ref(false); // Assume true initially
const checkDomain = async () => {
  try {
    const res = await $fetch(`/api/check-domain/${domain}`);
    domainExists.value = res.exists;
    if (!domainExists.value) {
      // Redirect to the "domain-not-exists" page if the domain doesn't exist
      router.push(`/domain-not-exists`);
    }
  } catch (err) {
    console.error("Erro ao verificar domínio:", err);
    // error.value = "Erro ao verificar domínio.";
    // domainExists.value = false; // Assume false on error
    router.push(`/domain-not-exists`); // Redirect on error as well
  }
};

onMounted(async () => {
  // Check if the domain exists when the component mounts
  await checkDomain();
});
</script>
