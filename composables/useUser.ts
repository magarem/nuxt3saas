import type { AsyncData } from "nuxt/app";

export const useUser = () => {
  /**
   * Busca dados do usuário
   * @param userId Opcional - ID do usuário específico
   */
  const getUser = async (userId?: string): Promise<AsyncData<User, Error>> => {
    const url = userId ? `/api/user/${userId}` : '/api/user';
    
    const { data, error, refresh } = await useFetch(url, {
      method: 'GET',
      headers: useRequestHeaders(['cookie']),
      // Opções adicionais:
      // server: false, // Para executar apenas no client
      // lazy: true,   // Para carregamento lazy
    });

    return { data, error, refresh };
  };

  return {
    getUser
  };
};