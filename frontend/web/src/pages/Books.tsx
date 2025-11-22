import React from 'react';

const Books: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>📖 Gerenciar Livros</h1>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '2rem', 
        borderRadius: '8px', 
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>
          Página de livros em desenvolvimento
        </p>
        <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '1rem' }}>
          ✅ Sistema de empréstimos já está funcionando!
        </p>
      </div>
    </div>
  );
};

export default Books;
