const pool = require('../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

function ensureOrder(data) {
  return data instanceof Order ? data : new Order(data);
}

function ensureOrderItem(data) {
  return data instanceof OrderItem ? data : new OrderItem(data);
}

function getExecutor(connection) {
  return connection || pool;
}

async function findAll() {
  const [rows] = await pool.query(`
    SELECT p.*, c.razao AS cliente_razao
    FROM pedidos p
    LEFT JOIN clientes c ON p.cliente_codigo = c.codigo
    ORDER BY p.id DESC
  `);
  return rows.map((row) => Order.fromDatabase(row));
}

async function findByCode(codigo, connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query(`
    SELECT p.*, c.razao AS cliente_razao, c.cidade, c.estado
    FROM pedidos p
    LEFT JOIN clientes c ON p.cliente_codigo = c.codigo
    WHERE p.codigo = ?
  `, [codigo]);
  return Order.fromDatabase(rows[0]);
}

async function findItemsByOrderCode(codigo, connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT * FROM pedido_itens WHERE pedido_codigo = ?', [codigo]);
  return rows.map((row) => OrderItem.fromDatabase(row));
}

async function insertOrder(order, connection) {
  const executor = getExecutor(connection);
  const entity = ensureOrder(order).toPersistence();

  await executor.query(`
    INSERT INTO pedidos
      (codigo, cliente_codigo, cliente_nome, data_pedido, status, valor_total, observacoes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    entity.codigo,
    entity.cliente_codigo,
    entity.cliente_nome,
    entity.data_pedido,
    entity.status,
    entity.valor_total,
    entity.observacoes
  ]);
}

async function insertOrderItem(item, connection) {
  const executor = getExecutor(connection);
  const entity = ensureOrderItem(item).toPersistence();

  await executor.query(`
    INSERT INTO pedido_itens
      (pedido_codigo, produto_codigo, produto_nome, quantidade, preco_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    entity.pedido_codigo,
    entity.produto_codigo,
    entity.produto_nome,
    entity.quantidade,
    entity.preco_unitario,
    entity.subtotal
  ]);
}

async function deleteItemsByOrderCode(codigo, connection) {
  const executor = getExecutor(connection);
  await executor.query('DELETE FROM pedido_itens WHERE pedido_codigo = ?', [codigo]);
}

async function deleteOrder(codigo, connection) {
  const executor = getExecutor(connection);
  const [result] = await executor.query('DELETE FROM pedidos WHERE codigo = ?', [codigo]);
  return result.affectedRows;
}

async function updateOrder(data, connection) {
  const executor = getExecutor(connection);
  const entity = ensureOrder(data).toPersistence();

  await executor.query(`
    UPDATE pedidos SET
      status = ?, observacoes = ?, valor_total = ?
    WHERE codigo = ?
  `, [entity.status, entity.observacoes, entity.valor_total, entity.codigo]);
}

async function findLastCode(connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT codigo FROM pedidos ORDER BY id DESC LIMIT 1');
  return rows.length ? rows[0].codigo : null;
}

module.exports = {
  findAll,
  findByCode,
  findItemsByOrderCode,
  insertOrder,
  insertOrderItem,
  deleteItemsByOrderCode,
  deleteOrder,
  updateOrder,
  findLastCode
};
