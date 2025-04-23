// server/api/[domain]/verify-email/[token].get.ts
import { defineEventHandler, getRouterParams, setResponseStatus, sendRedirect } from 'h3';
import Database from 'better-sqlite3';

export default defineEventHandler(async (event) => {
  const { domain, token } = getRouterParams(event);
 
  console.log('Verificando email com token:', token);
  console.log('Caminho do banco de dados:', dbPath);
  console.log('Domínio:', domain);
  
  try {
    const db = getDatabase(domain);

    // 1. Verificar se o token existe e não expirou
    const user = db.prepare(`
      SELECT id, nome, email, verificationToken, verificationTokenExpiry
      FROM users
      WHERE verificationToken = ? AND verificationTokenExpiry > ?
    `).get(token, Date.now());

    console.log('user:', user);
    if (!user) {
      db.close();
      setResponseStatus(event, 400); // Bad Request
      return { success: false, message: 'Token de verificação inválido ou expirado.' };
    }

    // 2. Atualizar o status do usuário
    // const statement = db.prepare('UPDATE users SET status = ?, verificationToken = NULL, verificationTokenExpiry = NULL WHERE id = ?');
    const statement = db.prepare('UPDATE users SET status = ? WHERE id = ?');
    statement.run('active', user.id);

    // 3. Redirecionar o usuário para a página de login
    db.close();
    // const loginUrl = `/${domain}/registerEmailConfirmSuccess`; // Adapte a URL da sua página de login
    // sendRedirect(event, loginUrl, 302); // Redirecionamento temporário

    // Nota: O sendRedirect não interrompe a execução do código de forma síncrona.
    // Se você tiver alguma lógica adicional após o sendRedirect, ela será executada.
    // No entanto, o navegador do cliente será redirecionado para a nova URL.
    return { success: true, message: 'ok!'}; // Importante para indicar que a rota terminou aqui

  } catch (error) {
    console.error('Erro ao verificar email:', error);
    if (db) {
      db.close();
    }
    setResponseStatus(event, 500); // Internal Server Error
    return { success: false, message: 'Erro ao verificar email.', error: error.message };
  }
});