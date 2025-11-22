// Arquivo temporário para debug - pode remover depois
import axios from 'axios';

export const debugBackendData = async () => {
  try {
    console.log('🔍 DEBUG: Verificando estrutura dos dados do backend...');
    
    const [books, members, loans] = await Promise.all([
      axios.get('http://localhost:3000/api/books'),
      axios.get('http://localhost:3000/api/members'),
      axios.get('http://localhost:3000/api/loans')
    ]);

    console.log('📚 LIVROS (primeiro item):', books.data[0]);
    console.log('👥 MEMBROS (primeiro item):', members.data[0]);
    console.log('🔄 EMPRÉSTIMOS (primeiro item):', loans.data[0]);
    console.log('📊 TOTAL EMPRÉSTIMOS:', loans.data.length);
    console.log('🔧 TIPO DE EMPRÉSTIMOS:', typeof loans.data, Array.isArray(loans.data));

    return { books: books.data, members: members.data, loans: loans.data };
  } catch (error) {
    console.error('❌ DEBUG Error:', error);
    return null;
  }
};

// Execute no console do navegador para debug
// debugBackendData();
