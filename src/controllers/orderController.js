const orderService = require('../services/orderService');

async function listOrders(req, res, next) {
  try {
    const orders = await orderService.listOrders();
    res.json({ pedidos: orders });
  } catch (error) {
    next(error);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderByCode(req.params.codigo);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json({ message: 'Pedido cadastrado com sucesso!', ...result });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const result = await orderService.updateOrder(req.params.codigo, req.body);
    res.json({ message: 'Pedido atualizado com sucesso!', ...result });
  } catch (error) {
    next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const result = await orderService.deleteOrder(req.params.codigo);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
};
