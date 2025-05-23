// server/api/query.js
import Database from 'better-sqlite3';
import { getDatabase } from '~/server/utils/db';

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

    // const domain = authHeader.split(" ")[1]; // extract domain from header
    const domain = event.context.params.domain;
    const db = getDatabase(domain);
    const result = db.prepare(sql).all();
    console.log('SQL query result:', result);
    
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