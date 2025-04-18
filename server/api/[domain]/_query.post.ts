import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from 'h3';
import Database from 'better-sqlite3'; // ou sua biblioteca de banco de dados

export default defineEventHandler(async (event) => {
  const { username } = getRouterParams(event); // Obter o username do URL
  const { sql, params } = await readBody(event); // Obter sql e params do corpo da requisição
  const dbPath = `./server/data/${username}.db`; // Ajuste o caminho do seu banco

  let db;

  try {
    db = new Database(dbPath); // Abra a conexão com o banco

    const statement = db.prepare(sql);
    const result = statement.all(params); // Executar a consulta e obter os resultados
    // statement.finalize();

    return { success: true, data: result }; // Retornar os resultados como JSON

  } catch (err) {
    console.error(`Erro ao executar query em ${dbPath}:`, err);
    setResponseStatus(event, 500); // Definir o status de erro
    return { success: false, error: err.message };

  } finally {
    if (db) {
      db.close(); // Fechar a conexão
    }
  }
});