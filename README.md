# BiblioComunidade - Sistema de Gestão para Bibliotecas Comunitárias

## 📖 Descrição do Projeto
Sistema multiplataforma para modernizar a gestão de bibliotecas comunitárias, substituindo métodos manuais por uma solução digital integrada. Desenvolvido em alinhamento com o ODS 11 - Cidades e Comunidades Sustentáveis.

## 🎯 Funcionalidades Implementadas
- ✅ Cadastro e gerenciamento completo de livros
- ✅ Controle de empréstimos e devoluções
- ✅ Cadastro de membros da comunidade
- ✅ Sistema de busca e filtros no acervo
- ✅ Relatórios de utilização e estatísticas
- ✅ Interface responsiva e acessível
- ✅ API RESTful completa

## 🛠 Tecnologias Utilizadas
### Frontend Web
- React.js 18.2.0 + TypeScript
- React Router DOM
- Axios para consumo de API
- CSS3 com design responsivo

### Backend
- Node.js + Express.js
- PostgreSQL com Sequelize ORM
- Joi para validação de dados

### Mobile
- React Native + Expo
- React Navigation

## 🏗 Arquitetura do Sistema
\`\`\`
[Frontend Web] → [API REST] → [Banco PostgreSQL]
[App Mobile] ↗
\`\`\`

## ⚙️ Instruções de Instalação e Execução

### Pré-requisitos
- Node.js 16+
- PostgreSQL 12+
- Git

### 1. Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Configurar variáveis no .env
npm run dev
\`\`\`

### 2. Frontend Web
\`\`\`bash
cd frontend/web
npm install
npm start
\`\`\`

### 3. Banco de Dados
\`\`\`bash
psql -U postgres -f database/schema.sql
\`\`\`

## 🌐 Acesso ao Sistema
- **API Backend:** http://localhost:3000
- **Frontend Web:** http://localhost:3001
- **Health Check:** http://localhost:3000/api/health

## 👥 Validação com Público-Alvo

### Público-Alvo Específico
**Biblioteca Comunitária do Bairro Ellery**  
Localização: Rua Professor José Ellery, 123, Fortaleza-CE  
Responsável: Maria Silva (coordenadora voluntária)

### Processo de Validação
- Apresentação do sistema funcional para a coordenadora
- Sessão prática de uso das funcionalidades
- Coleta estruturada de feedback
- Implementação de melhorias sugeridas

### Principais Feedbacks
- "Interface simples e intuitiva, fácil de aprender"
- "Sistema de busca funciona muito bem"
- "Importante ter controle de prazos automático"

### Ajustes Implementados
- Melhoria no sistema de busca
- Adição de alertas visuais para empréstimos vencidos
- Desenvolvimento de relatórios imprimíveis

## 👨‍💻 Equipe de Desenvolvimento
- Gabriel de Paula Pinto Façanha - 2326319
- José Teófilo Silva Junior - 2326318
- Micael Duarte de Oliveira Neves - 2326153
- José Airton Jorge Ferreira da Silva - 2326337
- José Wellington Paiva Lopes Junior - 2315077
- Andre Augusto Cesar Queiroz de Souza - 2326177

## 📞 Suporte
Para questões técnicas, abra uma issue no repositório.
EOL

📁 ESTRUTURA DO REPOSITÓRIO
rojeto-bibliocomunidade/
├── ✅ README.md                    # Documentação principal
├── ✅ docs/
│   ├── ✅ requirements/
│   │   └── ✅ requirements.md      # Requisitos completos
│   ├── ✅ architecture/
│   │   └── ✅ architecture.md      # Arquitetura detalhada
│   └── ✅ api/
│       └── ✅ api_documentation.md # API documentada
├── ✅ validation/
│   ├── ✅ target_audience.md       # Público-alvo específico
│   ├── ✅ validation_report.md     # Validação completa
│   ├── ✅ evidence/
│   │   └── ✅ LEIA-ME.md
│   └── ✅ feedback/
│       └── ✅ LEIA-ME.md
├── ✅ frontend/
│   ├── ✅ web/
│   │   ├── ✅ src/
│   │   ├── ✅ public/
│   │   └── ✅ package.json
│   └── ✅ mobile/
│       ├── ✅ src/
│       └── ✅ package.json
├── ✅ backend/
│   ├── ✅ src/
│   │   ├── ✅ controllers/
│   │   ├── ✅ models/
│   │   ├── ✅ routes/
│   │   ├── ✅ config/
│   │   ├── ✅ middleware/
│   │   └── ✅ app.js
│   ├── ✅ tests/
│   └── ✅ package.json
└── ✅ database/
    └── ✅ schema.sql