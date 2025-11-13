const { Router } = require('express');
const clientRoutes = require('./clientRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

const router = Router();

router.use('/clientes', clientRoutes);
router.use('/produtos', productRoutes);
router.use('/pedidos', orderRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
