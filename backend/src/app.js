const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());

// Configuração CORS MUITO PERMISSIVA para desenvolvimento
app.use(cors({
  origin: true, // Permite qualquer origem
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// Configurar banco e modelos
const { testConnection } = require('./config/database');
const { Book, Member, Loan } = require('./models');

// Testar conexão com banco ao iniciar
testConnection().then(() => {
  console.log('✅ Models carregados com sucesso!');
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: '🚀 BiblioComunidade API está funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    database: 'PostgreSQL'
  });
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

// Rota de boas-vindas
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API BiblioComunidade!',
    description: 'Sistema de gestão para bibliotecas comunitárias',
    version: '1.0.0',
    database: 'PostgreSQL',
    documentation: '/api/health'
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint não encontrado',
    message: `A rota ${req.originalUrl} não existe nesta API.`,
    availableRoutes: ['/api/health', '/api/books', '/api/members', '/api/loans']
  });
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('📚 BIBLIOCOMUNIDADE BACKEND - UNIFOR N708');
  console.log('='.repeat(60));
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊 Database: PostgreSQL`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('🌐 CORS: Habilitado para todas as origens');
  console.log('='.repeat(60));
});

module.exports = app;
