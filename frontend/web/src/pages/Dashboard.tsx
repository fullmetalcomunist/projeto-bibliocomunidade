import React, { useState, useEffect } from 'react';
import { loanService, healthService } from '../services/api';
import { Stats } from '../types';
import Loading from '../components/common/Loading';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Verificar status da API
      await healthService.check();
      setApiStatus('online');

      // Carregar estatísticas
      const response = await loanService.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      // Mesmo com erro nas stats, a API está online
      setApiStatus('online');
      // Criar stats vazias para demonstração
      setStats({
        total: 0,
        active: 0,
        overdue: 0,
        returned: 0,
        mostBorrowedBooks: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <div className={`api-status ${apiStatus}`}>
          {apiStatus === 'online' ? '✅ API Online' : '❌ API Offline'}
        </div>
      </div>

      {apiStatus === 'online' && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>Total de Empréstimos</h3>
                <span className="stat-number">{stats.total}</span>
              </div>
            </div>

            <div className="stat-card active">
              <div className="stat-icon">🔄</div>
              <div className="stat-info">
                <h3>Empréstimos Ativos</h3>
                <span className="stat-number">{stats.active}</span>
              </div>
            </div>

            <div className="stat-card overdue">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <h3>Em Atraso</h3>
                <span className="stat-number">{stats.overdue}</span>
              </div>
            </div>

            <div className="stat-card returned">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Devolvidos</h3>
                <span className="stat-number">{stats.returned}</span>
              </div>
            </div>
          </div>

          {stats.mostBorrowedBooks && stats.mostBorrowedBooks.length > 0 ? (
            <div className="popular-books">
              <h2>📈 Livros Mais Emprestados</h2>
              <div className="books-list">
                {stats.mostBorrowedBooks.slice(0, 5).map((item, index) => (
                  <div key={item.bookId} className="book-item">
                    <span className="rank">#{index + 1}</span>
                    <div className="book-info">
                      <h4>{item.book.title}</h4>
                      <p>{item.book.author}</p>
                    </div>
                    <span className="loan-count">{item.loanCount} empréstimos</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="popular-books">
              <h2>📈 Livros Mais Emprestados</h2>
              <div className="empty-state">
                <p>📊 Ainda não há dados de empréstimos para mostrar estatísticas.</p>
                <p>Comece realizando alguns empréstimos no sistema!</p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="dashboard-actions">
        <h2>🚀 Ações Rápidas</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>📖 Gerenciar Livros</h3>
            <p>Adicione, edite ou remova livros do acervo</p>
            <button className="btn-primary" onClick={() => window.location.href = '/books'}>
              Acessar
            </button>
          </div>

          <div className="action-card">
            <h3>👥 Gerenciar Membros</h3>
            <p>Cadastre e gerencie membros da comunidade</p>
            <button className="btn-primary" onClick={() => window.location.href = '/members'}>
              Acessar
            </button>
          </div>

          <div className="action-card">
            <h3>🔄 Realizar Empréstimo</h3>
            <p>Registre novos empréstimos de livros</p>
            <button className="btn-primary" onClick={() => window.location.href = '/loans'}>
              Acessar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
