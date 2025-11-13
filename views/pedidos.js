const btnNovoPedido = document.getElementById('btnNovoPedido');
const overlay = document.getElementById('overlay');
const formPedidoModal = document.getElementById('formPedido');
const closeFormPedido = document.getElementById('closeFormPedido');
const pedidoForm = document.getElementById('pedidoForm');
const tbody = document.querySelector('#pedidosTable tbody');
const itensContainer = document.getElementById('itens-container');
const btnAdicionarItem = document.getElementById('btnAdicionarItem');
const valorTotalInput = document.getElementById('valorTotal');
const clienteSelect = document.getElementById('clienteSelect');

const modalViewPedido = document.getElementById('modalViewPedido');
const closeViewModal = document.getElementById('closeViewModal');
const viewContent = document.getElementById('viewContent');
const modalEditPedido = document.getElementById('modalEditPedido');
const closeEditModal = document.getElementById('closeEditModal');
const editPedidoForm = document.getElementById('editPedidoForm');
const itensContainerEdit = document.getElementById('itensContainerEdit');

const modalConfirmDelete = document.getElementById('modalConfirmDelete');
const closeConfirmModal = document.getElementById('closeConfirmModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmContent = document.getElementById('confirmContent');

let pedidoParaExcluir = null;
let produtos = [];
let clientes = [];
let itensCount = 0;
let pedidoParaEditar = null;
let itensCountEdit = 0;

function mostrarModal(modal) {
    modal.style.display = 'block';
    overlay.style.display = 'block';
}

function fecharTodosModais() {
    formPedidoModal.style.display = 'none';
    if (modalViewPedido) modalViewPedido.style.display = 'none';
    if (modalConfirmDelete) modalConfirmDelete.style.display = 'none';
    if (modalEditPedido) modalEditPedido.style.display = 'none';
    overlay.style.display = 'none';
    pedidoParaExcluir = null;
    pedidoParaEditar = null;
}


btnNovoPedido.addEventListener('click', async () => {
    await carregarClientesSelect();
    await carregarProdutos();
    adicionarItemPedido();
    mostrarModal(formPedidoModal);
});

closeFormPedido.addEventListener('click', fecharTodosModais);
if (closeViewModal) closeViewModal.addEventListener('click', fecharTodosModais);
if (closeConfirmModal) closeConfirmModal.addEventListener('click', fecharTodosModais);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', fecharTodosModais);
if (closeEditModal) closeEditModal.addEventListener('click', fecharTodosModais);
overlay.addEventListener('click', fecharTodosModais);


async function carregarClientesSelect() {
    try {
        const response = await fetch('/clientes');
        const data = await response.json();
        clientes = data.clientes;

        clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.codigo;
            option.textContent = `${cliente.codigo} - ${cliente.razao}`;
            option.dataset.nome = cliente.razao;
            clienteSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}


async function carregarProdutos() {
    try {
        const response = await fetch('/produtos');
        const data = await response.json();
        produtos = data.produtos.filter(p => p.status === 'ativo');
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}


function adicionarItemPedido() {
    itensCount++;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-pedido';
    itemDiv.dataset.itemId = itensCount;

    const selectProdutos = produtos.map(p => 
        `<option value="${p.codigo}" data-nome="${p.nome}" data-preco="${p.preco_venda}" data-estoque="${p.estoque}">
            ${p.codigo} - ${p.nome} (Est: ${p.estoque})
        </option>`
    ).join('');

    itemDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group form-group-large">
                <label class="form-label">Produto <span class="required">*</span></label>
                <select name="produto_codigo_${itensCount}" class="form-select produto-select" required>
                    <option value="">Selecione um produto</option>
                    ${selectProdutos}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Quantidade <span class="required">*</span></label>
                <input type="number" name="quantidade_${itensCount}" class="quantidade-input" min="1" value="1" required>
            </div>
            <div class="form-group">
                <label class="form-label">Preço Unit.</label>
                <input type="text" name="preco_${itensCount}" class="preco-input" readonly>
            </div>
            <div class="form-group">
                <label class="form-label">Subtotal</label>
                <input type="text" name="subtotal_${itensCount}" class="subtotal-input" readonly>
            </div>
            <div class="form-group item-actions">
                <label class="form-label">&nbsp;</label>
                <button 
                    type="button" 
                    class="btn-remove-item" 
                    onclick="removerItem(${itensCount})"
                >
                    <span class="btn-remove-item-icon"></span>
                    Remover
                </button>
            </div>
        </div>
    `;


    itensContainer.appendChild(itemDiv);


    const produtoSelect = itemDiv.querySelector('.produto-select');
    const quantidadeInput = itemDiv.querySelector('.quantidade-input');
    const precoInput = itemDiv.querySelector('.preco-input');
    const subtotalInput = itemDiv.querySelector('.subtotal-input');

    produtoSelect.addEventListener('change', () => {
        const option = produtoSelect.selectedOptions[0];
        const preco = parseFloat(option.dataset.preco) || 0;
        precoInput.value = formatarMoeda(preco);
        calcularSubtotal(quantidadeInput, precoInput, subtotalInput);
    });

    quantidadeInput.addEventListener('input', () => {
        calcularSubtotal(quantidadeInput, precoInput, subtotalInput);
    });
}

function removerItem(itemId) {
    const item = document.querySelector(`[data-item-id="${itemId}"]`);
    if (item) {
        item.remove();
        calcularValorTotal();
    }
}

function calcularSubtotal(qtdInput, precoInput, subtotalInput) {
    const quantidade = parseInt(qtdInput.value) || 0;
    const preco = parseFloat(precoInput.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const subtotal = quantidade * preco;
    subtotalInput.value = formatarMoeda(subtotal);
    calcularValorTotal();
}

function calcularValorTotal() {
    let total = 0;
    document.querySelectorAll('.subtotal-input').forEach(input => {
        const valor = parseFloat(input.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
        total += valor;
    });
    valorTotalInput.value = formatarMoeda(total);
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

btnAdicionarItem.addEventListener('click', adicionarItemPedido);


pedidoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Enviando pedido...');

    const formData = new FormData(pedidoForm);
    const clienteCodigo = formData.get('cliente_codigo');
    const clienteNome = clienteSelect.selectedOptions[0].dataset.nome;
    const dataPedido = formData.get('data_pedido');
    const status = formData.get('status');
    const observacoes = formData.get('observacoes');


    const itens = [];
    document.querySelectorAll('.item-pedido').forEach(itemDiv => {
        const produtoSelect = itemDiv.querySelector('.produto-select');
        const quantidadeInput = itemDiv.querySelector('.quantidade-input');
        const precoInput = itemDiv.querySelector('.preco-input');

        if (produtoSelect.value && quantidadeInput.value) {
            const option = produtoSelect.selectedOptions[0];
            itens.push({
                produto_codigo: produtoSelect.value,
                produto_nome: option.dataset.nome,
                quantidade: parseInt(quantidadeInput.value),
                preco_unitario: parseFloat(precoInput.value.replace('R$', '').replace('.', '').replace(',', '.'))
            });
        }
    });

    if (itens.length === 0) {
        alert('Adicione pelo menos um item ao pedido!');
        return;
    }

    const dadosPedido = {
        cliente_codigo: clienteCodigo,
        cliente_nome: clienteNome,
        data_pedido: dataPedido,
        status: status,
        observacoes: observacoes,
        itens: itens
    };

    console.log('Dados do pedido:', dadosPedido);

    try {
        const response = await fetch('/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosPedido)
        });

        const resultado = await response.json();

        if (response.ok) {
            console.log('Pedido cadastrado:', resultado);
            alert('Pedido cadastrado com sucesso!');
            pedidoForm.reset();
            itensContainer.innerHTML = '';
            itensCount = 0;
            fecharTodosModais();
            await carregarPedidos();
        } else {
            alert(`Erro: ${resultado.error}\n${resultado.details || ''}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar pedido.');
    }
});


async function carregarPedidos() {
    console.log('Carregando pedidos...');

    try {
        const response = await fetch('/pedidos');

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Pedidos recebidos:', data.pedidos.length);

        tbody.innerHTML = '';

        if (!data.pedidos || data.pedidos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #666;">Nenhum pedido cadastrado</td>
                </tr>
            `;
            return;
        }

        data.pedidos.forEach(pedido => {
            const tr = document.createElement('tr');

            const valorFormatado = formatarMoeda(pedido.valor_total);
            const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');

            const statusColors = {
                'pendente': '#ffc107',
                'processando': '#17a2b8',
                'concluido': '#28a745',
                'cancelado': '#dc3545'
            };

            const statusBadge = `<span style="background: ${statusColors[pedido.status] || '#6c757d'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${pedido.status}</span>`;

            tr.innerHTML = `
                <td>${pedido.codigo || 'N/A'}</td>
                <td>${pedido.cliente_nome || 'N/A'}</td>
                <td>${dataFormatada}</td>
                <td>${statusBadge}</td>
                <td>${valorFormatado}</td>
                <td>
                    <select class="action-select" data-id="${pedido.codigo}">
                        <option value="">Selecione...</option>
                        <option value="visualizar">Visualizar</option>
                        <option value="atualizar">Atualizar</option>
                        <option value="excluir">Excluir</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });

        console.log('Tabela atualizada');

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #ff4d4f;">Erro ao carregar pedidos. Verifique a conexão.</td>
            </tr>
        `;
    }
}


async function visualizarPedido(codigoPedido) {
    console.log(`Visualizando pedido: ${codigoPedido}`);

    try {
        const response = await fetch(`/pedidos/${codigoPedido}`);

        if (!response.ok) {
            throw new Error('Pedido não encontrado');
        }

        const pedido = await response.json();
        console.log('Dados do pedido:', pedido);

        const valorTotal = formatarMoeda(pedido.valor_total);
        const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');

        let itensHtml = '<h4 style="margin-top: 20px; color: #1a237e;">Itens do Pedido:</h4>';
        pedido.itens.forEach(item => {
            const subtotal = formatarMoeda(item.subtotal);
            const precoUnit = formatarMoeda(item.preco_unitario);
            itensHtml += `
                <div style="background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 6px;">
                    <p><strong>${item.produto_nome}</strong></p>
                    <p>Quantidade: ${item.quantidade} | Preço: ${precoUnit} | Subtotal: ${subtotal}</p>
                </div>
            `;
        });

        viewContent.innerHTML = `
            <p><strong>Código:</strong> ${pedido.codigo}</p>
            <p><strong>Cliente:</strong> ${pedido.cliente_nome}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Status:</strong> ${pedido.status}</p>
            <p><strong>Valor Total:</strong> ${valorTotal}</p>
            <p><strong>Observações:</strong> ${pedido.observacoes || 'Nenhuma'}</p>
            ${itensHtml}
        `;

        mostrarModal(modalViewPedido);

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar pedido.');
    }
}


async function abrirModalConfirmacao(codigoPedido) {
    console.log(`Preparando exclusão: ${codigoPedido}`);

    try {
        const response = await fetch(`/pedidos/${codigoPedido}`);

        if (!response.ok) {
            throw new Error('Pedido não encontrado');
        }

        const pedido = await response.json();
        pedidoParaExcluir = pedido;

        const valorTotal = formatarMoeda(pedido.valor_total);
        const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');

        confirmContent.innerHTML = `
            <p><strong>Tem certeza que deseja excluir este pedido?</strong></p>
            <p><strong>Código:</strong> ${pedido.codigo}</p>
            <p><strong>Cliente:</strong> ${pedido.cliente_nome}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Valor Total:</strong> ${valorTotal}</p>
            <div class="warning-text"> Esta ação não pode ser desfeita e o estoque será devolvido!</div>
        `;

        mostrarModal(modalConfirmDelete);

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar pedido.');
    }
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!pedidoParaExcluir) return;

        console.log(`Excluindo: ${pedidoParaExcluir.codigo}`);

        try {
            const response = await fetch(`/pedidos/${pedidoParaExcluir.codigo}`, {
                method: 'DELETE'
            });

            const resultado = await response.json();

            if (response.ok) {
                console.log('Pedido excluído');
                alert('Pedido excluído com sucesso!');
                fecharTodosModais();
                await carregarPedidos();
            } else {
                alert(`Erro: ${resultado.error}`);
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir pedido.');
        }
    });
}


