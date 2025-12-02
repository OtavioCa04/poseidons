const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    const result = await authService.register(nome, email, senha);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({
      message: 'Login realizado com sucesso!',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout realizado com sucesso!' });
}

async function me(req, res, next) {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const user = await authService.verifyToken(token);
    res.json({ authenticated: true, user });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
  verify
};