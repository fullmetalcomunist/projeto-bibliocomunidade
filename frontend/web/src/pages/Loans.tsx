import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Loans.css';

interface Livro {
  id: number;
  title?: string;
  titulo?: string;
  author?: string;
  autor?: string;
  available?: boolean;
  disponivel?: boolean;
}

interface Membro {
  id: number;
  name?: string;
  nome?: string;
  email: string;
  active?: boolean;
  ativo?: boolean;
}

interface Emprestimo {
  id: number;
  bookId?: number;
  livroId?: number;
  memberId?: number;
  membroId?: number;
  loanDate?: string;
  dataEmprestimo?: string;
  returnDate?: string;
  dataDevolucaoPrevista?: string;
  dataDevolucaoReal?: string | null;
  status: 'active' | 'ativo' | 'returned' | 'devolvido' | 'overdue' | 'atrasado';
  renewals?: number;
  renovacoes?: number;
  book?: Livro;
  livro?: Livro;
  member?: Membro;
  membro?: Membro;
}

const Loans: React.FC = () => {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [livrosDisponiveis, setLivrosDisponiveis] = useState<Livro[]>([]);
  const [membrosAtivos, setMembrosAtivos] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'devolvido' | 'atrasado'>('todos');
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [debug, setDebug] = useState<string>('');

  const [novoEmprestimo, setNovoEmprestimo] = useState({
    bookId: '',
    memberId: ''
  });

  useEffect(() => {
    fetchEmprestimos();
    fetchLivrosDisponiveis();
    fetchMembrosAtivos();
  }, [filtroStatus]);

  const ensureArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) return data.data;
      return [data];
    }
    return [];
  };

  const fetchEmprestimos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/loans');
      const emprestimosData = ensureArray(response.data);
      setEmprestimos(emprestimosData);
      setDebug(`✅ Carregados ${emprestimosData.length} empréstimos`);
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      setEmprestimos([]);
      setDebug('❌ Erro ao carregar empréstimos');
    } finally {
      setLoading(false);
    }
  };

  const fetchLivrosDisponiveis = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/books');
      const todosLivros = ensureArray(response.data);
      const disponiveis = todosLivros.filter((livro: Livro) => 
        livro.available !== false && livro.disponivel !== false
      );
      setLivrosDisponiveis(disponiveis);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      setLivrosDisponiveis([]);
    }
  };

  const fetchMembrosAtivos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/members');
      const todosMembros = ensureArray(response.data);
      const ativos = todosMembros.filter((membro: Membro) => 
        membro.active !== false && membro.ativo !== false
      );
      setMembrosAtivos(ativos);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      setMembrosAtivos([]);
    }
  };

  const handleCreateEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDebug('🔄 Criando novo empréstimo...');
      const response = await axios.post('http://localhost:3000/api/loans', {
        bookId: parseInt(novoEmprestimo.bookId),
        memberId: parseInt(novoEmprestimo.memberId)
      });
      
      setDebug('✅ Empréstimo criado com sucesso!');
      alert('📚 Empréstimo realizado com sucesso!');
      setNovoEmprestimo({ bookId: '', memberId: '' });
      setActiveTab('list');
      fetchEmprestimos();
      fetchLivrosDisponiveis();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao realizar empréstimo';
      setDebug(`❌ Erro: ${errorMsg}`);
      alert(errorMsg);
    }
  };

  // TESTAR DIFERENTES ENDPOINTS
  const testarEndpoints = async (emprestimoId: number) => {
    const endpoints = [
      `http://localhost:3000/api/loans/${emprestimoId}/devolver`,
      `http://localhost:3000/api/loans/${emprestimoId}/return`,
      `http://localhost:3000/api/loans/${emprestimoId}/devolucao`,
      `http://localhost:3000/api/emprestimos/${emprestimoId}/devolver`,
      `http://localhost:3000/api/loans/${emprestimoId}`,
    ];

    setDebug('🔍 Testando endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.patch(endpoint);
        setDebug(`✅ Endpoint funcionando: ${endpoint}`);
        return endpoint;
      } catch (error) {
        setDebug(`❌ Endpoint falhou: ${endpoint}`);
      }
    }
    return null;
  };

  const handleDevolucao = async (id: number) => {
    if (window.confirm('Confirmar devolução deste livro?')) {
      try {
        setDebug(`🔄 Tentando devolver empréstimo ${id}...`);
        
        // Tentar diferentes endpoints
        const endpoints = [
          { method: 'PATCH', url: `http://localhost:3000/api/loans/${id}/return` },
          { method: 'PATCH', url: `http://localhost:3000/api/loans/${id}/devolver` },
          { method: 'PUT', url: `http://localhost:3000/api/loans/${id}` },
          { method: 'POST', url: `http://localhost:3000/api/loans/${id}/devolucao` },
        ];

        let success = false;
        
        for (const endpoint of endpoints) {
          try {
            setDebug(`🔍 Tentando: ${endpoint.method} ${endpoint.url}`);
            const response = await axios({
              method: endpoint.method,
              url: endpoint.url,
              data: { status: 'returned' }
            });
            
            setDebug(`✅ Sucesso com: ${endpoint.method} ${endpoint.url}`);
            alert('✅ Devolução registrada com sucesso!');
            fetchEmprestimos();
            fetchLivrosDisponiveis();
            success = true;
            break;
          } catch (error) {
            // Continua para o próximo endpoint
          }
        }

        if (!success) {
          setDebug('❌ Nenhum endpoint de devolução funcionou');
          alert('❌ Endpoint de devolução não encontrado. Verifique o backend.');
        }

      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Erro ao registrar devolução';
        setDebug(`❌ Erro: ${errorMsg}`);
        alert(errorMsg);
      }
    }
  };

  const handleRenovacao = async (id: number) => {
    if (window.confirm('Renovar empréstimo por mais 15 dias?')) {
      try {
        setDebug(`🔄 Tentando renovar empréstimo ${id}...`);
        
        // Tentar diferentes endpoints
        const endpoints = [
          { method: 'PATCH', url: `http://localhost:3000/api/loans/${id}/renew` },
          { method: 'PATCH', url: `http://localhost:3000/api/loans/${id}/renovar` },
          { method: 'PUT', url: `http://localhost:3000/api/loans/${id}` },
          { method: 'POST', url: `http://localhost:3000/api/loans/${id}/renovacao` },
        ];

        let success = false;
        
        for (const endpoint of endpoints) {
          try {
            setDebug(`🔍 Tentando: ${endpoint.method} ${endpoint.url}`);
            const response = await axios({
              method: endpoint.method,
              url: endpoint.url
            });
            
            setDebug(`✅ Sucesso com: ${endpoint.method} ${endpoint.url}`);
            alert('✅ Empréstimo renovado com sucesso!');
            fetchEmprestimos();
            success = true;
            break;
          } catch (error) {
            // Continua para o próximo endpoint
          }
        }

        if (!success) {
          setDebug('❌ Nenhum endpoint de renovação funcionou');
          alert('❌ Endpoint de renovação não encontrado. Verifique o backend.');
        }

      } catch (error: any) {
        const errorMsg = error.response?.data?.error || 'Erro ao renovar empréstimo';
        setDebug(`❌ Erro: ${errorMsg}`);
        alert(errorMsg);
      }
    }
  };

  // Helper functions
  const getLivroNome = (livro: Livro) => livro.title || livro.titulo || 'Livro sem nome';
  const getLivroAutor = (livro: Livro) => livro.author || livro.autor || 'Autor desconhecido';
  const getMembroNome = (membro: Membro) => membro.name || membro.nome || 'Membro sem nome';
  
  const getEmprestimoStatus = (emprestimo: Emprestimo) => {
    const status = emprestimo.status;
    if (status === 'active' || status === 'ativo') return 'ativo';
    if (status === 'returned' || status === 'devolvido') return 'devolvido';
    if (status === 'overdue' || status === 'atrasado') return 'atrasado';
    return status;
  };

  const getStatusInfo = (status: string) => {
    const normalizedStatus = getEmprestimoStatus({ status } as Emprestimo);
    switch (normalizedStatus) {
      case 'ativo': return { color: '#10b981', icon: '📚', label: 'Ativo' };
      case 'atrasado': return { color: '#ef4444', icon: '⏰', label: 'Atrasado' };
      case 'devolvido': return { color: '#6b7280', icon: '✅', label: 'Devolvido' };
      default: return { color: '#6b7280', icon: '📄', label: normalizedStatus };
    }
  };

  const isAtrasado = (emprestimo: Emprestimo) => {
    const devolucaoDate = new Date(emprestimo.returnDate || emprestimo.dataDevolucaoPrevista || '');
    return devolucaoDate < new Date() && getEmprestimoStatus(emprestimo) === 'ativo';
  };

  const emprestimosArray = Array.isArray(emprestimos) ? emprestimos : [];
  
  const emprestimosFiltrados = emprestimosArray.filter(emp => {
    if (filtroStatus === 'todos') return true;
    if (filtroStatus === 'atrasado') {
      return getEmprestimoStatus(emp) === 'ativo' && isAtrasado(emp);
    }
    return getEmprestimoStatus(emp) === filtroStatus;
  });

  const stats = {
    total: emprestimosArray.length,
    ativos: emprestimosArray.filter(emp => getEmprestimoStatus(emp) === 'ativo').length,
    atrasados: emprestimosArray.filter(emp => isAtrasado(emp)).length,
    devolvidos: emprestimosArray.filter(emp => getEmprestimoStatus(emp) === 'devolvido').length
  };

  return (
    <div className="loans-compact">
      {/* Header Compacto */}
      <div className="loans-header-compact">
        <div className="header-content-compact">
          <div className="header-title-compact">
            <h1>📚 Empréstimos</h1>
            <p>Gerencie os empréstimos da biblioteca</p>
          </div>
          <button 
            className="btn-primary-compact"
            onClick={() => setActiveTab('new')}
            disabled={livrosDisponiveis.length === 0 || membrosAtivos.length === 0}
          >
            <span className="btn-icon">➕</span>
            Novo
          </button>
        </div>
      </div>

      {/* Debug Info */}
      {debug && (
        <div className="debug-info">
          <small>{debug}</small>
        </div>
      )}

      {/* Stats Cards Compactos */}
      <div className="stats-grid-compact">
        <div className="stat-card-compact">
          <div className="stat-icon-compact total">📊</div>
          <div className="stat-content-compact">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card-compact">
          <div className="stat-icon-compact active">📚</div>
          <div className="stat-content-compact">
            <span className="stat-number">{stats.ativos}</span>
            <span className="stat-label">Ativos</span>
          </div>
        </div>
        <div className="stat-card-compact">
          <div className="stat-icon-compact overdue">⏰</div>
          <div className="stat-content-compact">
            <span className="stat-number">{stats.atrasados}</span>
            <span className="stat-label">Atrasados</span>
          </div>
        </div>
        <div className="stat-card-compact">
          <div className="stat-icon-compact returned">✅</div>
          <div className="stat-content-compact">
            <span className="stat-number">{stats.devolvidos}</span>
            <span className="stat-label">Devolvidos</span>
          </div>
        </div>
      </div>

      {/* Tabs Compactas */}
      <div className="tabs-compact">
        <button 
          className={`tab-btn-compact ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 Lista
        </button>
        <button 
          className={`tab-btn-compact ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          ➕ Novo
        </button>
      </div>

      {/* Content */}
      <div className="loans-content-compact">
        {activeTab === 'new' ? (
          /* New Loan Form Compact */
          <div className="form-container-compact">
            <div className="form-card-compact">
              <h3>📖 Novo Empréstimo</h3>
              
              <form onSubmit={handleCreateEmprestimo} className="loan-form-compact">
                <div className="form-group-compact">
                  <label>Livro</label>
                  <select 
                    value={novoEmprestimo.bookId}
                    onChange={(e) => setNovoEmprestimo({...novoEmprestimo, bookId: e.target.value})}
                    required
                  >
                    <option value="">Selecione um livro...</option>
                    {livrosDisponiveis.map(livro => (
                      <option key={livro.id} value={livro.id}>
                        {getLivroNome(livro)} - {getLivroAutor(livro)}
                      </option>
                    ))}
                  </select>
                  <div className="form-hint-compact">
                    {livrosDisponiveis.length} disponíveis
                  </div>
                </div>

                <div className="form-group-compact">
                  <label>Membro</label>
                  <select 
                    value={novoEmprestimo.memberId}
                    onChange={(e) => setNovoEmprestimo({...novoEmprestimo, memberId: e.target.value})}
                    required
                  >
                    <option value="">Selecione um membro...</option>
                    {membrosAtivos.map(membro => (
                      <option key={membro.id} value={membro.id}>
                        {getMembroNome(membro)}
                      </option>
                    ))}
                  </select>
                  <div className="form-hint-compact">
                    {membrosAtivos.length} ativos
                  </div>
                </div>

                <div className="form-actions-compact">
                  <button 
                    type="button" 
                    className="btn-secondary-compact"
                    onClick={() => setActiveTab('list')}
                  >
                    ← Voltar
                  </button>
                  <button type="submit" className="btn-primary-compact">
                    Realizar Empréstimo
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Loans List Compact */
          <div className="list-container-compact">
            {/* Filters Compact */}
            <div className="filters-compact">
              <div className="filter-group-compact">
                <label>Status:</label>
                <select 
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as any)}
                  className="filter-select-compact"
                >
                  <option value="todos">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="atrasado">Atrasados</option>
                  <option value="devolvido">Devolvidos</option>
                </select>
              </div>
              <div className="results-count-compact">
                {emprestimosFiltrados.length} de {emprestimosArray.length}
              </div>
            </div>

            {/* Loans Grid Compact */}
            {loading ? (
              <div className="loading-compact">
                <div className="loading-spinner-compact"></div>
                <p>Carregando...</p>
              </div>
            ) : (
              <div className="loans-grid-compact">
                {emprestimosFiltrados.length === 0 ? (
                  <div className="empty-state-compact">
                    <div className="empty-icon">📭</div>
                    <h4>Nenhum empréstimo</h4>
                    <p>
                      {emprestimosArray.length === 0 
                        ? 'Comece criando o primeiro empréstimo' 
                        : 'Tente alterar os filtros'
                      }
                    </p>
                  </div>
                ) : (
                  emprestimosFiltrados.map(emprestimo => {
                    const livro = emprestimo.book || emprestimo.livro;
                    const membro = emprestimo.member || emprestimo.membro;
                    const estaAtrasado = isAtrasado(emprestimo);
                    const statusInfo = getStatusInfo(emprestimo.status);
                    const renovacoes = emprestimo.renewals || emprestimo.renovacoes || 0;

                    return (
                      <div key={emprestimo.id} className="loan-card-compact">
                        <div className="loan-header-compact">
                          <div className="book-info-compact">
                            <h4>{livro ? getLivroNome(livro) : 'Livro'}</h4>
                            <p className="author-compact">{livro ? getLivroAutor(livro) : 'Autor'}</p>
                          </div>
                          <div 
                            className="status-badge-compact"
                            style={{ backgroundColor: statusInfo.color }}
                          >
                            {statusInfo.icon}
                          </div>
                        </div>

                        <div className="loan-details-compact">
                          <div className="detail-row">
                            <span className="detail-label">Membro:</span>
                            <span className="detail-value">{membro ? getMembroNome(membro) : '-'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Empréstimo:</span>
                            <span className="detail-value">
                              {new Date(emprestimo.loanDate || emprestimo.dataEmprestimo || '').toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Devolução:</span>
                            <span className={`detail-value ${estaAtrasado ? 'overdue-text' : ''}`}>
                              {new Date(emprestimo.returnDate || emprestimo.dataDevolucaoPrevista || '').toLocaleDateString('pt-BR')}
                              {estaAtrasado && ' ⚠️'}
                            </span>
                          </div>
                        </div>

                        {getEmprestimoStatus(emprestimo) === 'ativo' && (
                          <div className="loan-actions-compact">
                            <button 
                              className="btn-action-compact renew"
                              onClick={() => handleRenovacao(emprestimo.id)}
                              disabled={renovacoes >= 3}
                              title="Renovar"
                            >
                              🔄
                            </button>
                            <button 
                              className="btn-action-compact return"
                              onClick={() => handleDevolucao(emprestimo.id)}
                              title="Devolver"
                            >
                              ✅
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;