async function atualizarPedido(codigoPedido) {
    console.log(`Abrindo modal para atualizar pedido: ${codigoPedido}`);
    
    try {
        const response = await fetch(`/pedidos/${codigoPedido}`);
        
        if (!response.ok) {
            throw new Error('Pedido não encontrado');
        }
        
        const pedido = await response.json();
        pedidoParaEditar = pedido;
        
        console.log('Dados do pedido:', pedido);
        

        editPedidoForm.querySelector('[name="codigo"]').value = pedido.codigo;
        editPedidoForm.querySelector('[name="cliente_codigo"]').value = pedido.cliente_codigo;
        editPedidoForm.querySelector('[name="cliente_nome"]').value = pedido.cliente_nome;
        editPedidoForm.querySelector('[name="status"]').value = pedido.status;
        editPedidoForm.querySelector('[name="observacoes"]').value = pedido.observacoes || '';
        document.getElementById('valorTotalEdit').value = formatarMoeda(pedido.valor_total);
        

        const secaoItens = document.getElementById('secaoItens');
        if (pedido.status === 'pendente') {
            secaoItens.style.display = 'block';

            
            if (produtos.length === 0) {
                await carregarProdutos();
            }
            

            itensContainerEdit.innerHTML = '';
            itensCountEdit = 0;
            
            pedido.itens.forEach(item => {
                adicionarItemEdit(item);
            });
        } else {
            secaoItens.style.display = 'none';
        }
        
        mostrarModal(modalEditPedido);
        
    } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        alert('Erro ao carregar dados do pedido.');
    }
}


