const btnNovoProduto = document.getElementById('btnNovoProduto');
const overlay = document.getElementById('overlay');
const formProdutoModal = document.getElementById('formProduto');
const closeFormProduto = document.getElementById('closeFormProduto');
const produtoForm = document.getElementById('produtoForm');
const tbody = document.querySelector('#produtosTable tbody');

const modalViewProduto = document.getElementById('modalViewProduto');
const closeViewModal = document.getElementById('closeViewModal');
const viewContent = document.getElementById('viewContent');

const modalEditProduto = document.getElementById('modalEditProduto');
const closeEditModal = document.getElementById('closeEditModal');
const editProdutoForm = document.getElementById('editProdutoForm');

const modalConfirmDelete = document.getElementById('modalConfirmDelete');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmContent = document.getElementById('confirmContent');


let produtoParaExcluir = null;
let produtoParaEditar = null;



function mostrarModal(modal) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function fecharTodosModais() {
    formProdutoModal.style.display = 'none';
    if (modalViewProduto) modalViewProduto.style.display = 'none';
    if (modalConfirmDelete) modalConfirmDelete.style.display = 'none';
    if (modalEditProduto) modalEditProduto.style.display = 'none';
    overlay.style.display = 'none';
    produtoParaExcluir = null;
    produtoParaEditar = null;
}



btnNovoProduto.addEventListener('click', () => {
    mostrarModal(formProdutoModal);
});

closeFormProduto.addEventListener('click', fecharTodosModais);

if (closeViewModal) {
    closeViewModal.addEventListener('click', fecharTodosModais);
}

if (closeEditModal) {
    closeEditModal.addEventListener('click', fecharTodosModais);
}

if (closeConfirmModal) {
    closeConfirmModal.addEventListener('click', fecharTodosModais);
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', fecharTodosModais);
}

const btnCancelForm = document.querySelector('.btn-cancel-form');
if (btnCancelForm) {
    btnCancelForm.addEventListener('click', fecharTodosModais);
}

overlay.addEventListener('click', fecharTodosModais);


async function carregarProdutos() {
    console.log('Carregando produtos...');
    
    try {
        const response = await fetch('/produtos');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Produtos recebidos:', data.produtos.length);
        
        tbody.innerHTML = '';
        
        if (!data.produtos || data.produtos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 20px; color: #666;">Nenhum produto cadastrado</td>
                </tr>
            `;
            return;
        }
        
        data.produtos.forEach(produto => {
            const tr = document.createElement('tr');
            

            const precoFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(produto.preco_venda);
            

            const statusBadge = produto.status === 'ativo' 
                ? '<span style="background: #28a745; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Ativo</span>'
                : '<span style="background: #dc3545; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">Inativo</span>';
            
            tr.innerHTML = `
                <td>${produto.codigo || 'N/A'}</td>
                <td>${produto.nome || 'N/A'}</td>
                <td>${produto.categoria || 'N/A'}</td>
                <td>${precoFormatado}</td>
                <td>${produto.estoque || 0}</td>
                <td>${produto.marca || 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>
                    <select class="action-select" data-id="${produto.codigo}">
                        <option value="">Selecione...</option>
                        <option value="visualizar">Visualizar</option>
                        <option value="atualizar">Atualizar</option>
                        <option value="excluir">Excluir</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        console.log('Tabela de produtos atualizada');
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #ff4d4f;">Erro ao carregar produtos. Verifique a conexão.</td>
            </tr>
        `;
    }
}


produtoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Enviando formulário de cadastro...');
    
    const formData = new FormData(produtoForm);
    const dadosProduto = Object.fromEntries(formData.entries());
    
    console.log('Dados do produto:', dadosProduto);
    
    try {
        const response = await fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosProduto)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            console.log('Produto cadastrado:', resultado);
            alert('Produto cadastrado com sucesso!');
            
            produtoForm.reset();
            fecharTodosModais();
            await carregarProdutos();
            
        } else {
            console.error('Erro no cadastro:', resultado);
            alert(`Erro ao cadastrar produto: ${resultado.error || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao cadastrar produto. Verifique a conexão.');
    }
});


async function visualizarProduto(codigoProduto) {
    console.log(`Visualizando produto: ${codigoProduto}`);
    
    try {
        const response = await fetch(`/produtos/${codigoProduto}`);
        
        if (!response.ok) {
            throw new Error(`Produto não encontrado: ${response.status}`);
        }
        
        const produto = await response.json();
        console.log('Dados do produto:', produto);
        
        const precoVenda = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco_venda);
        
        const precoCusto = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco_custo);
        
        viewContent.innerHTML = `
            <p><strong>Código:</strong> ${produto.codigo || 'N/A'}</p>
            <p><strong>Nome:</strong> ${produto.nome || 'N/A'}</p>
            <p><strong>Categoria:</strong> ${produto.categoria || 'N/A'}</p>
            <p><strong>Código de Barras:</strong> ${produto.codigo_barras || 'N/A'}</p>
            <p><strong>Descrição:</strong> ${produto.descricao || 'N/A'}</p>
            <p><strong>Preço de Custo:</strong> ${precoCusto}</p>
            <p><strong>Preço de Venda:</strong> ${precoVenda}</p>
            <p><strong>Estoque:</strong> ${produto.estoque || 0}</p>
            <p><strong>Estoque Mínimo:</strong> ${produto.estoque_minimo || 0}</p>
            <p><strong>Unidade:</strong> ${produto.unidade || 'N/A'}</p>
            <p><strong>Marca:</strong> ${produto.marca || 'N/A'}</p>
            <p><strong>Fornecedor:</strong> ${produto.fornecedor || 'N/A'}</p>
            <p><strong>Status:</strong> ${produto.status || 'N/A'}</p>
        `;
        
        mostrarModal(modalViewProduto);
        
    } catch (error) {
        console.error('Erro ao visualizar produto:', error);
        alert('Erro ao carregar dados do produto.');
    }
}


