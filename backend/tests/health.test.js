const request = require('supertest');
const app = require('../src/app');

// Mock da conexão com o banco para testes
jest.mock('../src/config/database', () => ({
  testConnection: jest.fn().mockResolvedValue(true)
}));

jest.mock('../src/models', () => ({
  Book: {},
  Member: {},
  Loan: {}
}));

describe('Health Check API', () => {
  it('GET /api/health should return 200 and status OK', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toContain('BiblioComunidade');
    expect(response.body.timestamp).toBeDefined();
  });

  it('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Bem-vindo');
    expect(response.body.availableEndpoints).toBeDefined();
  });

  it('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Endpoint não encontrado');
  });
});
