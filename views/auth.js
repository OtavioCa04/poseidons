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
                    aplicarPermissoes(data.user);
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
            const userInfo = document.createElement('div');
            userInfo.style.display = 'flex';
            userInfo.style.flexDirection = 'column';
            userInfo.style.alignItems = 'flex-start';
            userInfo.style.marginLeft = '15px';
            userInfo.style.fontSize = '0.85rem';
            
            const nameSpan = document.createElement('span');
            nameSpan.style.opacity = '0.9';
            nameSpan.textContent = `Olá, ${user.nome.split(' ')[0]}`;
            
            const roleSpan = document.createElement('span');
            roleSpan.style.opacity = '0.7';
            roleSpan.style.fontSize = '0.75rem';
            roleSpan.style.textTransform = 'capitalize';
            
            const roleLabels = {
                'admin': 'Administrador',
                'gerente': 'Gerente',
                'funcionario': 'Funcionário'
            };
            roleSpan.textContent = roleLabels[user.role] || user.role;
            
            userInfo.appendChild(nameSpan);
            userInfo.appendChild(roleSpan);
            navbar.appendChild(userInfo);
        }
    }
    
    function aplicarPermissoes(user) {
        const role = user.role;
        
        const permissions = {
            admin: ['*'],
            gerente: ['clientes:*', 'produtos:*', 'pedidos:*'],
            funcionario: ['clientes:read', 'produtos:read', 'pedidos:read', 'pedidos:create', 'pedidos:update']
        };
        
        const userPermissions = permissions[role] || [];
        
        function hasPermission(action) {
            if (userPermissions.includes('*')) return true;
            const [resource, operation] = action.split(':');
            return userPermissions.includes(action) || userPermissions.includes(`${resource}:*`);
        }
        
        setTimeout(() => {
            if (currentPage === 'index.html' && !hasPermission('clientes:create')) {
                const btnNovo = document.getElementById('btnNovo');
                if (btnNovo) btnNovo.style.display = 'none';
            }
            
            if (currentPage === 'produtos.html' && !hasPermission('produtos:create')) {
                const btnNovoProduto = document.getElementById('btnNovoProduto');
                if (btnNovoProduto) btnNovoProduto.style.display = 'none';
            }
            
            if (currentPage === 'pedidos.html' && !hasPermission('pedidos:create')) {
                const btnNovoPedido = document.getElementById('btnNovoPedido');
                if (btnNovoPedido) btnNovoPedido.style.display = 'none';
            }
            
            document.addEventListener('DOMContentLoaded', () => {
                const selects = document.querySelectorAll('.action-select');
                selects.forEach(select => {
                    const options = select.querySelectorAll('option');
                    options.forEach(option => {
                        const value = option.value;
                        const page = currentPage.replace('.html', '');
                        
                        if (value === 'atualizar' && !hasPermission(`${page}:update`)) {
                            option.style.display = 'none';
                        }
                        if (value === 'excluir' && !hasPermission(`${page}:delete`)) {
                            option.style.display = 'none';
                        }
                    });
                });
            });
        }, 500);
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