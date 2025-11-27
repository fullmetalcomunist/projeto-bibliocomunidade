<< 'EOF'
# Arquitetura do Sistema

## Visão Geral
Cliente (Frontend) ←→ Servidor (Backend) ←→ Banco de Dados

text

## Componentes Principais

### Frontend
- HTML, CSS, JavaScript
- Páginas: Login, Dashboard
- Funcionalidades: Interface do usuário, chamadas API

### Backend
- Node.js + Express
- APIs RESTful
- Funcionalidades: Lógica de negócio, acesso a dados

### Banco de Dados
- SQLite (em memória para demonstração)
- Tabelas: livros, membros, administradores

## Fluxo de Dados
1. Usuário acessa frontend
2. Frontend faz requisições para API
3. Backend processa e acessa banco
4. Resposta retorna para frontend
EOF