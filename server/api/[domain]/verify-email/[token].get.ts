// server/api/[domain]/verify-email/[token].get.ts
import { defineEventHandler, getRouterParams, setResponseStatus, sendRedirect } from 'h3';
import { getDatabase } from '~/server/utils/db'; // Import your database utility

export default defineEventHandler(async (event) => {
  const { domain, token } = getRouterParams(event);
  let db;

  console.log('Verificando email com token:', token);
  console.log('Domínio:', domain);

  try {
    db = getDatabase(domain);

    if (!db) {
      setResponseStatus(event, 500);
      return { success: false, message: 'Erro ao conectar ao banco de dados.' };
    }

    // 1. Verificar se o token existe e não expirou
    const stmtSelect = db.prepare(`
      SELECT id, nome, email, verificationToken, verificationTokenExpiry
      FROM users
      WHERE verificationToken = ? AND verificationTokenExpiry > ?
    `);
    const user = stmtSelect.get(token, Date.now());

    console.log('user:', user);
    if (!user) {
      db.close();
      setResponseStatus(event, 400); // Bad Request
      return { success: false, message: 'Token de verificação inválido ou expirado.' };
    }

    // 2. Atualizar o status do usuário
    const stmtUpdate = db.prepare('UPDATE users SET status = ? WHERE id = ?');
    const result = stmtUpdate.run('active', user.id);

    if (result.changes === 0) {
      db.close();
      console.warn('Nenhum usuário atualizado com o ID:', user.id);
      return { success: true, message: 'Conta já estava ativa ou erro ao atualizar.' };
    }

    // 3. Redirecionar o usuário para a página de login
    db.close();
    const loginUrl = `/${domain}/auth/login`; // Adapte a URL da sua página de login
    // sendRedirect(event, loginUrl, 302); // Redirecionamento temporário

    // O sendRedirect envia a resposta e interrompe a execução.
    // Não é necessário um retorno adicional aqui, mas para consistência, podemos incluir.
    return { success: true, message: 'Email verificado com sucesso. Redirecionando para login.' };

  } catch (error) {
    console.error('Erro ao verificar email:', error);
    if (db) {
      db.close();
    }
    setResponseStatus(event, 500); // Internal Server Error
    return { success: false, message: 'Erro ao verificar email.', error: error.message };
  }
});