// import redis from '~/server/services/redis';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // Acessa o usuário autenticado do contexto
  const authToken = getCookie(event, "auth_token");
  // const auth = getCookie(event, "user_logged");

  if (!authToken) {
    // throw createError({statusCode: 401, statusMessage: "Unauthorized"});
    return {statusCode: 401, statusMessage: "Unauthorized"};
  }

  const decoded = jwt.verify(authToken, "chave_secreta");
  const usernameFromCookie = decoded.username;
  const domainFromCookie = decoded.domain;
  console.log('user decoded', decoded);

  // Retorna os dados do usuário
  return {message: "User information retrieved successfully", user: decoded};
});
