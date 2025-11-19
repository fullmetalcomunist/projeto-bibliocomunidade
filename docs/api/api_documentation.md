# Documentação da API - BiblioComunidade

## 🔗 Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## 📋 Autenticação
A API usa autenticação via JWT (JSON Web Token). Inclua o token no header das requisições:

\`\`\`http
Authorization: Bearer <seu_jwt_token>
\`\`\`

## 📚 Endpoints - Livros

### GET /books
Lista todos os livros com paginação e filtros

**Query Parameters:**
- \`page\` (opcional): Número da página (padrão: 1)
- \`limit\` (opcional): Itens por página (padrão: 10)
- \`available\` (opcional): Filtrar por disponibilidade (true/false)
- \`category\` (opcional): Filtrar por categoria

**Exemplo de Request:**
\`\`\`http
GET /books?page=1&limit=10&available=true&category=Literatura
\`\`\`

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "title": "O Pequeno Príncipe",
      "author": "Antoine de Saint-Exupéry",
      "isbn": "9788595081512",
      "publisher": "Editora Garnier",
      "publicationYear": 1943,
      "category": "Literatura Infantil",
      "available": true,
      "location": "Prateleira A1",
      "description": "Um piloto cai com seu avião no deserto...",
      "observations": "Capa um pouco desgastada",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "filters": {
    "available": true,
    "category": "Literatura"
  }
}
\`\`\`

### POST /books
Cadastra um novo livro no sistema

**Request:**
\`\`\`http
POST /books
Content-Type: application/json

{
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "isbn": "9788535934231",
  "publisher": "Editora Antofágica",
  "publicationYear": 1899,
  "category": "Literatura Brasileira",
  "location": "Prateleira B2",
  "description": "Romance clássico da literatura brasileira...",
  "observations": "Edição especial"
}
\`\`\`

**Campos Obrigatórios:**
- \`title\` (string): Título do livro
- \`author\` (string): Autor do livro

**Response (201):**
\`\`\`json
{
  "id": 2,
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "isbn": "9788535934231",
  "publisher": "Editora Antofágica",
  "publicationYear": 1899,
  "category": "Literatura Brasileira",
  "available": true,
  "location": "Prateleira B2",
  "description": "Romance clássico da literatura brasileira...",
  "observations": "Edição especial",
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
\`\`\`

### GET /books/search
Busca livros por termo

**Query Parameters:**
- \`q\` (obrigatório): Termo de busca
- \`category\` (opcional): Filtrar por categoria

**Exemplo:**
\`\`\`http
GET /books/search?q=principe&category=Infantil
\`\`\`

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "title": "O Pequeno Príncipe",
      "author": "Antoine de Saint-Exupéry",
      "category": "Literatura Infantil",
      "available": true,
      "location": "Prateleira A1"
    }
  ],
  "total": 1,
  "query": "principe",
  "filters": {
    "category": "Infantil"
  }
}
\`\`\`

### GET /books/:id
Obtém detalhes de um livro específico

**Response (200):**
\`\`\`json
{
  "id": 1,
  "title": "O Pequeno Príncipe",
  "author": "Antoine de Saint-Exupéry",
  "isbn": "9788595081512",
  "publisher": "Editora Garnier",
  "publicationYear": 1943,
  "category": "Literatura Infantil",
  "available": true,
  "location": "Prateleira A1",
  "description": "Um piloto cai com seu avião no deserto...",
  "observations": "Capa um pouco desgastada",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "loanHistory": [
    {
      "loanDate": "2024-01-10",
      "returnDate": "2024-01-20",
      "memberName": "Maria Silva"
    }
  ]
}
\`\`\`

## 👥 Endpoints - Membros

### GET /members
Lista todos os membros

**Query Parameters:**
- \`status\` (opcional): Filtrar por status (active/inactive)
- \`page\` (opcional): Paginação

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "Maria Silva",
      "email": "maria.silva@email.com",
      "phone": "(85) 99999-9999",
      "address": "Rua Professor José Ellery, 123 - Bairro Ellery",
      "registrationDate": "2024-01-10",
      "status": "active",
      "loansCount": 3,
      "activeLoans": 1,
      "createdAt": "2024-01-10T14:30:00Z",
      "updatedAt": "2024-01-15T09:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
\`\`\`

### POST /members
Cadastra novo membro

**Request:**
\`\`\`http
POST /members
Content-Type: application/json

{
  "name": "João Santos",
  "email": "joao.santos@email.com",
  "phone": "(85) 98888-8888",
  "address": "Rua B, 456 - Bairro Ellery"
}
\`\`\`

**Campos Obrigatórios:**
- \`name\` (string): Nome completo do membro

**Response (201):**
\`\`\`json
{
  "id": 2,
  "name": "João Santos",
  "email": "joao.santos@email.com",
  "phone": "(85) 98888-8888",
  "address": "Rua B, 456 - Bairro Ellery",
  "registrationDate": "2024-01-15",
  "status": "active",
  "createdAt": "2024-01-15T11:30:00Z",
  "updatedAt": "2024-01-15T11:30:00Z"
}
\`\`\`

## 📖 Endpoints - Empréstimos

### GET /loans
Lista empréstimos com filtros

**Query Parameters:**
- \`status\` (opcional): active, returned, overdue
- \`memberId\` (opcional): Filtrar por membro
- \`page\` (opcional): Paginação

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "bookId": 1,
      "memberId": 1,
      "loanDate": "2024-01-15",
      "dueDate": "2024-01-30",
      "returnDate": null,
      "status": "active",
      "daysLate": 0,
      "book": {
        "title": "O Pequeno Príncipe",
        "author": "Antoine de Saint-Exupéry"
      },
      "member": {
        "name": "Maria Silva",
        "phone": "(85) 99999-9999"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
\`\`\`

### POST /loans
Realiza novo empréstimo

**Request:**
\`\`\`http
POST /loans
Content-Type: application/json

{
  "bookId": 1,
  "memberId": 1,
  "dueDate": "2024-02-15"
}
\`\`\`

**Validações:**
- Livro deve estar disponível
- Membro deve estar ativo
- Membro não pode ter mais de 3 empréstimos ativos
- Data de devolução não pode ser mais que 30 dias no futuro

**Response (201):**
\`\`\`json
{
  "id": 1,
  "bookId": 1,
  "memberId": 1,
  "loanDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "returnDate": null,
  "status": "active",
  "book": {
    "title": "O Pequeno Príncipe",
    "author": "Antoine de Saint-Exupéry"
  },
  "member": {
    "name": "Maria Silva"
  },
  "createdAt": "2024-01-15T11:00:00Z",
  "updatedAt": "2024-01-15T11:00:00Z"
}
\`\`\`

### PUT /loans/:id/return
Registra devolução de empréstimo

**Response (200):**
\`\`\`json
{
  "id": 1,
  "returnDate": "2024-01-20",
  "status": "returned",
  "daysLate": 0,
  "book": {
    "title": "O Pequeno Príncipe",
    "author": "Antoine de Saint-Exupéry"
  },
  "member": {
    "name": "Maria Silva"
  }
}
\`\`\`

## 📊 Endpoints - Relatórios

### GET /reports/popular-books
Livros mais emprestados em um período

**Query Parameters:**
- \`startDate\` (opcional): Data inicial (YYYY-MM-DD)
- \`endDate\` (opcional): Data final (YYYY-MM-DD)
- \`limit\` (opcional): Quantidade de livros (padrão: 10)

**Response (200):**
\`\`\`json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "data": [
    {
      "bookId": 1,
      "title": "O Pequeno Príncipe",
      "author": "Antoine de Saint-Exupéry",
      "loansCount": 15,
      "category": "Literatura Infantil"
    }
  ],
  "totalLoans": 125,
  "generatedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

### GET /reports/overdue-loans
Empréstimos em atraso

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 5,
      "bookTitle": "Dom Casmurro",
      "memberName": "João Santos",
      "dueDate": "2024-01-10",
      "daysLate": 5,
      "memberPhone": "(85) 98888-8888"
    }
  ],
  "totalOverdue": 3,
  "generatedAt": "2024-01-15T12:00:00Z"
}
\`\`\`

## 🩺 Health Check

### GET /health
Verifica status da API e dependências

**Response (200):**
\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "dependencies": {
    "database": "connected",
    "memoryUsage": "45%",
    "uptime": "7 days, 12 hours"
  }
}
\`\`\`

## ⚠️ Códigos de Erro

### 400 - Bad Request
\`\`\`json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados de entrada inválidos",
  "details": [
    {
      "field": "email",
      "message": "Email deve ter formato válido"
    }
  ]
}
\`\`\`

### 404 - Not Found
\`\`\`json
{
  "error": "RESOURCE_NOT_FOUND",
  "message": "Livro não encontrado",
  "resource": "books",
  "id": 999
}
\`\`\`

### 409 - Conflict
\`\`\`json
{
  "error": "RESOURCE_CONFLICT",
  "message": "ISBN já cadastrado no sistema",
  "resource": "books",
  "field": "isbn"
}
\`\`\`

### 422 - Unprocessable Entity
\`\`\`json
{
  "error": "BUSINESS_RULE_VIOLATION",
  "message": "Membro atingiu limite máximo de empréstimos",
  "rule": "MAX_LOANS_PER_MEMBER",
  "details": {
    "memberId": 1,
    "currentLoans": 3,
    "maxLoans": 3
  }
}
\`\`\`

### 500 - Internal Server Error
\`\`\`json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Erro interno do servidor",
  "requestId": "req_123456"
}
\`\`\`

## 📝 Exemplos de Uso

### Exemplo: Fluxo Completo de Empréstimo
\`\`\`bash
# 1. Buscar livro disponível
curl "http://localhost:3000/api/books/search?q=principe&available=true"

# 2. Cadastrar empréstimo
curl -X POST "http://localhost:3000/api/loans" \\
  -H "Content-Type: application/json" \\
  -d '{"bookId": 1, "memberId": 1, "dueDate": "2024-02-15"}'

# 3. Registrar devolução
curl -X PUT "http://localhost:3000/api/loans/1/return"
\`\`\`

📋 ESTRUTURA DA DOCUMENTAÇÃO API:
docs/api/api_documentation.md
├── 📚 Livros (4 endpoints)
├── 👥 Membros (2 endpoints)  
├── 📖 Empréstimos (3 endpoints)
├── 📊 Relatórios (2 endpoints)
├── 🩺 Health Check
├── ⚠️ Códigos de Erro
└── 📝 Exemplos de Uso

🎯 O QUE ESTE ARQUIVO INCLUI:
✅ Base URL e autenticação

✅ Endpoints completos para Livros, Membros, Empréstimos

✅ Exemplos de request/response em JSON

✅ Parâmetros de query documentados

✅ Códigos de erro padronizados

✅ Exemplos de uso com curl

✅ Validações e regras de negócio