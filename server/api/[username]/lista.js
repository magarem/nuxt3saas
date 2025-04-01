// server/api/[username]/lista.js
import Database from 'better-sqlite3';
import path from 'path';

export default defineEventHandler((event) => {
  const username = event.context.params.username;
  const dbPath = path.resolve(`./data/${username}.db`);

  try {
    const db = new Database(dbPath, { readonly: true });
    const contatos = db.prepare('SELECT * FROM contatos').all();
    db.close();
    return contatos;
  } catch (error) {
    console.error(`Erro ao acessar o banco de dados ${username}.db:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao acessar o banco de dados',
    });
  }
});