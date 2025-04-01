// plugins/sqlite.server.js
import Database from 'better-sqlite3';
import path from 'path';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      sqlite: {
        getContatos: (usuario) => {
          const dbPath = path.resolve(`./data/${usuario}.db`);
          try {
            const db = new Database(dbPath, { readonly: true });
            const contatos = db.prepare('SELECT * FROM contatos').all();
            db.close();
            return contatos;
          } catch (error) {
            console.error('Erro ao acessar o banco de dados:', error);
            return [];
          }
        },
      },
    },
  };
});