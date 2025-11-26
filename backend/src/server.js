const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/web')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Servir frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/web/dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 BiblioComunidade - Sistema de Gestão`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
});
