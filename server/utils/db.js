import Database from 'better-sqlite3';
import { join } from 'path';

export function getDatabase(domain) {
  console.log(`[getDatabase] domain: ${domain}`);
  
  const dbPath = join(process.cwd(), 'server/data', `${domain}.db`);
  return new Database(dbPath, { fileMustExist: true }); // ou false se quiser criar o banco
}
