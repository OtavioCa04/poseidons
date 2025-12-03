const pool = require('../config/database');
const User = require('../models/User');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return User.fromDatabase(rows[0]);
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  return User.fromDatabase(rows[0]);
}

async function create(userData) {
  const { nome, email, role, senha } = userData;
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, role, senha) VALUES (?, ?, ?, ?)',
    [nome, email, role || 'funcionario', senha]
  );
  return result.insertId;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
  return rows.map(row => User.fromDatabase(row));
}

module.exports = {
  findByEmail,
  findById,
  create,
  findAll
};