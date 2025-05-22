export default defineNuxtPlugin((nuxtApp) => {
  // Função para extrair o domínio da URL
  const extractDomain = () => {
    // No cliente (browser)
    if (import.meta.client) {
      const path = window.location.pathname;
      const parts = path.split('/').filter(part => part.trim() !== '');
      return parts[0] || 'default'; // Retorna 'default' se não houver domínio
    }
    
    // No servidor (SSR)
    if (import.meta.server) {
      const req = nuxtApp.ssrContext?.event.node.req;
      const host = req?.headers.host || '';
      const path = req?.url || '';
      
      // Extrai o primeiro segmento do path
      const domainFromPath = path.split('/')[1];
      return domainFromPath || 'default';
    }
    
    return 'default';
  };

  // Disponibiliza o domínio globalmente
  return {
    provide: {
      domain: {
        current: extractDomain(),
        extract: extractDomain
      }
    }
  };
});