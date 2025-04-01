import jwt from 'jsonwebtoken';
import { roles } from '../config/pagesRolesAccess';

console.log('roles::>', roles);

 export default defineEventHandler((event) => {
  

  const authToken = getCookie(event, 'auth_token')
  const user = getCookie(event, 'user_logged')
   
const publicRoutes = ['/dashboard', '/api/login', '/api/logout', '/api/database', '/register', '/auth/login', '/', '/crud'];
    
//   if (!authToken) {
//     return navigateTo('/login');
//   }
function checkAccess(accessControl, path, userRole) {

    if (path.startsWith("/api") || publicRoutes.includes(path)){
        return true
    }else{
        console.log('accessControl:',accessControl);
        console.log('accessControl[path]:',accessControl[path]);
        console.log('path:',path);
        console.log('userRole:',userRole);
        
    const allowedRoles = accessControl[path];

    console.log('allowedRoles', allowedRoles);
    console.log('allowedRoles.includes(userRole)', allowedRoles.some(item => userRole.includes(item)));
    
    if (!allowedRoles) {
      return false; // Deny access if the path is not defined
    }
    return allowedRoles.some(item => userRole.includes(item));
}

  }

  try {
    // Verifica o token JWT
    const decoded = jwt.verify(authToken, 'chave_secreta');
    console.log('token decoded:', decoded);
   
    const userRole = decoded.role;
    console.log('role do usuário é:', userRole );

    console.log('event.path, userRole>>',  roles, event.path, userRole);
    console.log('check::', checkAccess(roles, event.path, userRole));
    
    if (!checkAccess(roles, event.path, userRole)){
        console.log("Forbidden!")
        return sendRedirect(event, '/forbidden', 302); // Redirect to '/login'
    }

     // Define o usuário no contexto
//   event.context.auth = {
//     user: {
//       id: "121233",
//       name: "Fidelis",
//       email: "silva@silveirinha.com",
//       role: "admin",
//     },
//   };

// console.log('event.context.user:::>', event.context.user);

    
  } catch (err) {
    if (!publicRoutes.includes(event.node.req.url)) {
        console.log("----------", event.node.req.url)
        return sendRedirect(event, '/auth/login', 302); // Redirect to '/login'
      }
    
  }
});