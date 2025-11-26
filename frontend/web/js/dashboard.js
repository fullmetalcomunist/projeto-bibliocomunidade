// Variáveis globais
let livros = [];
let membros = [];
let livroSelecionadoParaEmprestimo = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadBooks();
    loadMembers();
    
    // Configurar formulários
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', handleAddBook);
    }
    
    const addMemberForm = document.getElementById('addMemberForm');
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', handleAddMember);
    }
});

// Carregar estatísticas
async function loadStats() {
    try {
        const response = await fetch('/api/books/stats');
        const stats = await response.json();
        
        document.getElementById('totalLivros').textContent = stats.totalLivros;
        document.getElementById('livrosDisponiveis').textContent = stats.livrosDisponiveis;
        document.getElementById('livrosEmprestados').textContent = stats.livrosEmprestados;
        document.getElementById('livrosAtrasados').textContent = stats.livrosAtrasados;
        document.getElementById('totalMembros').textContent = stats.totalMembros;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        showMessage('Erro ao carregar estatísticas', 'error');
    }
}

// Carregar lista de livros
async function loadBooks() {
    try {
        const response = await fetch('/api/books');
        livros = await response.json();
        
        renderBooksTable();
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        showMessage('Erro ao carregar lista de livros', 'error');
    }
}

// Carregar lista de membros
async function loadMembers() {
    try {
        const response = await fetch('/api/members');
        membros = await response.json();
        
        renderMembersTable();
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
        showMessage('Erro ao carregar lista de membros', 'error');
    }
}

// Renderizar tabela de livros
function renderBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    livros.forEach(livro => {
        const row = document.createElement('tr');
        
        // Determinar classe CSS para o status
        let statusClass = '';
        let statusText = '';
        
        switch(livro.status) {
            case 'disponivel':
                statusClass = 'status-disponivel';
                statusText = 'Disponível';
                break;
            case 'emprestado':
                statusClass = 'status-emprestado';
                statusText = 'Emprestado';
                break;
            case 'atrasado':
                statusClass = 'status-atrasado';
                statusText = 'Atrasado';
                break;
        }
        
        row.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.isbn || '-'}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
            <td>${livro.membroNome || '-'}</td>
            <td>
                ${livro.status === 'disponivel' ? 
                    `<button class="btn-success" onclick="openSelectMemberModal(${livro.id})">📖 Emprestar</button>` : 
                    `<button class="btn-warning" onclick="devolverLivro(${livro.id})">↩ Devolver</button>`
                }
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Renderizar tabela de membros
function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';
    
    if (membros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; color: #666;">
                    Nenhum membro cadastrado ainda
                </td>
            </tr>
        `;
        return;
    }
    
    membros.forEach(membro => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${membro.nome}</td>
            <td>${membro.telefone || '-'}</td>
            <td>${membro.endereco || '-'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Abrir modal para selecionar membro
function openSelectMemberModal(livroId) {
    if (membros.length === 0) {
        showMessage('Não há membros cadastrados. Cadastre um membro primeiro.', 'error');
        return;
    }
    
    livroSelecionadoParaEmprestimo = livroId;
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';
    
    membros.forEach(membro => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <div class="member-name">${membro.nome}</div>
            <div class="member-info">
                ${membro.telefone ? `📞 ${membro.telefone}` : ''}
                ${membro.endereco ? `📍 ${membro.endereco}` : ''}
            </div>
        `;
        
        memberItem.addEventListener('click', function() {
            // Remover seleção anterior
            document.querySelectorAll('.member-item').forEach(item => {
                item.classList.remove('selected');
            });
            // Selecionar atual
            this.classList.add('selected');
            // Fazer empréstimo após 500ms
            setTimeout(() => {
                emprestarLivro(livroId, membro.id);
            }, 500);
        });
        
        membersList.appendChild(memberItem);
    });
    
    document.getElementById('selectMemberModal').style.display = 'block';
}

// Fechar modal de seleção de membro
function closeSelectMemberModal() {
    document.getElementById('selectMemberModal').style.display = 'none';
    livroSelecionadoParaEmprestimo = null;
}

// Emprestar livro para membro específico
async function emprestarLivro(livroId, membroId) {
    try {
        const response = await fetch(`/api/books/${livroId}/emprestar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ membroId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeSelectMemberModal();
            loadStats();
            loadBooks();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao emprestar livro:', error);
        showMessage('Erro ao emprestar livro', 'error');
    }
}

// Devolver livro
async function devolverLivro(livroId) {
    try {
        const response = await fetch(`/api/books/${livroId}/devolver`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            loadStats();
            loadBooks();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao devolver livro:', error);
        showMessage('Erro ao devolver livro', 'error');
    }
}

// Adicionar livro
async function handleAddBook(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const isbn = document.getElementById('isbn').value;
    
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo, autor, isbn })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeAddBookModal();
            document.getElementById('addBookForm').reset();
            loadStats();
            loadBooks();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        showMessage('Erro ao adicionar livro', 'error');
    }
}

// Adicionar membro
async function handleAddMember(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const endereco = document.getElementById('endereco').value;
    
    try {
        const response = await fetch('/api/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, telefone, endereco })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeAddMemberModal();
            document.getElementById('addMemberForm').reset();
            loadStats();
            loadMembers();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Erro ao cadastrar membro:', error);
        showMessage('Erro ao cadastrar membro', 'error');
    }
}

// Modal functions
function openAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

function closeAddBookModal() {
    document.getElementById('addBookModal').style.display = 'none';
}

function openAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
}

function closeAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'none';
}

// Mostrar mensagens
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const bookModal = document.getElementById('addBookModal');
    const memberModal = document.getElementById('addMemberModal');
    const selectMemberModal = document.getElementById('selectMemberModal');
    
    if (event.target === bookModal) {
        closeAddBookModal();
    }
    if (event.target === memberModal) {
        closeAddMemberModal();
    }
    if (event.target === selectMemberModal) {
        closeSelectMemberModal();
    }
}
