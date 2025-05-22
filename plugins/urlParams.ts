export default defineNuxtPlugin((nuxtApp) => {
  type UrlParams = {
    domain: string;
    user: string | null;
    page: string | null;
    fullPath: string;
  };

  const extractUrlParams = (): UrlParams => {
    let path = '';
    
    // No cliente (browser)
    if (import.meta.client) {
      path = window.location.pathname;
    }
    // No servidor (SSR)
    else if (import.meta.server) {
      const req = nuxtApp.ssrContext?.event.node.req;
      path = req?.url || '';
    }

    // Remove query params e hash
    const cleanPath = path.split('?')[0].split('#')[0];
    const parts = cleanPath.split('/').filter(part => part.trim() !== '');

    return {
      domain: parts[0] || 'default',
      user: parts[1] || null,
      page: parts[2] || null,
      fullPath: cleanPath
    };
  };

  // Disponibiliza globalmente
  return {
    provide: {
      urlParams: {
        current: extractUrlParams(),
        extract: extractUrlParams
      }
    }
  };
});