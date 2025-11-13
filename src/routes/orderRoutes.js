const { Router } = require('express');
const orderController = require('../controllers/orderController');

const router = Router();

router.get('/', orderController.listOrders);
router.get('/:codigo', orderController.getOrder);
router.post('/', orderController.createOrder);
router.put('/:codigo', orderController.updateOrder);
router.delete('/:codigo', orderController.deleteOrder);

module.exports = router;
