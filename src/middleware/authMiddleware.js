const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

function authenticateToken(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('Token de autenticação não fornecido', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

module.exports = { authenticateToken, JWT_SECRET };