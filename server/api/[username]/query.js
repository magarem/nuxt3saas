// server/api/query.js
import Database from 'better-sqlite3';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sql = body.sql;

  if (!sql) {
    throw createError({
      statusCode: 400,
      statusMessage: 'SQL query is required',
    });
  }

  try {
    // Assuming your database file is in the same directory as the API endpoint
    // and named after the authorization header:
    // const authHeader = event.node.req.headers.authorization;
    // if (!authHeader) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: "Authorization header is required",
    //     });
    // }

    // const username = authHeader.split(" ")[1]; // extract username from header
    const username = event.context.params.username;
    const dbPath = path.resolve(`./data/${username}.db`);

    const db = new Database(dbPath, { readonly: true }); // Open in readonly mode for safety (consider changing this if you need write operations)
    const result = db.prepare(sql).all();
    db.close();

    return result;

  } catch (error) {
    console.error('Error executing SQL query:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to execute SQL query',
      stack: error.stack, // Add stack trace for debugging purposes
    });
  }
});