// server/api/[username]/user/password.post.ts (ou .js)
import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from 'h3';
import { getDatabase } from '~/server/utils/db';
import bcrypt from 'bcrypt'; // Instale: npm install bcrypt

export default defineEventHandler(async (event) => {
  const { domain } = getRouterParams(event);
  const { userId, currentPassword, newPassword, confirmPassword } = await readBody(event);
  let db;

  console.log('userId, currentPassword, newPassword, confirmPassword :', userId, currentPassword, newPassword, confirmPassword );

  try {
    db = getDatabase(domain);

    if (!db) {
      setResponseStatus(event, 500);
      return { message: 'Erro ao conectar ao banco de dados.' };
    }

    // 1. Buscar a senha atual do usuário (HASHED)
    const stmtSelect = db.prepare('SELECT password FROM users WHERE id = ?');
    const storedHash = stmtSelect.get(userId)?.password;
   

    console.log('storedHash:', storedHash);

    if (!storedHash) {
      db.close();
      setResponseStatus(event, 404);
      return { message: 'Usuário não encontrado.' };
    }

    // 2. Verificar se a senha atual fornecida está correta
    // const passwordMatch = await bcrypt.compare(currentPassword, storedHash);
    const passwordMatch = currentPassword === storedHash;

    console.log('passwordMatch:', passwordMatch);

    if (!passwordMatch) {
      db.close();
      setResponseStatus(event, 401);
      return { message: 'Senha atual incorreta.' };
    }

    // 3. Verificar se a nova senha e a confirmação coincidem
    if (newPassword !== confirmPassword) {
      db.close();
      setResponseStatus(event, 400);
      return { message: 'As novas senhas não coincidem.' };
    }

    // 4. Hash a nova senha
    // const hashedNewPassword = await bcrypt.hash(newPassword, 10); // 10 é o salt rounds

    // 5. Atualizar a senha no banco de dados
    const stmtUpdate = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    stmtUpdate.run(newPassword, userId);

    db.close();
    console.log('Senha atualizada com sucesso.');
    return { message: 'Senha atualizada com sucesso.' };

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    setResponseStatus(event, 500);
    return { message: 'Erro ao alterar senha.', error: error.message };
  } finally {
    if (db) {
      db.close();
    }
  }
});