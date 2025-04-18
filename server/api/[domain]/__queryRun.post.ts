import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from 'h3';
import Database from 'better-sqlite3'; // ou sua biblioteca

export default defineEventHandler(async (event) => {
  const { username } = getRouterParams(event);
  const { sql, params } = await readBody(event);
  const dbPath = `./server/data/${username}.db`;
  let db;

  try {
    db = new Database(dbPath);

    const statement = db.prepare(sql);
    const result = statement.run(params);
    // await statement.finalize(); // REMOVA ESTA LINHA

    return { success: true, data: result };

  } catch (err) {
    console.error('Erro ao executar query:', err);
    setResponseStatus(event, 500);
    return { success: false, error: err.message };

  } finally {
    if (db) {
      db.close();
    }
  }
});