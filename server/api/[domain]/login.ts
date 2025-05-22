import jwt from "jsonwebtoken";
import {H3Event, createError, setCookie, readBody} from "h3";
import { getDatabase } from '~/server/utils/db';

const SECRET_KEY = "chave_secreta";

function verificarLoginPorNome(db, nomeDigitado, senhaDigitada) {
	try {
		const stmt = db.prepare(`
      SELECT
          u.id,
          u.nome as nome,
          u.email,
          u.telefone,
          u.password as password,
          u.status,
          GROUP_CONCAT(r.name, ', ') AS roles_names,
          GROUP_CONCAT(ur.role_id) AS roles_ids
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE (u.nome = ? or u.email = ?)AND u.status != 'pending'
        GROUP BY u.id, u.nome, u.email, u.telefone, u.password, u.status
        
    `);

		const usuarioEncontrado = stmt.get(nomeDigitado, nomeDigitado);
		console.log("usuarioEncontrado:", usuarioEncontrado);

		if (usuarioEncontrado && usuarioEncontrado.password === senhaDigitada) {
			return {sucesso: true, usuario: usuarioEncontrado};
		}

		return {sucesso: false, mensagem: "Nome de usuário ou senha inválidos"};
	} catch (error) {
		console.error("Erro ao verificar login:", error);
		return {sucesso: false, mensagem: "Erro interno ao verificar login"};
	}
}

export default defineEventHandler(async (event : H3Event) => {
	const body = await readBody(event);

	const domain = event.context.params.domain;
	const db = getDatabase(domain);
	const findUser = verificarLoginPorNome(db, body.username, body.password);

	if (! findUser.sucesso) {
		throw createError({statusCode: 401, statusMessage: "Credenciais inválidas"});
	}
  
	const token = jwt.sign({
		timeStamp: new Date().getTime(),
		id: findUser.usuario.id,
		email: findUser.usuario.email,
		domain: domain,
		username: findUser.usuario.nome,
		roles: findUser.usuario.roles_ids
	}, SECRET_KEY, {expiresIn: "10000h"});

	setCookie(event, "auth_token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 60 * 24 * 700000
	});

	const userDataToStore = {... findUser.usuario};

	delete userDataToStore.password;

	return {success: true, message: "Login realizado com sucesso", token};
});
