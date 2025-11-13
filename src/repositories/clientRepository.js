const pool = require('../config/database');
const Client = require('../models/Client');

function ensureClient(data) {
  return data instanceof Client ? data : new Client(data);
}

function getExecutor(connection) {
  return connection || pool;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
  return rows.map((row) => Client.fromDatabase(row));
}

async function findByCode(codigo, connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT * FROM clientes WHERE codigo = ?', [codigo]);
  return Client.fromDatabase(rows[0]);
}

async function findLastCode(connection) {
  const executor = getExecutor(connection);
  const [rows] = await executor.query('SELECT codigo FROM clientes ORDER BY id DESC LIMIT 1');
  return rows.length ? rows[0].codigo : null;
}

async function create(data, connection) {
  const executor = getExecutor(connection);
  const client = ensureClient(data);
  const entity = client.toPersistence();

  await executor.query(`
    INSERT INTO clientes
    (codigo, loja, razao, tipo, nomefantasia, finalidade,
     cnpj, cep, pais, estado, codmunicipio, cidade,
     endereco, bairro, ddd, telefone, abertura,
     contato, email, homepage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    entity.codigo,
    entity.loja,
    entity.razao,
    entity.tipo,
    entity.nomefantasia,
    entity.finalidade,
    entity.cnpj,
    entity.cep,
    entity.pais,
    entity.estado,
    entity.codmunicipio,
    entity.cidade,
    entity.endereco,
    entity.bairro,
    entity.ddd,
    entity.telefone,
    entity.abertura,
    entity.contato,
    entity.email,
    entity.homepage
  ]);
}

async function update(data, connection) {
  const executor = getExecutor(connection);
  const client = ensureClient(data);
  const entity = client.toPersistence();

  const [result] = await executor.query(`
    UPDATE clientes SET
      loja = ?, razao = ?, tipo = ?, nomefantasia = ?, finalidade = ?,
      cnpj = ?, cep = ?, pais = ?, estado = ?, codmunicipio = ?, cidade = ?,
      endereco = ?, bairro = ?, ddd = ?, telefone = ?, abertura = ?,
      contato = ?, email = ?, homepage = ?
    WHERE codigo = ?
  `, [
    entity.loja,
    entity.razao,
    entity.tipo,
    entity.nomefantasia,
    entity.finalidade,
    entity.cnpj,
    entity.cep,
    entity.pais,
    entity.estado,
    entity.codmunicipio,
    entity.cidade,
    entity.endereco,
    entity.bairro,
    entity.ddd,
    entity.telefone,
    entity.abertura,
    entity.contato,
    entity.email,
    entity.homepage,
    entity.codigo
  ]);
  return result.affectedRows;
}

async function remove(codigo, connection) {
  const executor = getExecutor(connection);
  const [result] = await executor.query('DELETE FROM clientes WHERE codigo = ?', [codigo]);
  return result.affectedRows;
}

module.exports = {
  findAll,
  findByCode,
  findLastCode,
  create,
  update,
  remove
};
