const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco:', err.message);
    } else {
        console.log('✅ Conectado ao banco SQLite');
        initDatabase();
    }
});

function initDatabase() {
    // Tabela de administradores
    db.run(`CREATE TABLE IF NOT EXISTS administradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela administradores:', err);
        } else {
            // Inserir admin padrão se não existir
            db.get("SELECT * FROM administradores WHERE usuario = 'admin'", (err, row) => {
                if (!row) {
                    db.run("INSERT INTO administradores (usuario, senha) VALUES ('admin', '123456')");
                    console.log('👤 Admin padrão criado: admin / 123456');
                }
            });
        }
    });

    // Tabela de livros
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        isbn TEXT,
        status TEXT DEFAULT 'disponivel',
        data_emprestimo DATE,
        data_devolucao DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela livros:', err);
        } else {
            console.log('✅ Tabela de livros pronta');
            
            // Inserir alguns livros de exemplo se a tabela estiver vazia
            db.get("SELECT COUNT(*) as count FROM livros", (err, row) => {
                if (row.count === 0) {
                    const sampleBooks = [
                        ['Dom Casmurro', 'Machado de Assis', '8594318609', 'disponivel'],
                        ['O Cortiço', 'Aluísio Azevedo', '8572327893', 'emprestado'],
                        ['Iracema', 'José de Alencar', '8572328369', 'atrasado'],
                        ['O Alienista', 'Machado de Assis', '8572328385', 'disponivel']
                    ];
                    
                    const stmt = db.prepare("INSERT INTO livros (titulo, autor, isbn, status) VALUES (?, ?, ?, ?)");
                    sampleBooks.forEach(book => stmt.run(book));
                    stmt.finalize();
                    
                    console.log('📚 Livros de exemplo inseridos');
                }
            });
        }
    });
}

module.exports = db;
