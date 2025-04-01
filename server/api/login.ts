import jwt from 'jsonwebtoken'
import { H3Event, createError } from 'h3'
import {users} from '~/server/config/users'

const SECRET_KEY = 'chave_secreta' // Certifique-se de que esta chave é a mesma usada no middleware

function verificarLoginPorNome(nomeDigitado, senhaDigitada) {
  // Obtém todos os usuários como array de valores
  // const usuarios = Object.values(users);
  
  // Busca o usuário com o nome 
  // correspondente

  console.log('users:', users);
  
  const usuarioEncontrado = users.find(usuario => 
      usuario.nome.toLowerCase() === nomeDigitado.toLowerCase()
  );
  
  // Verifica se encontrou o usuário e se a senha está correta
  if (usuarioEncontrado && usuarioEncontrado.senha === senhaDigitada) {
      return {
          sucesso: true,
          usuario: usuarioEncontrado
      };
  }
  
  return {
      sucesso: false,
      mensagem: "Nome de usuário ou senha inválidos"
  };
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event)

  // Simulação de credenciais válidas

  var findUser = verificarLoginPorNome(body.username, body.password)

  console.log('findUser:', findUser);
  
  if (!findUser.sucesso) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciais inválidas' })
  }

  // Criar token JWT
  const token = jwt.sign({ username: findUser.usuario.nome, role: findUser.usuario.role }, SECRET_KEY, { expiresIn: '1h' })

  // console.log('token:', token);
  // console.log('findUser.usuario:', findUser.usuario);

  // Definir o cookie corretamente
  setCookie(event, 'auth_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600 // 1 hora
  })

  const userDataToStore = {...findUser.usuario}
  delete userDataToStore.senha
  // Definir o cookie corretamente
  setCookie(event, 'user_logged', JSON.stringify(userDataToStore), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600 // 1 hora
  })

  return { success: true, message: 'Login realizado com sucesso', token }
})
