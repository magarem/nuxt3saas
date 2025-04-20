import {defineEventHandler, readBody, setResponseStatus} from "h3";
import Database from "better-sqlite3"; // Ou sua biblioteca de banco de dados
import crypto from "crypto"; // Para gerar tokens
import nodemailer from "nodemailer"; // Para enviar e-mails
import bcrypt from "bcrypt"; // Para comparar senhas
import path from 'path';

export default defineEventHandler(async (event) => {
  const {email} = await readBody(event);
  const domain = event.context.params.domain;
  const dbPath = path.resolve(`./server/data/${domain}.db`);
//   const db = new Database(dbPath);

  let db;

  try {
    db = new Database(dbPath);

    // 1. Verificar se o e-mail existe no banco de dados
    const user = db.prepare("SELECT id, nome FROM users WHERE email = ?").get(email);

    console.log('user >>:', user);
    
    if (!user) {
      setResponseStatus(event, 404);
      return {success: false, message: "Usuário não encontrado com este e-mail."};
    }

    // 2. Gerar um token único de redefinição de senha
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token válido por 1 hora (em milissegundos)

    // 3. Salvar o token no banco de dados (associado ao usuário)
    db.prepare("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?").run(resetToken, resetTokenExpiry, user.id);

   
    
    // 4. Configurar o Nodemailer (adapte com suas configurações de email)
    // const transporter = nodemailer.createTransport({
    //   service: "gmail", // Ou outro serviço SMTP
    //   auth: {
    //     user: "magawebtec@gmail.com",
    //     pass: "sua_senha"
    //   }
    // });

    // 5. Construir o conteúdo do e-mail
    const resetLink = `http://localhost:3000/${domain}/reset-password?token=${resetToken}`; // Adapte a URL
    const mailOptions = {
      from: "magawebtec@gmail.com",
      to: email,
      subject: "Redefinição de Senha",
      html: `<p>Você solicitou a redefinição da sua senha. Clique <a href="${resetLink}">aqui</a> para definir uma nova senha. Este link expira em 1 hora.</p>`
    };

    const emailResult = await $fetch('/api/send-email', {
        method: 'POST',
        body: {
            to: mailOptions.to,
            name: user.nome,
            subject: mailOptions.subject,
            html: mailOptions.html
        }
    })

    console.log('emailResult >>:', emailResult);

    // 6. Enviar o e-mail
    // await transporter.sendMail(mailOptions);

    return {success: true, message: "Um link de redefinição de senha foi enviado para o seu e-mail."};
  } catch (error) {
    console.error("Erro no processo de esqueci minha senha:", error);
    setResponseStatus(event, 500);
    return {success: false, message: "Erro ao processar solicitação de redefinição de senha.", error: error.message};
  } finally {
    if (db) {
      await db.close();
    }
  }
});
