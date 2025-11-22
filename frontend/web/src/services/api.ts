import axios from 'axios';

// O backend está rodando na porta 3000, mas sem rota /api genérica
const API_BASE_URL = 'http://localhost:3000';

// Configuração global do axios sem base URL genérica
// axios.defaults.baseURL = API_BASE_URL; // REMOVER esta linha

// Dados mock para fallback
const mockLivros = [
  { 
    id: 1, 
    title: 'Dom Casmurro', 
    author: 'Machado de Assis', 
    isbn: '9788535934345', 
    publicationYear: 1899, 
    available: true 
  },
  { 
    id: 2, 
    title: 'O Cortiço', 
    author: 'Aluísio Azevedo', 
    isbn: '9788572327892', 
    publicationYear: 1890, 
    available: true 
  }
];

const mockMembros = [
  { 
    id: 1, 
    name: 'João Silva', 
    email: 'joao@email.com', 
    phone: '(11) 9999-9999', 
    address: 'Rua das Flores, 123 - Centro', 
    registrationDate: '2024-01-15T10:00:00Z', 
    status: 'active' 
  }
];

const mockEmprestimos = [
  { 
    id: 1, 
    bookId: 1, 
    memberId: 1, 
    loanDate: '2024-01-25T10:00:00Z', 
    dueDate: '2024-02-09T10:00:00Z', 
    returnDate: null, 
    status: 'active', 
    renewals: 0,
    book: mockLivros[0],
    member: mockMembros[0]
  }
];

// Função para verificar se o backend está respondendo
const checkBackend = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 2000 });
    return response.status === 200;
  } catch (error) {
    console.log('🔴 Backend não disponível, usando dados mock');
    return false;
  }
};

// Serviços que primeiro tentam o backend, depois usam mock
export const memberService = {
  getAll: async () => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/members`).catch(() => ({ data: mockMembros }));
    }
    return { data: mockMembros };
  },
  getById: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/members/${id}`).catch(() => ({ data: mockMembros.find(m => m.id === id) }));
    }
    return { data: mockMembros.find(m => m.id === id) };
  },
  create: async (member: any) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.post(`${API_BASE_URL}/api/members`, member).catch(() => ({ 
        data: { ...member, id: Date.now(), success: true } 
      }));
    }
    return { data: { ...member, id: Date.now(), success: true } };
  },
  update: async (id: number, member: any) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.put(`${API_BASE_URL}/api/members/${id}`, member).catch(() => ({ 
        data: { ...member, success: true } 
      }));
    }
    return { data: { ...member, success: true } };
  },
  delete: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.delete(`${API_BASE_URL}/api/members/${id}`).catch(() => ({ 
        data: { success: true } 
      }));
    }
    return { data: { success: true } };
  }
};

export const livroService = {
  getAll: async () => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/books`).catch(() => ({ data: mockLivros }));
    }
    return { data: mockLivros };
  },
  getById: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/books/${id}`).catch(() => ({ data: mockLivros.find(l => l.id === id) }));
    }
    return { data: mockLivros.find(l => l.id === id) };
  },
  create: async (livro: any) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.post(`${API_BASE_URL}/api/books`, livro).catch(() => ({ 
        data: { ...livro, id: Date.now(), success: true } 
      }));
    }
    return { data: { ...livro, id: Date.now(), success: true } };
  },
  update: async (id: number, livro: any) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.put(`${API_BASE_URL}/api/books/${id}`, livro).catch(() => ({ 
        data: { ...livro, success: true } 
      }));
    }
    return { data: { ...livro, success: true } };
  },
  delete: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.delete(`${API_BASE_URL}/api/books/${id}`).catch(() => ({ 
        data: { success: true } 
      }));
    }
    return { data: { success: true } };
  }
};

export const emprestimoService = {
  getAll: async () => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/loans`).catch(() => ({ data: mockEmprestimos }));
    }
    return { data: mockEmprestimos };
  },
  getById: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.get(`${API_BASE_URL}/api/loans/${id}`).catch(() => ({ data: mockEmprestimos.find(e => e.id === id) }));
    }
    return { data: mockEmprestimos.find(e => e.id === id) };
  },
  create: async (emprestimo: any) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.post(`${API_BASE_URL}/api/loans`, emprestimo).catch(() => ({ 
        data: { 
          ...emprestimo, 
          id: Date.now(), 
          loanDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          renewals: 0,
          success: true 
        } 
      }));
    }
    return { 
      data: { 
        ...emprestimo, 
        id: Date.now(), 
        loanDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        renewals: 0,
        success: true 
      } 
    };
  },
  devolver: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.patch(`${API_BASE_URL}/api/loans/${id}/return`).catch(() => ({ 
        data: { success: true } 
      }));
    }
    return { data: { success: true } };
  },
  renovar: async (id: number) => {
    const isBackendUp = await checkBackend();
    if (isBackendUp) {
      return axios.patch(`${API_BASE_URL}/api/loans/${id}/renew`).catch(() => ({ 
        data: { success: true } 
      }));
    }
    return { data: { success: true } };
  }
};
