const { Router } = require('express');
const productController = require('../controllers/productController');
const { checkPermission } = require('../middleware/permissionMiddleware');

const router = Router();

router.get('/', checkPermission('produtos:read'), productController.listProducts);
router.get('/:codigo', checkPermission('produtos:read'), productController.getProduct);
router.post('/', checkPermission('produtos:create'), productController.createProduct);
router.put('/:codigo', checkPermission('produtos:update'), productController.updateProduct);
router.delete('/:codigo', checkPermission('produtos:delete'), productController.deleteProduct);

module.exports = router;