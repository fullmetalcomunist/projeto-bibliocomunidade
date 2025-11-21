// Setup global para testes
jest.setTimeout(30000);

// Mock do console.log para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};
