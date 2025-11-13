const { Router } = require('express');
const productController = require('../controllers/productController');

const router = Router();

router.get('/', productController.listProducts);
router.get('/:codigo', productController.getProduct);
router.post('/', productController.createProduct);
router.put('/:codigo', productController.updateProduct);
router.delete('/:codigo', productController.deleteProduct);

module.exports = router;
