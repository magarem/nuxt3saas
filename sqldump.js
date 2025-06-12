import Database from 'better-sqlite3'

// Initialize database
const db = new Database('./server/data/novagokula.db', { verbose: console.log })

try {
  // Get all table names from sqlite_master
  const tables = db
    .prepare(
      `
    SELECT name 
    FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `
    )
    .all()

  // Get schema details for each table
  const schemas = tables.map((table) => {
    // Get the CREATE TABLE statement
    const createStatement = db
      .prepare(
        `
      SELECT sql 
      FROM sqlite_master 
      WHERE type='table' AND name=?
    `
      )
      .get(table.name).sql

    // Get detailed column information using PRAGMA
    const columns = db.prepare(`PRAGMA table_info(${table.name})`).all()

    return {
      tableName: table.name,
      createStatement,
      columns: columns.map((col) => ({
        name: col.name,
        type: col.type,
        notNull: col.notnull === 1,
        defaultValue: col.dflt_value,
        primaryKey: col.pk === 1,
      })),
    }
  })

  // Display schemas
  console.log('Database Schemas\n')
  schemas.forEach((schema) => {
    console.log(`Table: ${schema.tableName}`)
    // console.log('Create Statement:')
    console.log(`${schema.createStatement}\n`)
    // console.log('Columns:')
    // console.log(
    //   '| Name          | Type          | Not Null | Default Value       | Primary Key |'
    // )
    // console.log(
    //   '|---------------|---------------|----------|---------------------|-------------|'
    // )
    // schema.columns.forEach((col) => {
    //   console.log(
    //     `| ${col.name.padEnd(13)} | ${col.type.padEnd(13)} | ${
    //       col.notNull ? 'Yes' : 'No '
    //     } | ${(col.defaultValue || 'None').padEnd(19)} | ${
    //       col.primaryKey ? 'Yes' : 'No '
    //     } |`
    //   )
    // })
    // console.log('\n')
  })
} catch (error) {
  console.error('Error fetching schemas:', error.message)
} finally {
  db.close()
}