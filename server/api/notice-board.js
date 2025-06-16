import {getDatabase} from '~/server/utils/db';
import {getUserFromAuth} from '~/server/utils/getUserFromAuth';

export default defineEventHandler(async (event) => {
	const user = getUserFromAuth(event)
	const domain = user?.domain || 'unknown'
    // logger.info(`User ${user.id} is accessing the notice board.`)
	
    console.log(`User ${user} is accessing the notice board.`)
    // console.log(`User ${user.domain} is accessing the notice board.`)

    const method = event.method

	if (method === 'GET') {
		return await getNotices(domain, event)
	}

	if (method === 'POST') {
		return await createNotice(domain, event)
	}

	return {error: 'Method not supported'}
})

async function getNotices(domain, event) {
	const query = getQuery(event)
	const rolesParam = query.roles // example: "1,3,5"

	const db = getDatabase(domain)
	if (! db) {
		return {error: 'Database not found'}
	}
	if (! rolesParam) {
		return {error: 'Missing roles parameter'}
	}

	const roleIds = rolesParam.split(',').map((r) => parseInt(r.trim()))

	const placeholders = roleIds.map(() => '?').join(',')

	const sql = `
    SELECT DISTINCT n.id, n.content, n.created_at
    FROM notices n
    JOIN notice_role nr ON n.id = nr.notice_id
    WHERE nr.role_id IN (${placeholders})
    ORDER BY n.created_at DESC
  `

	const notices = db.prepare(sql).all(... roleIds)

	return notices
}

async function createNotice(domain, event) {
	const db = getDatabase(domain)
	if (! db) {
		return {error: 'Database not found'}
	}
	
	const body = await readBody(event)
console.log('Creating notice with body:', body)
	if (! body.content || ! body.role_ids || !Array.isArray(body.role_ids) || body.role_ids.length === 0) {
		return {error: 'Missing required fields'}
	}

	const insertNotice = db.prepare('INSERT INTO notices (content) VALUES (?)')
	const result = insertNotice.run(body.content)
	const noticeId = result.lastInsertRowid

	const insertRole = db.prepare('INSERT INTO notice_role (notice_id, role_id) VALUES (?, ?)')

	const insertMany = db.transaction((roles) => {
		for (const roleId of roles) {
			insertRole.run(noticeId, roleId)
		}
	})

	insertMany(body.role_ids)

	return {success: true, notice_id: noticeId}
}
