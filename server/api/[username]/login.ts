import jwt from "jsonwebtoken";
import {H3Event, createError, setCookie, readBody} from "h3";
import Database from "better-sqlite3";
import path from "path";

const SECRET_KEY = "chave_secreta";

function verificarLoginPorNome(db, nomeDigitado, senhaDigitada) {
  try {
    const stmt = db.prepare("SELECT * FROM users WHERE nome = ?");
    const usuarioEncontrado = stmt.get(nomeDigitado);
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

  const account_username = event.context.params.username;
  const dbPath = path.resolve(`./data/${account_username}.db`);
  console.log(`./data/${account_username}.db`);

  const db = new Database(dbPath); // Open in readonly mode for safety (consider changing this if you need write operations)

  console.log(222, body.username, body.password);

  const findUser = verificarLoginPorNome(db, body.username, body.password);

  console.log(333, findUser);

  if (!findUser.sucesso) {
    throw createError({statusCode: 401, statusMessage: "Credenciais inválidas"});
  }

  const token = jwt.sign({
    domain: account_username,
    username: findUser.usuario.nome,
    role: findUser.usuario.role
  }, SECRET_KEY, {expiresIn: "1h"});

  setCookie(event, "auth_token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600
  });

  const userDataToStore = {
    ...findUser.usuario
  };
  delete userDataToStore.password;

  // setCookie(event, "user_logged", JSON.stringify(userDataToStore), {
  //   httpOnly: false,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 3600
  // });

  return {success: true, message: "Login realizado com sucesso", token};
});
