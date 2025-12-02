(function() {
    const publicPages = ['login.html', 'register.html'];
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (publicPages.includes(currentPage)) {
        return;
    }
    
    async function verificarAutenticacao() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        try {
            const response = await fetch('/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            } else {
                const data = await response.json();
                if (data.authenticated) {
                    adicionarBotaoLogout();
                    exibirNomeUsuario(data.user);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    }
    
    function adicionarBotaoLogout() {
        const navbar = document.querySelector('.navbar-menu');
        if (navbar && !document.getElementById('btnLogout')) {
            const li = document.createElement('li');
            li.className = 'navbar-item';
            li.innerHTML = `
                <a href="#" id="btnLogout" class="navbar-link" style="background: rgba(255, 77, 79, 0.1); color: #ff4d4f;">
                    Sair
                </a>
            `;
            navbar.appendChild(li);
            
            document.getElementById('btnLogout').addEventListener('click', async (e) => {
                e.preventDefault();
                
                if (confirm('Deseja realmente sair?')) {
                    try {
                        await fetch('/auth/logout', { method: 'POST' });
                    } catch (error) {
                        console.error('Erro ao fazer logout:', error);
                    }
                    
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                }
            });
        }
    }
    
    function exibirNomeUsuario(user) {
        const navbar = document.querySelector('.navbar-brand');
        if (navbar && user && user.nome) {
            const userSpan = document.createElement('span');
            userSpan.style.fontSize = '0.9rem';
            userSpan.style.opacity = '0.8';
            userSpan.style.marginLeft = '15px';
            userSpan.textContent = `Olá, ${user.nome.split(' ')[0]}`;
            navbar.appendChild(userSpan);
        }
    }
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const token = localStorage.getItem('token');
        
        if (token && args[1]) {
            args[1].headers = {
                ...args[1].headers,
                'Authorization': `Bearer ${token}`
            };
        } else if (token && !args[1]) {
            args[1] = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
        }
        
        return originalFetch.apply(this, args);
    };
    
    verificarAutenticacao();
})();