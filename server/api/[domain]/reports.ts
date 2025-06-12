import {getDatabase} from "~/server/utils/db";

function toISODate(dateStr: string): string {
	dateStr = dateStr.split('T')[0]
	dateStr = dateStr.split('"')[1]
	const [year, month, day] = dateStr.split('-')
	return `${year}-${
		month.padStart(2, '0')
	}-${
		day.padStart(2, '0')
	}`
}

async function getCategoryById(db, id) {
	const stmt = db.prepare('SELECT node_type FROM financial_categories WHERE id = ?');
	return stmt.get(id).node_type || "";
}

export default defineEventHandler(async (event) => {
	const domain = event.context.params.domain;
	const db = getDatabase(domain);
	const query = getQuery(event);
	const {start, end, type, category_id} = query;
	console.log('query:', query);

	let sql = "";
	let sql_group = "";
	const params: any[] = [];
	let where = "1=1";
	let node_type = ""

	if (category_id) {
		node_type = await getCategoryById(db, category_id)
	}

	if (start) {
		where += " AND date >= ?";
		params.push(toISODate(start));
	}

	if (end) {
		where += " AND date <= ?";
		params.push(toISODate(end));
	}


	if (category_id) {

		if (node_type == 'grupo') {
			where += " AND parent.id = ?";
		} else {
			where += " AND category_id = ?";

		} params.push(category_id);
	}

	// Buscar categorias e montar mapa para paths recursivos
	const categories = db.prepare(`SELECT id, name, parent_id FROM financial_categories`).all();
	const categoryMap = new Map(categories.map(c => [c.id, c]));

	function getFullCategoryPath(id: number |null): string {
		const names: string[] = []
		let current = categoryMap.get(id)
		while (current) {
			names.unshift(current.name)
			current = categoryMap.get(current.parent_id)
		}
		return names.join(' > ')
	}

	console.log('where:', where);
	console.log('params:', params);


	// Totais calculation
	if (node_type == 'grupo') {
		sql = `
  SELECT 
    parent.id AS group_id,
    parent.name AS group_name,
    SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) AS total_entradas,
    SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS total_saídas,
    SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) + 
    SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS saldo
FROM financial_transactions t
LEFT JOIN financial_categories c ON t.category_id = c.id
LEFT JOIN financial_categories parent ON c.parent_id = parent.id
WHERE ${where}
GROUP BY parent.id, parent.name
ORDER BY parent.name
  `
	} else {
		sql = `
    SELECT
    SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) as total_entradas,
    SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS total_saídas, 
    SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) + SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS saldo
    FROM financial_transactions
    WHERE ${where};
  `
	}

	console.log('sql:', sql);

	const rows_totais = db.prepare(sql).all(... params);


	if (type === "data") {
		sql = `
      SELECT 
        date AS data,
        description,
        SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) AS entradas,
        SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS saidas,
        SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) + SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS saldo
      FROM financial_transactions
      WHERE ${where}
      GROUP BY date
      ORDER BY date ASC
    `;

		const rows = db.prepare(sql).all(... params);
		return {rows, rows_totais};
	}


	const saldo = `
  SELECT 
    SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) + SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS saldo
    FROM financial_transactions`

	console.log('getCategoryById(db, category_id):', getCategoryById(db, category_id));

	if (node_type == "item") {
		sql = `
    SELECT 
      c.id as category_id,
      c.name AS nome,
      c.type AS type,
      t.description AS description,
      SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) AS entradas,
      SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS saidas,
      SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) + SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS saldo
    FROM financial_transactions t
    LEFT JOIN financial_categories c ON t.category_id = c.id
    WHERE ${where}
    GROUP BY c.id
    ORDER BY saldo DESC
  `;

		console.log('sql:', sql);
	} else {


		sql = `
  SELECT 
    parent.id as parent_id,
    parent.name AS grupo,
    c.id as category_id,
    c.name AS nome,
    c.type AS type,
    SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) AS entradas,
    SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS saidas,
    SUM(CASE WHEN t.type = 'entrada' THEN t.amount ELSE 0 END) + 
    SUM(CASE WHEN t.type = 'saída' THEN t.amount ELSE 0 END) AS saldo
FROM financial_transactions t
LEFT JOIN financial_categories c ON t.category_id = c.id
LEFT JOIN financial_categories parent ON c.parent_id = parent.id
WHERE ${where}
GROUP BY parent.id, c.id
ORDER BY parent.name, saldo DESC

  `

	}

	console.log('sql2:', sql);

	const rows = db.prepare(sql).all(... params);

	// Substitui nome pela hierarquia completa
	rows.forEach(row => {
		row.nome = getFullCategoryPath(row.category_id)
	})

	return {rows, rows_totais};
});