async function atualizarProduto(codigoProduto) {
    console.log(`Abrindo modal para atualizar produto: ${codigoProduto}`);
    
    try {
        const response = await fetch(`/produtos/${codigoProduto}`);
        
        if (!response.ok) {
            throw new Error(`Produto não encontrado: ${response.status}`);
        }
        
        const produto = await response.json();
        produtoParaEditar = produto;
        
        console.log('Dados do produto para atualização:', produto);
        
        const form = document.getElementById('editProdutoForm');
        if (form) {
            const campos = [
                'codigo', 'nome', 'categoria', 'codigo_barras', 'descricao',
                'preco_custo', 'preco_venda', 'estoque', 'estoque_minimo',
                'unidade', 'marca', 'fornecedor', 'status'
            ];
            
            campos.forEach(campo => {
                const input = form.querySelector(`[name="${campo}"]`);
                if (input) {
                    input.value = produto[campo] || '';
                }
            });
            
            mostrarModal(modalEditProduto);
            console.log('Modal de atualização aberto');
        }
        
    } catch (error) {
        console.error('Erro ao carregar produto para atualização:', error);
        alert('Erro ao carregar dados do produto.');
    }
}


if (editProdutoForm) {
    editProdutoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!produtoParaEditar) {
            alert('Erro: Nenhum produto selecionado.');
            return;
        }
        
        console.log('Processando atualização...');
        
        const formData = new FormData(editProdutoForm);
        const dadosAtualizados = Object.fromEntries(formData.entries());
        
        const botaoSubmit = editProdutoForm.querySelector('button[type="submit"]');
        const textoOriginal = botaoSubmit.innerHTML;
        botaoSubmit.innerHTML = '⏳ Atualizando...';
        botaoSubmit.disabled = true;
        
        try {
            const response = await fetch(`/produtos/${produtoParaEditar.codigo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosAtualizados)
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                console.log('Produto atualizado:', resultado);
                alert('Produto atualizado com sucesso!');
                
                fecharTodosModais();
                await carregarProdutos();
                
            } else {
                alert(`Erro: ${resultado.error || 'Erro desconhecido'}`);
            }
            
        } catch (error) {
            console.error('Erro na atualização:', error);
            alert('Erro ao atualizar produto.');
        } finally {
            botaoSubmit.innerHTML = textoOriginal;
            botaoSubmit.disabled = false;
        }
    });
}


async function abrirModalConfirmacao(codigoProduto) {
    console.log(`Preparando exclusão: ${codigoProduto}`);
    
    try {
        const response = await fetch(`/produtos/${codigoProduto}`);
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        
        const produto = await response.json();
        produtoParaExcluir = produto;
        
        const precoVenda = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(produto.preco_venda);
        
        confirmContent.innerHTML = `
            <p><strong>Tem certeza que deseja excluir este produto?</strong></p>
            <p><strong>Código:</strong> ${produto.codigo}</p>
            <p><strong>Nome:</strong> ${produto.nome}</p>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Preço:</strong> ${precoVenda}</p>
            <p><strong>Estoque:</strong> ${produto.estoque} unidades</p>
            <div class="warning-text"> Esta ação não pode ser desfeita!</div>
        `;
        
        mostrarModal(modalConfirmDelete);
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar produto.');
    }
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!produtoParaExcluir) {
            return;
        }
        
        console.log(`Excluindo: ${produtoParaExcluir.codigo}`);
        
        try {
            const response = await fetch(`/produtos/${produtoParaExcluir.codigo}`, {
                method: 'DELETE'
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                console.log('Produto excluído');
                alert('Produto excluído com sucesso!');
                
                fecharTodosModais();
                await carregarProdutos();
                
            } else {
                alert(`Erro: ${resultado.error}`);
            }
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir produto.');
        }
    });
}


document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('action-select')) {
        const codigoProduto = e.target.dataset.id;
        const acao = e.target.value;
        
        console.log(`Ação: ${acao} - Produto: ${codigoProduto}`);
        
        e.target.value = '';
        
        switch (acao) {
            case 'visualizar':
                await visualizarProduto(codigoProduto);
                break;
            case 'atualizar':
                await atualizarProduto(codigoProduto);
                break;
            case 'excluir':
                await abrirModalConfirmacao(codigoProduto);
                break;
        }
    }
});


console.log('Sistema de produtos inicializado!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');
    carregarProdutos();
});

carregarProdutos();
