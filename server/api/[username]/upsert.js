// server/api/upsert.js
import Database from 'better-sqlite3';
import path from 'path';



export default defineEventHandler(async (event) => {


  const body = await readBody(event);
  const { table, data, condition } = body;

  const username = event.context.params.username;
  const dbPath = path.resolve(`./data/${username}.db`);

  const db = new Database(dbPath); // Open in readonly mode for safety (consider changing this if you need write operations)
    

  if (!table || !data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Table and data are required',
    });
  }

  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  try {
    if (condition) {
      // Upsert: tente atualizar, senão insira
      const setClause = keys.map((key) => `${key} = ?`).join(', ');
      const updateStmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE ${condition}`);
      const updateResult = updateStmt.run([...values]);

      if (updateResult.changes === 0) {
        // Nenhuma linha foi atualizada, então insira
        const insertStmt = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
        const insertResult = insertStmt.run([...values]);
        return { message: 'Row inserted', result: insertResult };
      }

      return { message: 'Row updated', result: updateResult };
    } else {
      // Inserir diretamente (sem condição)
      const insertStmt = db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`);
      const insertResult = insertStmt.run([...values]);
      return { message: 'Row inserted', result: insertResult };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});