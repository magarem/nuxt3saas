export default defineEventHandler((event) => {

  console.log('Deslogando usuário...');
  
    deleteCookie(event, 'auth_token')
    deleteCookie(event, 'user_logged')

    return { message: 'Logout realizado com sucesso' }
  })
  