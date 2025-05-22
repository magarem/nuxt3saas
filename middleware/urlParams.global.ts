export default defineNuxtRouteMiddleware((to) => {
  const { $urlParams } = useNuxtApp();
  
  // Atualiza os parâmetros sempre que a rota muda
  $urlParams.current = $urlParams.extract();
});