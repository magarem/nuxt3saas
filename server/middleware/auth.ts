// server/middleware/log.js
import jwt from 'jsonwebtoken';

function getDomainFromApiPath(href) {
  const match = href.split('/')[1]
  if (match) {
    return match;
  }
  return null;
}


function checkStringPattern(url, patterns) {
  if (!Array.isArray(patterns)) {
    // Se patterns não for um array, trate como um único padrão
    patterns = [patterns];
  }

  for (const pattern of patterns) {
    const patternRegex = new RegExp(pattern.replace(/\*/g, '.*') + '$');
    if (patternRegex.test(url)) {
      return true; // Retorna true se qualquer padrão corresponder
    }
  }

  return false; // Retorna false se nenhum padrão corresponder
}

export default defineEventHandler((event) => {
  const authToken = getCookie(event, 'auth_token')
  console.log('event.node.req.url:', event.node.req.url); // Loga a URL da requisição
  const domainFromUrl = getDomainFromApiPath(event.node.req.url);
  
if (!checkStringPattern(event.node.req.url, ['/login', '/logout', '/user'])) {
    try {
      const decoded = jwt.verify(authToken, 'chave_secreta');
      const usernameFromCookie = decoded.username;
      const domainFromCookie = decoded.domain;
      
      console.log('usernameFromCookie:', usernameFromCookie); // Loga a URL da requisição
      console.log('domainFromUrl:', domainFromUrl); // Loga a URL da requisição
      console.log('domainFromCookie:', domainFromCookie); // Loga a URL da requisição
      console.log('check usernames:', domainFromCookie === domainFromUrl); // Loga a URL da requisição
    
      if (domainFromUrl !== 'api' && domainFromCookie !== domainFromUrl) {
        return sendRedirect(event, '/'+domainFromUrl + '/auth/login', 302); // Redirect to '/login'
      }
    
      // if (usernameFromUrl?.includes("@")) {
      //   if (usernameFromCookie !== usernameFromUrl) {
      //     return sendRedirect(event, usernameFromUrl + '/auth/login', 302); // Redirect to '/login'
      //   }
      // } 

    } catch (error) {
      console.error('Error:', error);
      return sendRedirect(event, '/'+domainFromUrl + '/auth/login', 302); // Redirect to '/login'
    }
  }
});
