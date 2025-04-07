// server/api/[domain]/[page].js
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export default defineEventHandler((event) => {
    const domain = event.context.params.username; // 'magaweb'
    const page = event.context.params.page;     // 'page_roles'

    console.log('Domain:', domain);
    console.log('Page:', page);
    const dbPath = path.resolve(`./data/${domain}.db`);

    if (!fs.existsSync(dbPath)) {
        return sendError(event, createError({ statusCode: 404, statusMessage: `Database not found for domain: ${domain}` }));
    }

    const db = new Database(dbPath);

    const authToken = getCookie(event, 'auth_token');

    if (!authToken) {
        return sendRedirect(event, `/${domain}/forbidden`); // Redireciona se não houver token
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'chave_secreta'); // Substitua 'your_jwt_secret'

        if (decoded.domain !== domain) {
            // return sendError(event, createError({ statusCode: 404, statusMessage: `domínio diferente do cookie` }));
            //  sendRedirect(event, `/${domain}/auth/login`);
            return { success: false, statusCode: 222, statusMessage: `Acesso negado` };
        }
        // if (page === 'page_roles') {
        //   // caso especifico para acessar diretamente a tabela.
        //   // retorna os dados da tabela
        //   const result = db.prepare('SELECT * FROM page_roles').all()
        //   return result;
        // }

        const pageRoles = db.prepare('SELECT roles FROM page_roles WHERE page = ?').get(page);
        console.log('Page roles:', pageRoles);
        if(!pageRoles || !pageRoles.roles) {
            return sendError(event, createError({ statusCode: 404, statusMessage: `erro` }));

        }

        const pageRolesArray = pageRoles.roles.split(',');
        const userRoles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];

        if (!userRoles.some(role => pageRolesArray.includes(role))) {
            return { success: false, statusCode: 404, statusMessage: `Acesso negado` };

        }

        return { message: 'Access granted' }; // Permissão concedida

    } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        return sendRedirect(event, `/${domain}/forbidden`); // Redireciona em erro JWT
    } finally {
        if(db && db.open) db.close();
    }
});