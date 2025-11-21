import axios from 'axios';

// URL da API - garantir que está correta
const API_BASE_URL = 'http://localhost:3000/api';

console.log('🔗 Configurando API com URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para logging de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro no request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta da API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    });
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      alert('❌ Não foi possível conectar com o servidor backend.\n\nVerifique se:\n1. O backend está rodando (npm run dev no folder backend)\n2. A URL http://localhost:3000 está acessível\n3. Não há bloqueio de CORS');
    }
    
    return Promise.reject(error);
  }
);

// Serviço para Livros
export const bookService = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/books?page=${page}&limit=${limit}`),
  
  getById: (id: number) => 
    api.get(`/books/${id}`),
  
  create: (bookData: any) => 
    api.post('/books', bookData),
  
  update: (id: number, bookData: any) => 
    api.put(`/books/${id}`, bookData),
  
  delete: (id: number) => 
    api.delete(`/books/${id}`),
  
  search: (query: string, category?: string) => 
    api.get(`/books/search?q=${encodeURIComponent(query)}${category ? `&category=${encodeURIComponent(category)}` : ''}`),
  
  getAvailable: () => 
    api.get('/books/available'),
  
  getByCategory: (category: string) => 
    api.get(`/books/category/${encodeURIComponent(category)}`)
};

// Serviço para Membros
export const memberService = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/members?page=${page}&limit=${limit}`),
  
  getById: (id: number) => 
    api.get(`/members/${id}`),
  
  create: (memberData: any) => 
    api.post('/members', memberData),
  
  update: (id: number, memberData: any) => 
    api.put(`/members/${id}`, memberData),
  
  delete: (id: number) => 
    api.delete(`/members/${id}`),
  
  search: (query: string) => 
    api.get(`/members/search?q=${encodeURIComponent(query)}`),
  
  getActive: () => 
    api.get('/members/active'),
  
  suspend: (id: number) => 
    api.put(`/members/${id}/suspend`),
  
  activate: (id: number) => 
    api.put(`/members/${id}/activate`)
};

// Serviço para Empréstimos
export const loanService = {
  getAll: (page = 1, limit = 10, status?: string) => 
    api.get(`/loans?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`),
  
  getById: (id: number) => 
    api.get(`/loans/${id}`),
  
  create: (loanData: any) => 
    api.post('/loans', loanData),
  
  returnBook: (id: number) => 
    api.put(`/loans/${id}/return`),
  
  getActive: () => 
    api.get('/loans/active'),
  
  getOverdue: () => 
    api.get('/loans/overdue'),
  
  getByMember: (memberId: number) => 
    api.get(`/loans/member/${memberId}`),
  
  getByBook: (bookId: number) => 
    api.get(`/loans/book/${bookId}`),
  
  getStats: () => 
    api.get('/loans/stats')
};

// Health Check
export const healthService = {
  check: () => api.get('/health')
};

export default api;
