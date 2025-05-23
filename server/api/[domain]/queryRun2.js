// server/api/[domain]/queryRun.post.ts
import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from 'h3';
import { getDatabase } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const { domain } = getRouterParams(event);
  const { sql, params } = await readBody(event);
  // const dbPath = `./server/data/${domain}.db`; // Ajuste o caminho do seu banco
  
  console.log('domain, sql, params:', domain, sql, params);

  try {
    const db = getDatabase(domain);
    const statement = db.prepare(sql); // Prepare a consulta
    statement.run(params); // Execute a consulta (síncrono)
    // statement.finalize(); // Finalize o statement

    return { message: 'Comando executado com sucesso' }; // Adapte a resposta

  } catch (err) {
    console.error("Erro na rota /api/:domain/queryRun:", err);
    setResponseStatus(event, 500);
    return { error: err.message };
  } finally {
    if (db) {
      db.close(); // Feche a conexão
    }
  }
});