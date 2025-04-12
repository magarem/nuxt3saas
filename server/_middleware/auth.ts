import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const retDomainName = (url) => {
    return url?.startsWith('/api') ? url?.split('/')[2] : url?.split('/')[1];
};

const checkUrlType = (url) => {
    return url.startsWith('/api') ? ['api', url.split('/')[3]] : ['page', url.split('/')[2]];
};

function checkStringPattern(url, patterns) {
    const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
    return patternsArray.some(pattern => new RegExp(pattern.replace(/\*/g, '.*') + '$').test(url));
}

export default defineEventHandler((event) => {
    const url = event.node.req.url;
    const domain = retDomainName(url);
    console.log('url-------------:>', url);
    console.log('domain-------------:>', domain);

    // if (!fs.existsSync(path.resolve(`./server/data/${domain}.db`))) {
    //     return sendError(event, createError({ statusCode: 401, statusMessage: `${url} - Domínio não encontrado` }));
    // }

    // const dbPath = path.resolve(`./server/data/${domain}.db`);
    // const db = new Database(dbPath);

    if (checkStringPattern(url, ['/', '/login', '/logout', '/user'])) {
        return; // Pula a verificação de autenticação para URLs públicas
    }

    const authToken = getCookie(event, 'auth_token');
    if (!authToken) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized - Token ausente' }));
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'chave_secreta'); // Use env var
        console.log('authToken-------------:>', authToken);
        console.log('decoded-------------:>', decoded);
        console.log('user roles-------------:>', decoded?.roles);

        const [urlType, urlPart] = checkUrlType(url);
        console.log('checkUrlType(url)', [urlType, urlPart]);

        if (false && urlType === 'page') {
			try {
				const pageRoles = db.prepare('SELECT roles FROM page_roles WHERE page = ?').get(urlPart);
				const pageRolesArray = pageRoles?.roles?.split(',') || [];
				console.log('pageRolesArray:', pageRolesArray);
		
				const userRoles = Array.isArray(decoded?.roles) ? decoded.roles : [decoded?.roles];
		
				if (!userRoles.some(role => pageRolesArray.includes(role))) {
					return sendError(event, createError({ statusCode: 403, statusMessage: 'Forbidden - Permissão negada' }));
				}
			} catch (dbError) {
				console.error('Erro de banco de dados:', dbError);
				return sendError(event, createError({ statusCode: 500, statusMessage: 'Erro interno do servidor' }));
			}
		}
    } catch (jwtError) {
        console.error('Erro de JWT:', jwtError);
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized - Token inválido' }));
    }
});