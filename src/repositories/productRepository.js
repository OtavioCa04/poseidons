const pool = require('../config/database');
const Product = require('../models/Product');

function ensureProduct(data) {
  return data instanceof Product ? data : new Product(data);
}

function getExecutor(connection) {
  return connection || pool;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
  return rows.map((row) => Product.fromDatabase(row));
}

async function findByCode(codigo, connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT * FROM produtos WHERE codigo = ?', [codigo]);
  return Product.fromDatabase(rows[0]);
}

async function findLastCode(connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT codigo FROM produtos ORDER BY id DESC LIMIT 1');
  return rows.length ? rows[0].codigo : null;
}

async function create(data, connection) {
  const executor = getExecutor(connection);
  const product = ensureProduct(data);
  const entity = product.toPersistence();

  await executor.query(`
    INSERT INTO produtos
      (codigo, nome, categoria, codigo_barras, descricao,
       preco_custo, preco_venda, estoque, estoque_minimo,
       unidade, marca, fornecedor, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    entity.codigo,
    entity.nome,
    entity.categoria,
    entity.codigo_barras,
    entity.descricao,
    entity.preco_custo,
    entity.preco_venda,
    entity.estoque,
    entity.estoque_minimo,
    entity.unidade,
    entity.marca,
    entity.fornecedor,
    entity.status
  ]);
}

async function update(data, connection) {
  const executor = getExecutor(connection);
  const product = ensureProduct(data);
  const entity = product.toPersistence();

  const [result] = await executor.query(`
    UPDATE produtos SET
      nome = ?, categoria = ?, codigo_barras = ?, descricao = ?,
      preco_custo = ?, preco_venda = ?, estoque = ?, estoque_minimo = ?,
      unidade = ?, marca = ?, fornecedor = ?, status = ?
    WHERE codigo = ?
  `, [
    entity.nome,
    entity.categoria,
    entity.codigo_barras,
    entity.descricao,
    entity.preco_custo,
    entity.preco_venda,
    entity.estoque,
    entity.estoque_minimo,
    entity.unidade,
    entity.marca,
    entity.fornecedor,
    entity.status,
    entity.codigo
  ]);
  return result.affectedRows;
}

async function remove(codigo, connection) {
  const executor = getExecutor(connection);
  const [result] = await executor.query('DELETE FROM produtos WHERE codigo = ?', [codigo]);
  return result.affectedRows;
}

async function adjustStock(codigo, delta, connection) {
  const executor = getExecutor(connection);
  await executor.query('UPDATE produtos SET estoque = estoque + ? WHERE codigo = ?', [delta, codigo]);
}

module.exports = {
  findAll,
  findByCode,
  findLastCode,
  create,
  update,
  remove,
  adjustStock
};
