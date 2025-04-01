// server/middleware/log.js
import jwt from 'jsonwebtoken';

function getUsernameFromApiPath(path) {
  const match = path.match(/\/@([^/]+)\//);
  if (match) {
    return "@" + match[1];
  }
  return null;
}

export default defineEventHandler((event) => {
  const authToken = getCookie(event, 'auth_token')
  console.log('event.node.req.url:', event.node.req.url); // Loga a URL da requisição
  const excludedUrls = ['/auth/login', '/api/login', '/api/user'];
  const isExcluded = excludedUrls.includes(event.node.req.url);

if (!isExcluded)  {
    try {
      const decoded = jwt.verify(authToken, 'chave_secreta');
      const usernameFromCookie = decoded.username;
      const usernameFromUrl = getUsernameFromApiPath(event.node.req.url);
      
      console.log('usernameFromCookie:', usernameFromCookie); // Loga a URL da requisição
      console.log('usernameFromUrl:', usernameFromUrl); // Loga a URL da requisição
      console.log('check usernames:', usernameFromCookie === usernameFromUrl); // Loga a URL da requisição
    
      if (usernameFromUrl?.includes("@")) {
        if (usernameFromCookie !== usernameFromUrl) {
          return sendRedirect(event, '/auth/login', 302); // Redirect to '/login'
        }
      } 
    } catch (error) {
      return sendRedirect(event, '/auth/login', 302); // Redirect to '/login'
    }
  }
});
