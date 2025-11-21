-- BIBLIOCOMUNIDADE - Script de Criação do Banco de Dados
-- UNIFOR - Projeto Aplicado Multiplataforma N708

-- Criar banco de dados
CREATE DATABASE bibliocomunidade;

-- Conectar ao banco criado
\c bibliocomunidade;

-- Extensão para UUID (opcional, para futuras melhorias)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Livros
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    publisher VARCHAR(255),
    publication_year INTEGER,
    category VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    location VARCHAR(100),
    description TEXT,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Membros
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Empréstimos
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE RESTRICT,
    member_id INTEGER REFERENCES members(id) ON DELETE RESTRICT,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_available ON books(available);
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_due_date ON loans(due_date);
CREATE INDEX idx_loans_book_id ON loans(book_id);
CREATE INDEX idx_loans_member_id ON loans(member_id);

-- Dados de exemplo para testes
INSERT INTO books (title, author, category, available, location) VALUES
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Literatura Infantil', true, 'Prateleira A1'),
('Dom Casmurro', 'Machado de Assis', 'Literatura Brasileira', true, 'Prateleira B2'),
('A Moreninha', 'Joaquim Manuel de Macedo', 'Romance', true, 'Prateleira C3'),
('Iracema', 'José de Alencar', 'Literatura Brasileira', true, 'Prateleira B2'),
('O Cortiço', 'Aluísio Azevedo', 'Literatura Brasileira', true, 'Prateleira B2'),
('Sítio do Picapau Amarelo', 'Monteiro Lobato', 'Literatura Infantil', true, 'Prateleira A1'),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'Fantasia', true, 'Prateleira D4'),
('O Alquimista', 'Paulo Coelho', 'Ficção', true, 'Prateleira C3');

INSERT INTO members (name, email, phone, address) VALUES
('Maria Silva', 'maria.silva@email.com', '(85) 99999-9999', 'Rua Professor José Ellery, 123 - Bairro Ellery'),
('João Santos', 'joao.santos@email.com', '(85) 98888-8888', 'Rua A, 456 - Bairro Ellery'),
('Ana Oliveira', 'ana.oliveira@email.com', '(85) 97777-7777', 'Rua B, 789 - Bairro Ellery'),
('Pedro Costa', 'pedro.costa@email.com', '(85) 96666-6666', 'Rua C, 321 - Bairro Ellery');

INSERT INTO loans (book_id, member_id, due_date, status) VALUES
(1, 1, '2024-12-25', 'active'),
(2, 2, '2024-12-20', 'active'),
(3, 3, '2024-12-18', 'active');

-- View para empréstimos ativos
CREATE VIEW active_loans AS
SELECT 
    l.id,
    l.loan_date,
    l.due_date,
    b.title as book_title,
    b.author as book_author,
    m.name as member_name,
    m.email as member_email
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.status = 'active';

-- View para livros mais populares
CREATE VIEW popular_books AS
SELECT 
    b.id,
    b.title,
    b.author,
    b.category,
    COUNT(l.id) as loans_count
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.author, b.category
ORDER BY loans_count DESC;

-- Mensagem de sucesso
DO $$ 
BEGIN
    RAISE NOTICE '✅ Banco de dados BiblioComunidade criado com sucesso!';
    RAISE NOTICE '📚 Livros inseridos: %', (SELECT COUNT(*) FROM books);
    RAISE NOTICE '👥 Membros inseridos: %', (SELECT COUNT(*) FROM members);
    RAISE NOTICE '📖 Empréstimos ativos: %', (SELECT COUNT(*) FROM loans WHERE status = 'active');
END $$;
