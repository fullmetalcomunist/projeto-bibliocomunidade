const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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

let administradores = [
    { id: 1, usuario: 'admin', senha: '123456' }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/web')));

// Rotas de Autenticação
app.post('/api/auth/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    if (!usuario || !senha) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuário e senha são obrigatórios' 
        });
    }
    
    const admin = administradores.find(a => a.usuario === usuario && a.senha === senha);
    
    if (admin) {
        res.json({ 
            success: true, 
            message: 'Login realizado com sucesso',
            user: { id: admin.id, usuario: admin.usuario }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Usuário ou senha incorretos' 
        });
    }
});

// Rotas de Livros
app.get('/api/books', (req, res) => {
    // Enriquecer dados dos livros com informações do membro
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
    
    if (!titulo || !autor) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
    }
    
    const newId = Math.max(...livros.map(l => l.id)) + 1;
    const novoLivro = {
        id: newId,
        titulo,
        autor,
        isbn: isbn || '',
        status: 'disponivel'
    };
    
    livros.push(novoLivro);
    
    res.json({ 
        success: true, 
        message: 'Livro adicionado com sucesso',
        id: newId 
    });
});

app.post('/api/books/:id/emprestar', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { membroId } = req.body;
    
    console.log('=== DEBUG EMPRÉSTIMO ===');
    console.log('Book ID recebido:', bookId, 'Tipo:', typeof bookId);
    console.log('Membro ID recebido:', membroId, 'Tipo:', typeof membroId);
    console.log('Corpo da requisição:', req.body);
    
    const livro = livros.find(l => l.id === bookId);
    const membro = membros.find(m => m.id === parseInt(membroId));
    
    console.log('Livro encontrado:', livro);
    console.log('Membro encontrado:', membro);
    
    if (!livro) {
        console.log('❌ Livro não encontrado');
        return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    if (!membro) {
        console.log('❌ Membro não encontrado');
        return res.status(404).json({ error: 'Membro não encontrado. IDs disponíveis: ' + membros.map(m => m.id).join(', ') });
    }
    
    if (livro.status !== 'disponivel') {
        console.log('❌ Livro não disponível');
        return res.status(400).json({ error: 'Livro não disponível para empréstimo' });
    }
    
    livro.status = 'emprestado';
    livro.membroId = parseInt(membroId);
    livro.dataEmprestimo = new Date().toISOString().split('T')[0];
    
    console.log('✅ Empréstimo realizado com sucesso!');
    
    res.json({ 
        success: true, 
        message: `Livro "${livro.titulo}" emprestado para ${membro.nome} com sucesso`,
        membroNome: membro.nome
    });
});

app.post('/api/books/:id/devolver', (req, res) => {
    const bookId = parseInt(req.params.id);
    const livro = livros.find(l => l.id === bookId);
    
    if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
    }
    
    livro.status = 'disponivel';
    livro.membroId = null;
    livro.dataEmprestimo = null;
    
    res.json({ 
        success: true, 
        message: 'Livro devolvido com sucesso'
    });
});

// Rotas de Membros
app.get('/api/members', (req, res) => {
    res.json(membros);
});

app.post('/api/members', (req, res) => {
    const { nome, telefone, endereco } = req.body;
    
    if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    const newId = Math.max(...membros.map(m => m.id), 0) + 1;
    const novoMembro = {
        id: newId,
        nome,
        telefone: telefone || '',
        endereco: endereco || ''
    };
    
    membros.push(novoMembro);
    
    res.json({ 
        success: true, 
        message: 'Membro cadastrado com sucesso',
        id: newId 
    });
});

// Servir frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 BiblioComunidade - Sistema de Gestão (Versão Corrigida)`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log(`👤 Admin: admin / 123456`);
    console.log(`📚 ${livros.length} livros carregados`);
    console.log(`👥 ${membros.length} membros cadastrados:`);
    membros.forEach(m => console.log(`   - ID: ${m.id}, Nome: ${m.nome}`));
});
