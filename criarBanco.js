import { getDatabase } from '~/server/utils/db';

function criarBancoDeDados(domain) {
 
  try {
    const db = getDatabase(domain);

    // Cria a tabela contatos
    db.exec(`
      CREATE TABLE if not exists users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,
        telefone TEXT,
        password TEXT,
        roles TEXT,
        status TEXT
      )
    `);

    db.exec(`
        CREATE TABLE if not exists roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          desc TEXT
        )
      `);

    db.exec(`
      CREATE TABLE if not exists user_roles (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
    );
    
    CREATE INDEX if not exists idx_user_id ON user_roles (user_id);

    `);

    db.exec(`
    CREATE TABLE if not exists pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page VARCHAR(255) NOT NULL UNIQUE, 
      description TEXT            
  );

    `);

    db.exec(`
        CREATE TABLE if not exists page_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page_id INTEGER NOT NULL,
          role_id INTEGER NOT NULL,
          FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
          FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
          UNIQUE (page_id, role_id)
      );
      
      CREATE INDEX if not exists idx_page_roles_page_id ON page_roles(page_id);
     `);

    console.log(`Banco de dados ${nomeArquivo} criado com sucesso.`);
    db.close();
  } catch (error) {
    console.error(`Erro ao criar o banco de dados ${nomeArquivo}:`, error);
  }
}

// Exemplo de uso:
const nomeUsuario = process.argv[2]; // Pega o nome do usuário do argumento da linha de comando

if (!nomeUsuario) {
  console.error("Nome do usuário não fornecido.");
  process.exit(1);
}

criarBancoDeDados(domain);
