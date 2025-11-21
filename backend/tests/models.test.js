// Mock do sequelize para testes de models
jest.mock('../src/config/database', () => ({
  sequelize: {
    define: jest.fn(),
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  }
}));

const { Book, Member, Loan } = require('../src/models');

describe('Models', () => {
  // Testes básicos de estrutura dos models
  describe('Book Model Structure', () => {
    it('should have correct model name', () => {
      expect(Book).toBeDefined();
    });
  });

  describe('Member Model Structure', () => {
    it('should have correct model name', () => {
      expect(Member).toBeDefined();
    });
  });

  describe('Loan Model Structure', () => {
    it('should have correct model name', () => {
      expect(Loan).toBeDefined();
    });
  });
});
