// Versão simplificada sem SQLite para teste
let livros = [
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', isbn: '8594318609', status: 'disponivel' },
    { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', isbn: '8572327893', status: 'emprestado' },
    { id: 3, titulo: 'Iracema', autor: 'José de Alencar', isbn: '8572328369', status: 'atrasado' },
    { id: 4, titulo: 'O Alienista', autor: 'Machado de Assis', isbn: '8572328385', status: 'disponivel' }
];

let administradores = [
    { id: 1, usuario: 'admin', senha: '123456' }
];

const database = {
    all: (query, callback) => {
        callback(null, livros);
    },
    
    get: (query, params, callback) => {
        if (query.includes('administradores')) {
            const admin = administradores.find(a => a.usuario === params[0] && a.senha === params[1]);
            callback(null, admin);
        } else if (query.includes('COUNT(*)')) {
            if (query.includes('emprestado')) {
                callback(null, { emprestados: livros.filter(l => l.status === 'emprestado').length });
            } else if (query.includes('atrasado')) {
                callback(null, { atrasados: livros.filter(l => l.status === 'atrasado').length });
            } else {
                callback(null, { total: livros.length });
            }
        }
    },
    
    run: (query, params, callback) => {
        if (query.includes('INSERT INTO livros')) {
            const newId = Math.max(...livros.map(l => l.id)) + 1;
            const novoLivro = {
                id: newId,
                titulo: params[0],
                autor: params[1],
                isbn: params[2] || '',
                status: 'disponivel'
            };
            livros.push(novoLivro);
            callback.call({ lastID: newId });
        } else if (query.includes('UPDATE livros SET status')) {
            const livro = livros.find(l => l.id === params[1]);
            if (livro) {
                livro.status = params[0].includes('emprestado') ? 'emprestado' : 'disponivel';
            }
            callback.call({ changes: 1 });
        }
    }
};

console.log('✅ Banco de dados em memória carregado');
console.log('👤 Admin: admin / 123456');
console.log('📚 Livros de exemplo carregados');

module.exports = database;
