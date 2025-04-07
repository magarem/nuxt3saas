import sqlite3 from 'better-sqlite3';
import fs from 'fs';
function criarBancoDeDados(nomeUsuario) {
  const nomeArquivo = `data/${nomeUsuario}.db`;

  // Verifica se o arquivo já existe
//   if (fs.existsSync(nomeArquivo)) {
//     console.log(`Banco de dados ${nomeArquivo} já existe.`);
//     return;
//   }

  try {
    const db = new sqlite3(nomeArquivo);

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
        CREATE TABLE page_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          page TEXT,
          roles TEXT
        )
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
  console.error('Nome do usuário não fornecido.');
  process.exit(1);
}

criarBancoDeDados(nomeUsuario);