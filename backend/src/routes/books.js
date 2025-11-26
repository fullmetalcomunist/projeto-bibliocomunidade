const express = require('express');
const router = express.Router();
const database = require('../database');

// GET - Listar todos os livros
router.get('/', (req, res) => {
    database.all("SELECT * FROM livros ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            console.error('Erro ao buscar livros:', err);
            return res.status(500).json({ error: 'Erro ao buscar livros' });
        }
        res.json(rows);
    });
});

// GET - Estatísticas do dashboard
router.get('/stats', (req, res) => {
    const stats = {};
    
    // Total de livros
    database.get("SELECT COUNT(*) as total FROM livros", (err, row) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        stats.totalLivros = row.total;
        
        // Livros emprestados
        database.get("SELECT COUNT(*) as emprestados FROM livros WHERE status = 'emprestado'", (err, row) => {
            stats.livrosEmprestados = row.emprestados;
            
            // Livros atrasados
            database.get("SELECT COUNT(*) as atrasados FROM livros WHERE status = 'atrasado'", (err, row) => {
                stats.livrosAtrasados = row.atrasados;
                
                // Livros disponíveis
                stats.livrosDisponiveis = stats.totalLivros - stats.livrosEmprestados - stats.livrosAtrasados;
                
                res.json(stats);
            });
        });
    });
});

// POST - Adicionar novo livro
router.post('/', (req, res) => {
    const { titulo, autor, isbn } = req.body;
    
    if (!titulo || !autor) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
    }
    
    database.run(
        "INSERT INTO livros (titulo, autor, isbn, status) VALUES (?, ?, ?, 'disponivel')",
        [titulo, autor, isbn || ''],
        function(err) {
            if (err) {
                console.error('Erro ao adicionar livro:', err);
                return res.status(500).json({ error: 'Erro ao adicionar livro' });
            }
            res.json({ 
                success: true, 
                message: 'Livro adicionado com sucesso',
                id: this.lastID 
            });
        }
    );
});

// POST - Realizar empréstimo
router.post('/:id/emprestar', (req, res) => {
    const bookId = req.params.id;
    const dataDevolucao = new Date();
    dataDevolucao.setDate(dataDevolucao.getDate() + 14); // 2 semanas para devolução
    
    database.run(
        "UPDATE livros SET status = 'emprestado', data_emprestimo = CURRENT_DATE, data_devolucao = ? WHERE id = ? AND status = 'disponivel'",
        [dataDevolucao.toISOString().split('T')[0], bookId],
        function(err) {
            if (err) {
                console.error('Erro ao emprestar livro:', err);
                return res.status(500).json({ error: 'Erro ao emprestar livro' });
            }
            
            if (this.changes === 0) {
                return res.status(400).json({ error: 'Livro não disponível para empréstimo' });
            }
            
            res.json({ 
                success: true, 
                message: 'Livro emprestado com sucesso',
                dataDevolucao: dataDevolucao.toISOString().split('T')[0]
            });
        }
    );
});

// POST - Devolver livro
router.post('/:id/devolver', (req, res) => {
    const bookId = req.params.id;
    
    database.run(
        "UPDATE livros SET status = 'disponivel', data_emprestimo = NULL, data_devolucao = NULL WHERE id = ?",
        [bookId],
        function(err) {
            if (err) {
                console.error('Erro ao devolver livro:', err);
                return res.status(500).json({ error: 'Erro ao devolver livro' });
            }
            
            res.json({ 
                success: true, 
                message: 'Livro devolvido com sucesso'
            });
        }
    );
});

module.exports = router;