function adicionarItemEdit(itemExistente = null) {
    itensCountEdit++;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-pedido';
    itemDiv.dataset.itemId = itensCountEdit;

    const selectProdutos = produtos.map(p => 
        `<option value="${p.codigo}" data-nome="${p.nome}" data-preco="${p.preco_venda}" data-estoque="${p.estoque}" 
         ${itemExistente && itemExistente.produto_codigo === p.codigo ? 'selected' : ''}>
            ${p.codigo} - ${p.nome} (Est: ${p.estoque})
        </option>`
    ).join('');

    itemDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group form-group-large">
                <label class="form-label">Produto <span class="required">*</span></label>
                <select name="produto_codigo_${itensCountEdit}" class="form-select produto-select" required>
                    <option value="">Selecione um produto</option>
                    ${selectProdutos}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Quantidade <span class="required">*</span></label>
                <input type="number" name="quantidade_${itensCountEdit}" class="quantidade-input" min="1" 
                       value="${itemExistente ? itemExistente.quantidade : 1}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Preço Unit.</label>
                <input type="text" name="preco_${itensCountEdit}" class="preco-input" readonly 
                       value="${itemExistente ? formatarMoeda(itemExistente.preco_unitario) : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Subtotal</label>
                <input type="text" name="subtotal_${itensCountEdit}" class="subtotal-input" readonly>
            </div>
            <div class="form-group" style="align-self: flex-end;">
                <button type="button" class="btn-remove-item" onclick="removerItemEdit(${itensCountEdit})">🗑️</button>
            </div>
        </div>
    `;

    itensContainerEdit.appendChild(itemDiv);


    const produtoSelect = itemDiv.querySelector('.produto-select');
    const quantidadeInput = itemDiv.querySelector('.quantidade-input');
    const precoInput = itemDiv.querySelector('.preco-input');
    const subtotalInput = itemDiv.querySelector('.subtotal-input');

    produtoSelect.addEventListener('change', () => {
        const option = produtoSelect.selectedOptions[0];
        const preco = parseFloat(option.dataset.preco) || 0;
        precoInput.value = formatarMoeda(preco);
        calcularSubtotalEdit(quantidadeInput, precoInput, subtotalInput);
    });

    quantidadeInput.addEventListener('input', () => {
        calcularSubtotalEdit(quantidadeInput, precoInput, subtotalInput);
    });


    if (itemExistente) {
        calcularSubtotalEdit(quantidadeInput, precoInput, subtotalInput);
    }
}


function removerItemEdit(itemId) {
    const item = itensContainerEdit.querySelector(`[data-item-id="${itemId}"]`);
    if (item) {
        item.remove();
        calcularValorTotalEdit();
    }
}


function calcularSubtotalEdit(qtdInput, precoInput, subtotalInput) {
    const quantidade = parseInt(qtdInput.value) || 0;
    const preco = parseFloat(precoInput.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const subtotal = quantidade * preco;
    subtotalInput.value = formatarMoeda(subtotal);
    calcularValorTotalEdit();
}


function calcularValorTotalEdit() {
    let total = 0;
    itensContainerEdit.querySelectorAll('.subtotal-input').forEach(input => {
        const valor = parseFloat(input.value.replace('R$', '').replace('.', '').replace(',', '.')) || 0;
        total += valor;
    });
    document.getElementById('valorTotalEdit').value = formatarMoeda(total);
}


editPedidoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!pedidoParaEditar) {
        alert('Erro: Nenhum pedido selecionado.');
        return;
    }
    
    console.log('Processando atualização do pedido...');
    
    const formData = new FormData(editPedidoForm);
    const status = formData.get('status');
    const observacoes = formData.get('observacoes');
    
    const dadosAtualizacao = {
        status: status,
        observacoes: observacoes
    };
    

    if (pedidoParaEditar.status === 'pendente') {
        const itens = [];
        itensContainerEdit.querySelectorAll('.item-pedido').forEach(itemDiv => {
            const produtoSelect = itemDiv.querySelector('.produto-select');
            const quantidadeInput = itemDiv.querySelector('.quantidade-input');
            const precoInput = itemDiv.querySelector('.preco-input');

            if (produtoSelect.value && quantidadeInput.value) {
                const option = produtoSelect.selectedOptions[0];
                itens.push({
                    produto_codigo: produtoSelect.value,
                    produto_nome: option.dataset.nome,
                    quantidade: parseInt(quantidadeInput.value),
                    preco_unitario: parseFloat(precoInput.value.replace('R$', '').replace('.', '').replace(',', '.'))
                });
            }
        });

        if (itens.length === 0) {
            alert('Adicione pelo menos um item ao pedido!');
            return;
        }
        
        dadosAtualizacao.itens = itens;
    }
    
    console.log('Dados de atualização:', dadosAtualizacao);
    
    const botaoSubmit = editPedidoForm.querySelector('button[type="submit"]');
    const textoOriginal = botaoSubmit.innerHTML;
    botaoSubmit.innerHTML = '⏳ Atualizando...';
    botaoSubmit.disabled = true;
    
    try {
        const response = await fetch(`/pedidos/${pedidoParaEditar.codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizacao)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            console.log('Pedido atualizado:', resultado);
            alert('Pedido atualizado com sucesso!');
            
            fecharTodosModais();
            await carregarPedidos();
            
        } else {
            alert(`Erro: ${resultado.error || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('Erro na atualização:', error);
        alert('Erro ao atualizar pedido.');
    } finally {
        botaoSubmit.innerHTML = textoOriginal;
        botaoSubmit.disabled = false;
    }
});


document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('action-select')) {
        const codigoPedido = e.target.dataset.id;
        const acao = e.target.value;

        console.log(`Ação: ${acao} - Pedido: ${codigoPedido}`);

        e.target.value = '';

        switch (acao) {
            case 'visualizar':
                await visualizarPedido(codigoPedido);
                break;
            case 'excluir':
                await abrirModalConfirmacao(codigoPedido);
                break;
            case 'atualizar':
                await atualizarPedido(codigoPedido);
                break;
        }
    }
});


console.log('Sistema de pedidos inicializado!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado');
    carregarPedidos();
});

carregarPedidos();
