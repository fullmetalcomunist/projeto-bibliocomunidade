const request = require('supertest');

// Mock do console para evitar logs durante testes
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

// Mock completo do banco para testes
jest.mock('../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    fn: jest.fn(),
    col: jest.fn()
  },
  testConnection: jest.fn().mockResolvedValue(true)
}));

// Mock dos models com implementações mais robustas
const mockBookInstance = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  available: true,
  isAvailable: jest.fn().mockReturnValue(true),
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true)
};

const mockMemberInstance = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active',
  canBorrow: jest.fn().mockReturnValue(true),
  save: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true)
};

const mockLoanInstance = {
  id: 1,
  bookId: 1,
  memberId: 1,
  status: 'active',
  returnBook: jest.fn().mockResolvedValue(true),
  save: jest.fn().mockResolvedValue(true)
};

// Mock functions
const mockBookCreate = jest.fn();
const mockMemberCreate = jest.fn();
const mockLoanCreate = jest.fn();
const mockBookFindByPk = jest.fn();
const mockMemberFindByPk = jest.fn();
const mockLoanFindByPk = jest.fn();
const mockBookFindAll = jest.fn();
const mockMemberFindAll = jest.fn();
const mockLoanFindAll = jest.fn();
const mockBookFindOne = jest.fn();
const mockMemberFindOne = jest.fn();
const mockLoanCount = jest.fn();
const mockBookCount = jest.fn();
const mockMemberCount = jest.fn();

jest.mock('../src/models', () => {
  const originalModule = jest.requireActual('../src/models');
  
  return {
    ...originalModule,
    Book: {
      create: mockBookCreate,
      findByPk: mockBookFindByPk,
      findAll: mockBookFindAll,
      findOne: mockBookFindOne,
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
      count: mockBookCount,
      findAvailable: jest.fn().mockResolvedValue([]),
      findByCategory: jest.fn().mockResolvedValue([]),
      search: jest.fn().mockResolvedValue([])
    },
    Member: {
      create: mockMemberCreate,
      findByPk: mockMemberFindByPk,
      findAll: mockMemberFindAll,
      findOne: mockMemberFindOne,
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
      count: mockMemberCount,
      findActive: jest.fn().mockResolvedValue([]),
      search: jest.fn().mockResolvedValue([])
    },
    Loan: {
      create: mockLoanCreate,
      findByPk: mockLoanFindByPk,
      findAll: mockLoanFindAll,
      findOne: jest.fn().mockResolvedValue(null),
      count: mockLoanCount,
      findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
      findActive: jest.fn().mockResolvedValue([]),
      findOverdue: jest.fn().mockResolvedValue([]),
      findByMember: jest.fn().mockResolvedValue([]),
      findByBook: jest.fn().mockResolvedValue([])
    }
  };
});

const app = require('../src/app');

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks padrão para sucesso
    mockBookCreate.mockResolvedValue(mockBookInstance);
    mockMemberCreate.mockResolvedValue(mockMemberInstance);
    mockLoanCreate.mockResolvedValue(mockLoanInstance);
    
    mockBookFindByPk.mockResolvedValue(mockBookInstance);
    mockMemberFindByPk.mockResolvedValue(mockMemberInstance);
    mockLoanFindByPk.mockResolvedValue(mockLoanInstance);
    
    mockBookFindAll.mockResolvedValue([mockBookInstance]);
    mockMemberFindAll.mockResolvedValue([mockMemberInstance]);
    mockLoanFindAll.mockResolvedValue([mockLoanInstance]);
    
    mockBookFindOne.mockResolvedValue(null); // Nenhum conflito
    mockMemberFindOne.mockResolvedValue(null); // Nenhum conflito
    
    mockBookCount.mockResolvedValue(0);
    mockMemberCount.mockResolvedValue(0);
    mockLoanCount.mockResolvedValue(0);
  });

  describe('Health Check', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toContain('BiblioComunidade');
    });
  });

  describe('Books API', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'Fiction'
      };

      const response = await request(app)
        .post('/api/books')
        .send(bookData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Book');
    });

    it('should get all books', async () => {
      const response = await request(app).get('/api/books');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Members API', () => {
    it('should create a new member', async () => {
      const memberData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/api/members')
        .send(memberData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
    });

    it('should get all members', async () => {
      const response = await request(app).get('/api/members');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors when creating book', async () => {
      // Mock para simular erro de validação
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{ message: 'Título é obrigatório' }];
      
      mockBookCreate.mockRejectedValue(validationError);

      const response = await request(app)
        .post('/api/books')
        .send({}); // Dados vazios para causar erro

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle member not found', async () => {
      mockMemberFindByPk.mockResolvedValue(null); // Membro não encontrado

      const response = await request(app).get('/api/members/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
