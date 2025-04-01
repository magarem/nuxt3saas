// import redis from '~/server/services/redis';

export default defineEventHandler(async (event) => {
    // Acessa o usuário autenticado do contexto
    const authToken = getCookie(event, 'auth_token');
    const auth = getCookie(event, 'user_logged');
    
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }
  
    // Retorna os dados do usuário
    return {
      message: 'User information retrieved successfully',
      user: JSON.parse(auth)
    };
  });