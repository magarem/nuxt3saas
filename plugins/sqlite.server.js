import { getDatabase } from '~/server/utils/db';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      sqlite: {
        getContatos: (domain) => {
         
          try {
            const db = getDatabase(domain);
            const contatos = db.prepare('SELECT * FROM contatos').all();
            db.close();
            return contatos;
          } catch (error) {
            console.error('Erro ao acessar o banco de dados:', error);
            return []; // Retorna um array vazio em caso de erro
          }
        },
      },
    },
  };
});