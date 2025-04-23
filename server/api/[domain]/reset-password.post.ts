// server/api/[domain]/verify-email/[token].get.ts
import { defineEventHandler, readBody, getRouterParams, setResponseStatus } from "h3";
import { getDatabase } from '~/server/utils/db';
import bcrypt from "bcrypt";
import path from 'path';

export default defineEventHandler(async (event) => {
  const { domain} = getRouterParams(event);
  const { token, newPassword } = await readBody(event); // Assuming you're getting newPassword in the body
 
  try {
    const db = getDatabase(user);

    // 1. Verificar se o token é válido e não expirou
    const user = db.prepare(`
      SELECT id FROM users WHERE resetToken = ? AND resetTokenExpiry > ?
    `).get(token, Date.now());

    console.log('user (reset-password):', user);

    if (!user) {
      setResponseStatus(event, 400);
      return { success: false, message: "Token de redefinição de senha inválido ou expirado." };
    }

    // 2. Hash a nova senha
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Atualizar a senha no banco de dados
    const updateStmt = db.prepare(`
      UPDATE users SET password = ? WHERE id = ?
    `);
    const updateResult = updateStmt.run(newPassword, user.id);

    if (updateResult.changes === 0) {
      setResponseStatus(event, 500);
      return { success: false, message: "Falha ao atualizar a senha." };
    }

    // 4. Remover o token de redefinição
    const stmt2 = db.prepare(`
      UPDATE users SET resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?
    `);
    const result2 = stmt2.run(user.id);

    if (result2.changes === 0) {
      console.warn("Token de redefinição não foi removido.");
      // Não é um erro crítico, mas você pode querer registrar isso
    }

    return { success: true, message: "Senha redefinida com sucesso." };

  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    setResponseStatus(event, 500);
    return { success: false, message: "Erro ao redefinir a senha.", error: error.message };
  } finally {
    if (db) {
      db.close();
    }
  }
});