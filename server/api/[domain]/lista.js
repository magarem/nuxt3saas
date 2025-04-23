import { getDatabase } from '~/server/utils/db';

export default defineEventHandler((event) => {
  const domain = event.context.params.domain;
  
  try {
    const db = getDatabase(domain);
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