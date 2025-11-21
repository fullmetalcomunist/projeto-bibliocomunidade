const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔗 Conectando ao PostgreSQL...');
console.log('📊 Database:', process.env.DB_NAME);
console.log('👤 User:', process.env.DB_USER);
console.log('🌐 Host:', process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

// Testar conexão com o banco
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    
    // Sincronizar modelos com o banco (NÃO usa force: true para não apagar dados)
    const { Book, Member, Loan } = require('../models');
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados com o PostgreSQL!');
    
    // Verificar se há dados e inserir exemplos se necessário
    await seedDatabase();
  } catch (error) {
    console.error('❌ Erro ao conectar com o PostgreSQL:', error.message);
    console.log('💡 Dica: Verifique se:');
    console.log('   1. PostgreSQL está rodando');
    console.log('   2. Banco "bibliocomunidade" existe');
    console.log('   3. Credenciais no .env estão corretas');
    console.log('   4. Usuário tem permissões no banco');
    process.exit(1);
  }
};

// Função para popular o banco com dados de exemplo
const seedDatabase = async () => {
  try {
    const { Book, Member, Loan } = require('../models');
    
    const bookCount = await Book.count();
    if (bookCount === 0) {
      console.log('📚 Inserindo dados de exemplo no PostgreSQL...');
      
      // Inserir livros
      const books = await Book.bulkCreate([
        {
          title: 'O Pequeno Príncipe',
          author: 'Antoine de Saint-Exupéry',
          category: 'Literatura Infantil',
          available: true,
          location: 'Prateleira A1',
          description: 'Um clássico da literatura infantil mundial'
        },
        {
          title: 'Dom Casmurro',
          author: 'Machado de Assis', 
          category: 'Literatura Brasileira',
          available: true,
          location: 'Prateleira B2',
          description: 'Romance clássico da literatura brasileira'
        },
        {
          title: 'A Moreninha',
          author: 'Joaquim Manuel de Macedo',
          category: 'Romance',
          available: true,
          location: 'Prateleira C3',
          description: 'Primeiro romance romântico brasileiro'
        }
      ]);
      
      // Inserir membros
      const members = await Member.bulkCreate([
        {
          name: 'Maria Silva',
          email: 'maria.silva@email.com',
          phone: '85999999999',
          address: 'Rua Professor José Ellery, 123 - Bairro Ellery, Fortaleza-CE'
        },
        {
          name: 'João Santos',
          email: 'joao.santos@email.com', 
          phone: '85888888888',
          address: 'Rua A, 456 - Bairro Ellery, Fortaleza-CE'
        }
      ]);
      
      console.log(`✅ ${books.length} livros inseridos`);
      console.log(`✅ ${members.length} membros inseridos`);
      console.log('🎉 Banco PostgreSQL pronto para uso!');
    } else {
      console.log(`📊 Banco já contém: ${bookCount} livros`);
    }
  } catch (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
  }
};

module.exports = { sequelize, testConnection };
