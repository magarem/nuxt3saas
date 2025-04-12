// plugins/sqlite.server.js
import Database from 'better-sqlite3';
import path from 'path'; // Importe o módulo 'path'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      sqlite: {
        getContatos: (usuario) => {
          const dbPath = path.resolve(`./server/data/${usuario}.db`); // Constrói o caminho dinamicamente
          try {
            const db = new Database(dbPath, { readonly: true });
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