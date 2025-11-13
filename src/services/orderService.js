const AppError = require('../errors/AppError');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const pool = require('../config/database');
const { generateSequentialCode } = require('../utils/codeGenerator');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const ORDER_PREFIX = 'PED';
const ORDER_CODE_SIZE = 5;

function validateOrderPayload(payload) {
  const requiredFields = ['cliente_codigo', 'cliente_nome', 'data_pedido'];
  const missingFields = requiredFields.filter((field) => !payload[field]);
  if (missingFields.length) {
    throw new AppError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`,
      400
    );
  }

  if (!Array.isArray(payload.itens) || payload.itens.length === 0) {
    throw new AppError('Pedido deve ter pelo menos um item', 400);
  }

  const invalidItems = payload.itens.filter((item) =>
    !item.produto_codigo || !item.produto_nome || !item.quantidade || !item.preco_unitario
  );
  if (invalidItems.length) {
    throw new AppError('Itens do pedido possuem campos inválidos', 400);
  }
}

async function listOrders() {
  const orders = await orderRepository.findAll();
  return orders.map((order) => order.toJSON());
}

async function getOrderByCode(codigo) {
  const order = await orderRepository.findByCode(codigo);
  if (!order) {
    throw new AppError('Pedido não encontrado', 404);
  }
  const itens = await orderRepository.findItemsByOrderCode(codigo);
  return order.withItems(itens).toJSON();
}

async function createOrder(payload) {
  validateOrderPayload(payload);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const lastCode = await orderRepository.findLastCode(connection);
    const codigo = generateSequentialCode(ORDER_PREFIX, lastCode, ORDER_CODE_SIZE);

    const order = new Order({
      codigo,
      cliente_codigo: payload.cliente_codigo,
      cliente_nome: payload.cliente_nome,
      data_pedido: payload.data_pedido,
      status: payload.status || 'pendente',
      observacoes: payload.observacoes || null
    });

    let valor_total = 0;
    for (const item of payload.itens) {
      const produto = await productRepository.findByCode(item.produto_codigo, connection);
      if (!produto) {
        throw new AppError(`Produto ${item.produto_codigo} não encontrado`, 404);
      }
      if (produto.estoque < item.quantidade) {
        throw new AppError(`Estoque insuficiente para ${item.produto_nome}`, 400);
      }
      valor_total += item.quantidade * item.preco_unitario;
    }

    order.valor_total = valor_total;
    await orderRepository.insertOrder(order, connection);

    for (const item of payload.itens) {
      const subtotal = item.quantidade * item.preco_unitario;
      const orderItem = new OrderItem({
        pedido_codigo: codigo,
        produto_codigo: item.produto_codigo,
        produto_nome: item.produto_nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        subtotal
      });

      await orderRepository.insertOrderItem(orderItem, connection);

      await productRepository.adjustStock(item.produto_codigo, -item.quantidade, connection);
    }

    await connection.commit();
    return { codigo, valor_total };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateOrder(codigo, payload) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const existingOrder = await orderRepository.findByCode(codigo, connection);
    if (!existingOrder) {
      throw new AppError('Pedido não encontrado', 404);
    }

    let valor_total = existingOrder.valor_total;

    if (payload.itens && payload.itens.length) {
      validateOrderPayload({ ...existingOrder.toJSON(), itens: payload.itens });

      const currentItems = await orderRepository.findItemsByOrderCode(codigo, connection);
      for (const item of currentItems) {
        await productRepository.adjustStock(item.produto_codigo, item.quantidade, connection);
      }

      await orderRepository.deleteItemsByOrderCode(codigo, connection);

      valor_total = 0;
      for (const item of payload.itens) {
        const produto = await productRepository.findByCode(item.produto_codigo, connection);
        if (!produto) {
          throw new AppError(`Produto ${item.produto_codigo} não encontrado`, 404);
        }
        if (produto.estoque < item.quantidade) {
          throw new AppError(`Estoque insuficiente para ${item.produto_nome}`, 400);
        }

        const subtotal = item.quantidade * item.preco_unitario;
        valor_total += subtotal;

        const orderItem = new OrderItem({
          pedido_codigo: codigo,
          produto_codigo: item.produto_codigo,
          produto_nome: item.produto_nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          subtotal
        });

        await orderRepository.insertOrderItem(orderItem, connection);

        await productRepository.adjustStock(item.produto_codigo, -item.quantidade, connection);
      }
    }

    const updatedOrder = existingOrder.cloneWith({
      status: payload.status || existingOrder.status,
      observacoes: payload.observacoes ?? existingOrder.observacoes,
      valor_total
    });

    await orderRepository.updateOrder(updatedOrder, connection);

    await connection.commit();
    return { codigo };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteOrder(codigo) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const order = await orderRepository.findByCode(codigo, connection);
    if (!order) {
      throw new AppError('Pedido não encontrado', 404);
    }

    const itens = await orderRepository.findItemsByOrderCode(codigo, connection);
    for (const item of itens) {
      await productRepository.adjustStock(item.produto_codigo, item.quantidade, connection);
    }

    await orderRepository.deleteItemsByOrderCode(codigo, connection);
    await orderRepository.deleteOrder(codigo, connection);

    await connection.commit();
    return { message: 'Pedido excluído com sucesso!' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  listOrders,
  getOrderByCode,
  createOrder,
  updateOrder,
  deleteOrder
};
