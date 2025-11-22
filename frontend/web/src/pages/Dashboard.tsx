import React, { useState, useEffect } from 'react';
import { emprestimoService, livroService, memberService } from '../services/api';
import Loading from '../components/common/Loading';
import './Dashboard.css';

interface Stats {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  mostBorrowedBooks: Array<{
    bookId: number;
    title: string;
    author: string;
    borrowCount: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0,
    overdueLoans: 0,
    mostBorrowedBooks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Buscando dados do dashboard...');

      // Buscar dados em paralelo
      const [booksResponse, membersResponse, loansResponse] = await Promise.all([
        livroService.getAll(),
        memberService.getAll(),
        emprestimoService.getAll()
      ]);

      const books = booksResponse.data || [];
      const members = membersResponse.data || [];
      const loans = loansResponse.data || [];

      console.log('📊 Dados recebidos:', {
        books: books.length,
        members: members.length,
        loans: loans.length
      });

      // Calcular estatísticas
      const activeLoans = loans.filter((loan: any) => loan.status === 'active' || loan.status === 'ativo');
      const overdueLoans = activeLoans.filter((loan: any) => {
        const devolucaoDate = new Date(loan.returnDate || loan.dataDevolucaoPrevista);
        return devolucaoDate < new Date();
      });

      console.log('📈 Estatísticas calculadas:', {
        activeLoans: activeLoans.length,
        overdueLoans: overdueLoans.length
      });

      // Calcular livros mais emprestados
      const bookBorrowCount: { [key: number]: number } = {};
      loans.forEach((loan: any) => {
        const bookId = loan.bookId || loan.livroId;
        if (bookId) {
          bookBorrowCount[bookId] = (bookBorrowCount[bookId] || 0) + 1;
        }
      });

      const mostBorrowedBooks = Object.entries(bookBorrowCount)
        .map(([bookId, count]) => {
          const book = books.find((b: any) => b.id === parseInt(bookId));
          return book ? {
            bookId: book.id,
            title: book.title || book.titulo,
            author: book.author || book.autor,
            borrowCount: count
          } : null;
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.borrowCount - a.borrowCount)
        .slice(0, 5);

      setStats({
        totalBooks: books.length,
        totalMembers: members.length,
        activeLoans: activeLoans.length,
        overdueLoans: overdueLoans.length,
        mostBorrowedBooks: mostBorrowedBooks as any
      });

      console.log('✅ Dashboard atualizado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error);
      setError('Erro ao carregar dados do dashboard. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>❌ Erro</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData} className="btn-retry">
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🏠 Dashboard - BiblioComunidade</h1>
        <p>Visão geral da biblioteca comunitária</p>
        <button onClick={fetchDashboardData} className="btn-refresh">
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Estatísticas Principais */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total de Livros</h3>
            <span className="stat-number">{stats.totalBooks}</span>
            <small>No banco de dados</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total de Membros</h3>
            <span className="stat-number">{stats.totalMembers}</span>
            <small>Cadastrados</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>Empréstimos Ativos</h3>
            <span className="stat-number">{stats.activeLoans}</span>
            <small>Em andamento</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Em Atraso</h3>
            <span className="stat-number">{stats.overdueLoans}</span>
            <small>Precisa de atenção</small>
          </div>
        </div>
      </div>

      {/* Conteúdo Adicional */}
      <div className="dashboard-content">
        {/* Livros Mais Emprestados */}
        {stats.mostBorrowedBooks.length > 0 && (
          <div className="dashboard-section">
            <h2>📈 Livros Mais Emprestados</h2>
            <div className="books-list">
              {stats.mostBorrowedBooks.slice(0, 5).map((item: any, index: number) => (
                <div key={item.bookId} className="book-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="book-info">
                    <h4>{item.title}</h4>
                    <p>{item.author}</p>
                  </div>
                  <span className="borrow-count">{item.borrowCount} {item.borrowCount === 1 ? 'empréstimo' : 'empréstimos'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="dashboard-section">
          <h2>📋 Ações Rápidas</h2>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/books'}
            >
              <span className="action-icon">➕</span>
              <span>Cadastrar Livro</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/members'}
            >
              <span className="action-icon">👤</span>
              <span>Cadastrar Membro</span>
            </button>
            <button 
              className="action-btn"
              onClick={() => window.location.href = '/loans'}
            >
              <span className="action-icon">📖</span>
              <span>Novo Empréstimo</span>
            </button>
            <button 
              className="action-btn"
              onClick={fetchDashboardData}
            >
              <span className="action-icon">🔄</span>
              <span>Atualizar Dados</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
