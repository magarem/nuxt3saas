import jwt from 'jsonwebtoken';
import {getDatabase} from '~/server/utils/db';
import {
	defineEventHandler,
	readBody,
	getRouterParams,
	setResponseStatus,
	getCookie,
	sendRedirect,
	createError,
	sendError
} from 'h3'; // Importações corretas

function ensureArray(value) {
	if (Array.isArray(value)) {
		return value;
	} else {
		return [String(value)]; // Converte para string antes de envolver em array
	}
}

export default defineEventHandler(async (event) => {
	const {domain, user, page} = getRouterParams(event);

	console.log('Domain:', domain);
	console.log('User:', user);
	console.log('Page:', page);
	
	// Use desestruturação para clareza
	// const dbPath = path.resolve(`./server/data/${domain}.db`);
	// const dbPath =  path.join(process.cwd(), 'server/data', `${domain}.db`);
	// if (!fs.existsSync(dbPath)) {
	// return sendError(event, createError({ statusCode: 404, statusMessage: `Database not found for domain: ${domain}` }));
	// }

	const db = getDatabase(domain);
	const authToken = getCookie(event, 'auth_token');

	if (! authToken) {
		return sendRedirect(event, `/${domain}/${user}/forbidden`);
	}
	if (! db) {
		return sendError(event, createError({statusCode: 500, statusMessage: `Database not found for domain: ${domain}`}));
	}
	try {
		const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'chave_secreta');

		if (decoded.domain !== domain) {
			return {success: false, statusCode: 222, statusMessage: `Acesso negado`};
		}

		// Corrigido: Buscar todos os role_ids
		const pageRoles = db.prepare('SELECT role_id FROM page_roles WHERE page_id = (SELECT id FROM pages WHERE page = ?)').all(page);
		console.log('Page roles:', pageRoles);

		if (! pageRoles || pageRoles.length === 0) {
			return sendError(event, createError({statusCode: 404, statusMessage: `Página não encontrada ou sem roles configuradas`}));
		}

		const pageRolesArray = pageRoles.map(pr => String(pr.role_id)); // Converter para array de strings
		console.log('Page roles array:', pageRolesArray);

		const userRoles = decoded.roles ?. replace(/\s+/g, '').split(',');
		console.log('User roles:', userRoles);

		if (! userRoles ?. some(role => pageRolesArray.includes(role))) {
			return {success: false, statusCode: 404, statusMessage: `Acesso negado`};
		}

		return {message: 'Acesso concedido'};

	} catch (jwtError) {
		console.error('JWT verification error:', jwtError);
		return sendRedirect(event, `/${domain}/forbidden`);
	} finally {
		if (db && db.open) 
			db.close();
	}
});
