// server/api/[username]/queryRun.post.ts
import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from 'h3';
import Database from 'better-sqlite3'; // Importe better-sqlite3

export default defineEventHandler(async (event) => {
  const { username } = getRouterParams(event);
  const { sql, params } = await readBody(event);
  const dbPath = `./server/data/${username}.db`; // Ajuste o caminho do seu banco
  let db;
  console.log('username, sql, params:', username, sql, params);

  try {
    db = new Database(dbPath); // Abra a conexão com better-sqlite3 (síncrono)

    const statement = db.prepare(sql); // Prepare a consulta
    statement.run(params); // Execute a consulta (síncrono)
    // statement.finalize(); // Finalize o statement

    return { message: 'Comando executado com sucesso' }; // Adapte a resposta

  } catch (err) {
    console.error("Erro na rota /api/:username/queryRun:", err);
    setResponseStatus(event, 500);
    return { error: err.message };
  } finally {
    if (db) {
      db.close(); // Feche a conexão
    }
  }
});