import type { Plugin } from '#app';

declare module '#app' {
  interface NuxtApp {
    $urlParams: {
      current: {
        domain: string;
        user: string | null;
        page: string | null;
        fullPath: string;
      };
      extract: () => {
        domain: string;
        user: string | null;
        page: string | null;
        fullPath: string;
      };
    };
  }
}

export {};