const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔗 Testando conexão com a API...');
    
    const response = await axios.get('http://localhost:3000/api/health', {
      timeout: 5000
    });
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    // Testar livros
    const booksResponse = await axios.get('http://localhost:3000/api/books');
    console.log('📚 Livros:', booksResponse.data.data.length);
    
  } catch (error) {
    console.error('❌ Erro na conexão:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testConnection();
