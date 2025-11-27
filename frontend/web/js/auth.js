// Funções de autenticação
async function login(usuario, senha) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, senha })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Salvar info do usuário no sessionStorage
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('isLoggedIn', 'true');
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, message: 'Erro de conexão com o servidor' };
    }
}

function logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = '/login.html';
}

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        window.location.href = '/login.html';
    }
}

// Event listener para o formulário de login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const messageDiv = document.getElementById('message');
        
        const result = await login(usuario, senha);
        
        if (result.success) {
            messageDiv.innerHTML = `<div class="message success">${result.message}</div>`;
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            messageDiv.innerHTML = `<div class="message error">${result.message}</div>`;
        }
    });
}

// Verificar autenticação ao carregar páginas protegidas
if (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard.html') {
    checkAuth();
}
