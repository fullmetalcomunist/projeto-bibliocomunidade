# Requisitos do Sistema - BiblioComunidade

## 📚 Requisitos Funcionais Implementados

### RF01 - Gerenciamento de Livros ✅
- RF01.1: Cadastrar novo livro com validação
- RF01.2: Editar informações do livro
- RF01.3: Excluir livro (soft delete implementado)
- RF01.4: Buscar livros por título, autor, categoria
- RF01.5: Visualizar detalhes completos do livro
- RF01.6: Filtros por disponibilidade e categoria
- RF01.7: Controle de observações e estado do livro

### RF02 - Controle de Empréstimos ✅
- RF02.1: Realizar empréstimo com validações
- RF02.2: Registrar devolução com data automática
- RF02.3: Consultar empréstimos ativos
- RF02.4: Alertas visuais para empréstimos vencidos
- RF02.5: Histórico completo de empréstimos
- RF02.6: Renovação de empréstimos
- RF02.7: Relatório de empréstimos em atraso

### RF03 - Gerenciamento de Membros ✅
- RF03.1: Cadastrar membro com dados completos
- RF03.2: Editar dados do membro
- RF03.3: Consultar membros ativos/inativos
- RF03.4: Verificar situação do membro
- RF03.5: Histórico de empréstimos por membro
- RF03.6: Bloqueio de membros com pendências

### RF04 - Relatórios e Estatísticas ✅
- RF04.1: Relatório de livros mais emprestados
- RF04.2: Relatório de empréstimos ativos
- RF04.3: Relatório de membros ativos
- RF04.4: Estatísticas de utilização mensal
- RF04.5: Relatórios imprimíveis em PDF
- RF04.6: Dashboard com métricas principais

### RF05 - Sistema de Busca ✅
- RF05.1: Busca textual em título, autor e descrição
- RF05.2: Filtros avançados por categoria e disponibilidade
- RF05.3: Busca com paginação
- RF05.4: Sugestões de busca em tempo real

## 🛡 Requisitos Não-Funcionais Atendidos

### RNF01 - Usabilidade ✅
- Interface intuitiva com curva de aprendizado < 15min
- Tempo de resposta < 2 segundos para operações críticas
- Design responsivo para mobile e desktop
- Navegação simplificada e consistente
- Feedback visual imediato para todas as ações

### RNF02 - Confiabilidade ✅
- Sistema disponível 99% do tempo
- Validação de dados em frontend e backend
- Tratamento de erros amigável
- Backup automático configurado
- Logs de auditoria para operações críticas

### RNF03 - Segurança ✅
- Validação de entrada contra SQL injection
- Sanitização de dados
- Controle de acesso básico implementado
- Proteção de endpoints sensíveis
- Validação de sessão e autenticação

### RNF04 - Performance ✅
- Otimização de consultas ao banco
- Paginação para listas extensas
- Cache de consultas frequentes
- Compressão de responses HTTP
- Indexação adequada no banco de dados

### RNF05 - Manutenibilidade ✅
- Código modular e documentado
- Arquitetura em camadas
- Testes automatizados
- Documentação técnica completa
- Padrões de código consistentes

### RNF06 - Escalabilidade ✅
- Arquitetura preparada para crescimento
- Suporte a múltiplos usuários concorrentes
- Database connection pooling
- Load balancing ready

## 🎯 Requisitos de Domínio

### RD01 - Regras de Negócio
- Um membro pode ter no máximo 3 empréstimos simultâneos
- Prazo de empréstimo: 15 dias
- Multa simbólica de 1 dia por atraso (para conscientização)
- Livros reservados não podem ser emprestados
- Membros com empréstimos em atraso não podem fazer novos empréstimos

### RD02 - Validações
- ISBN deve ter formato válido quando informado
- Email deve ter formato válido
- Datas não podem ser futuras para empréstimos
- Campos obrigatórios devem ser validados
- Categorias devem seguir lista pré-definida

## 📊 Métricas de Aceitação

### MA01 - Performance
- Tempo de carregamento inicial < 3 segundos
- Busca retorna resultados em < 1 segundo
- Operações de CRUD completas em < 2 segundos

### MA02 - Usabilidade
- Usuário consegue realizar primeiro empréstimo em < 5 minutos
- Interface compreensível sem treinamento formal
- Menos de 3 cliques para operações frequentes

### MA03 - Confiabilidade
- Sistema disponível fora do horário de manutenção
- Backup realizado diariamente
- Dados consistentes após recuperação de falhas
