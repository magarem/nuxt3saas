import {defineEventHandler, readBody, getRouterParams, setResponseStatus} from 'h3';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import sendEmailWithMailerSend from '~/server/api/sendEmail'; // Ajuste o caminho

import crypto from 'crypto';

// Inicialize o MailerSend com sua API Key (mantenha isso seguro!)
// const mailersend = new MailerSend({
// api_key: 'mlsn.4f89879fe6b402e097d453d29e99fcdd0bcdbce01744581ab48819b359098ebe', // Use uma variável de ambiente!
// });

export default defineEventHandler(async (event) => {
	const {domain} = getRouterParams(event);
	const {username, email, password} = await readBody(event);
	const dbPath = `./server/data/${domain}.db`;
	let db;

	try {
		db = new Database(dbPath);

		// 1. Validar os dados (Exemplo básico)
		if (!username || !email || !password) {
			setResponseStatus(event, 400);
			return {success: false, message: 'Por favor, preencha todos os campos.'};
		}

		// 2. Verificar se o username ou email já existem
		const existingUser = db.prepare('SELECT id FROM users WHERE nome = ? OR email = ?').get(username, email);
		if (existingUser) {
			setResponseStatus(event, 400);
			return {success: false, message: 'Username ou email já existe.'};
		}

		// 3. Hash a senha
		const hashedPassword = await bcrypt.hash(password, 10);

		// 4. Inserir o novo usuário
		const statement = db.prepare(`
      INSERT INTO users (nome, email, password, status)
      VALUES (?, ?, ?, ?)
    `);
		const result = statement.run(username, email, password, 'pending');

		if (result.changes > 0) { // 5. Gerar token de verificação de email
			const verificationToken = crypto.randomBytes(20).toString('hex');
			const verificationLink = `http://localhost:3000/${domain}/verify-email/${verificationToken}`;
			// Adapte a URL

			// 6. Salvar o token no banco de dados (associado ao usuário)
			// 6. Salvar o token no banco de dados (associado ao usuário)
			const userId = db.prepare('SELECT last_insert_rowid() AS id').get().id;

			db.prepare(`
        UPDATE users
        SET verificationToken = ?, verificationTokenExpiry = ?
        WHERE id = ?
      `).run(verificationToken, Date.now() + 7600000, userId);


			// 7. Enviar o email de confirmação usando MailerSend
			const emailParams = {
				from: {
					email: 'magaweb@magaweb.com.br', // Seu email remetente
					name: 'Super Saas', // Nome do remetente
				},
				to: [
					{
						email: email, // Email do destinatário
					},
				],
				subject: 'Por favor, verifique seu email',
				html: `
          <p>Obrigado por se registrar! Clique <a href="${verificationLink}">aqui</a> para verificar seu email.</p>
        `
			};

			try {
				// const emailResult = await sendEmailWithMailerSend(emailParams.to[0].email, username, emailParams.subject, emailParams.html, '');


				// const emailResult = await $fetch('/api/sendEmail', {
				const emailResult = await $fetch('/api/send-email', {
					method: 'POST',
					body: {
						to: emailParams.to[0].email,
						name: username,
						subject: emailParams.subject,
						html: emailParams.html
					}
				})
				// const emailResult = await $fetch('/api/send-email', {
				// method: 'POST',
				// body: {
				//     to: emailParams.to[0].email,
				//     destinatario: emailParams.to[0].email,
				//     name: username,
				//     subject: emailParams.subject,
				//     html: emailParams.html,
				//     text: '',
				// },
				// })

				// console.log('Email de confirmação enviado com sucesso:', emailResult);
				if (emailResult.success) {
					return {success: true, message: 'Email enviado com sucesso'};
				}

			} catch (error) {
				return {success: false, message: 'Falha ao enviar email', error: error.message};
			}


			// try {
			// const mailersendResponse = await mailersend.email.send(emailParams);
			// console.log('Email de confirmação enviado com sucesso:', mailersendResponse);
			// } catch (error) {
			// console.error('Erro ao enviar email de confirmação:', error);
			// // Não falhe o registro se o email não enviar, mas logue o erro
			// }

			// return {success: true, message: 'Usuário registrado com sucesso! Verifique seu e-mail para confirmação.'};
		} else {
			setResponseStatus(event, 500);
			return {success: false, message: 'Falha ao registrar o usuário.'};
		}

	} catch (error) {
		console.error('Erro ao registrar usuário:', error);
		setResponseStatus(event, 500);
		return {success: false, message: 'Erro interno do servidor.', error: error.message};
	} finally {
		if (db) {
			db.close();
		}
	}
});
