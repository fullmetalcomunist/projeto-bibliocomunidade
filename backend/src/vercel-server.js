const express = require('express');
const path = require('path');
const app = express();

// Dados em memória
let livros = [
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', isbn: '8594318609', status: 'disponivel' },
    { id: 2, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', isbn: '8572327893', status: 'emprestado', membroId: 1 },
    { id: 3, titulo: 'Iracema', autor: 'José de Alencar', isbn: '8572328369', status: 'atrasado', membroId: 2 },
    { id: 4, titulo: 'O Alienista', autor: 'Machado de Assis', isbn: '8572328385', status: 'disponivel' }
];

let membros = [
    { id: 1, nome: 'João Silva', telefone: '(85) 99999-9999', endereco: 'Rua A, 123' },
    { id: 2, nome: 'Maria Santos', telefone: '(85) 98888-8888', endereco: 'Rua B, 456' },
    { id: 3, nome: 'Pedro Oliveira', telefone: '(85) 97777-7777', endereco: 'Rua C, 789' }
];

// Middleware
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend/web')));

// API Routes
app.post('/api/auth/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123456') {
        res.json({ success: true, message: 'Login realizado' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
});

app.get('/api/books', (req, res) => {
    const livrosComMembros = livros.map(livro => {
        if (livro.membroId) {
            const membro = membros.find(m => m.id === livro.membroId);
            return { ...livro, membroNome: membro ? membro.nome : 'Não encontrado' };
        }
        return livro;
    });
    res.json(livrosComMembros);
});

app.get('/api/books/stats', (req, res) => {
    const stats = {
        totalLivros: livros.length,
        livrosEmprestados: livros.filter(l => l.status === 'emprestado').length,
        livrosAtrasados: livros.filter(l => l.status === 'atrasado').length,
        totalMembros: membros.length
    };
    stats.livrosDisponiveis = stats.totalLivros - stats.livrosEmprestados - stats.livrosAtrasados;
    res.json(stats);
});

app.post('/api/books', (req, res) => {
    const { titulo, autor, isbn } = req.body;
    const newId = Math.max(...livros.map(l => l.id)) + 1;
    const novoLivro = { id: newId, titulo, autor, isbn: isbn || '', status: 'disponivel' };
    livros.push(novoLivro);
    res.json({ success: true, message: 'Livro adicionado', id: newId });
});

app.post('/api/books/:id/emprestar', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { membroId } = req.body;
    
    const livro = livros.find(l => l.id === bookId);
    const membro = membros.find(m => m.id === parseInt(membroId));
    
    if (!livro || !membro) return res.status(404).json({ error: 'Livro ou membro não encontrado' });
    if (livro.status !== 'disponivel') return res.status(400).json({ error: 'Livro não disponível' });
    
    livro.status = 'emprestado';
    livro.membroId = parseInt(membroId);
    res.json({ success: true, message: `Livro emprestado para ${membro.nome}` });
});

app.post('/api/books/:id/devolver', (req, res) => {
    const bookId = parseInt(req.params.id);
    const livro = livros.find(l => l.id === bookId);
    if (!livro) return res.status(404).json({ error: 'Livro não encontrado' });
    livro.status = 'disponivel';
    livro.membroId = null;
    res.json({ success: true, message: 'Livro devolvido' });
});

app.get('/api/members', (req, res) => {
    res.json(membros);
});

app.post('/api/members', (req, res) => {
    const { nome, telefone, endereco } = req.body;
    const newId = Math.max(...membros.map(m => m.id), 0) + 1;
    const novoMembro = { id: newId, nome, telefone: telefone || '', endereco: endereco || '' };
    membros.push(novoMembro);
    res.json({ success: true, message: 'Membro cadastrado', id: newId });
});

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/dashboard.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/login.html'));
});

// Export para Vercel
module.exports = app;
