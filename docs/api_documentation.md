```bash
EOF
# Documentação da API - BiblioComunidade

## Base URL
http://localhost:3000/api

## Endpoints

### Autenticação
**POST /auth/login**
```json
{
  "usuario": "admin",
  "senha": "123456"
}
Livros
GET /books - Listar todos os livros
GET /books/stats - Estatísticas do dashboard
POST /books - Adicionar novo livro
POST /books/:id/emprestar - Emprestar livro
POST /books/:id/devolver - Devolver livro

Membros
GET /members - Listar membros
POST /members - Cadastrar novo membro

Exemplo de Uso
javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({usuario: 'admin', senha: '123456'})
});
Total: 8 Endpoints RESTful
EOF