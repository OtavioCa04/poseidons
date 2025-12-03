const AppError = require('../errors/AppError');

const permissions = {
  admin: ['*'],
  gerente: [
    'clientes:read', 'clientes:create', 'clientes:update', 'clientes:delete',
    'produtos:read', 'produtos:create', 'produtos:update', 'produtos:delete',
    'pedidos:read', 'pedidos:create', 'pedidos:update', 'pedidos:delete'
  ],
  funcionario: [
    'clientes:read',
    'produtos:read',
    'pedidos:read', 'pedidos:create', 'pedidos:update'
  ]
};

function checkPermission(...requiredPermissions) {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!userRole) {
      throw new AppError('Permissão não definida', 403);
    }

    const userPermissions = permissions[userRole] || [];

    if (userPermissions.includes('*')) {
      return next();
    }

    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new AppError('Você não tem permissão para realizar esta ação', 403);
    }

    next();
  };
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    throw new AppError('Acesso restrito a administradores', 403);
  }
  next();
}

function isGerenteOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'gerente') {
    throw new AppError('Acesso restrito a gerentes e administradores', 403);
  }
  next();
}

module.exports = {
  checkPermission,
  isAdmin,
  isGerenteOrAdmin
};