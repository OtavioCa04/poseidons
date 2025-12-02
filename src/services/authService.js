const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const userRepository = require('../repositories/userRepository');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const SALT_ROUNDS = 10;

async function register(nome, email, senha) {
  if (!nome || !email || !senha) {
    throw new AppError('Nome, email e senha são obrigatórios', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Email inválido', 400);
  }

  if (senha.length < 6) {
    throw new AppError('Senha deve ter no mínimo 6 caracteres', 400);
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email já cadastrado', 400);
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

  const userId = await userRepository.create({
    nome,
    email,
    senha: senhaHash
  });

  const user = await userRepository.findById(userId);

  const token = jwt.sign(
    { id: user.id, email: user.email, nome: user.nome },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: user.toJSON()
  };
}

async function login(email, senha) {
  if (!email || !senha) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) {
    throw new AppError('Email ou senha incorretos', 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, nome: user.nome },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: user.toJSON()
  };
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.id);
    
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user.toJSON();
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

module.exports = {
  register,
  login,
  verifyToken
};