const { Router } = require('express');
const orderController = require('../controllers/orderController');
const { checkPermission } = require('../middleware/permissionMiddleware');

const router = Router();

router.get('/', checkPermission('pedidos:read'), orderController.listOrders);
router.get('/:codigo', checkPermission('pedidos:read'), orderController.getOrder);
router.post('/', checkPermission('pedidos:create'), orderController.createOrder);
router.put('/:codigo', checkPermission('pedidos:update'), orderController.updateOrder);
router.delete('/:codigo', checkPermission('pedidos:delete'), orderController.deleteOrder);

module.exports = router;