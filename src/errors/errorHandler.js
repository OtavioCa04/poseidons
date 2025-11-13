const AppError = require('./AppError');

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || undefined
    });
  }

  console.error('❌ Erro inesperado:', err);
  return res.status(500).json({ error: 'Erro interno do servidor' });
}

module.exports = errorHandler;
