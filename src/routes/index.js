const { Router } = require('express');
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = Router();

router.use('/auth', authRoutes);

router.use('/clientes', authenticateToken, clientRoutes);
router.use('/produtos', authenticateToken, productRoutes);
router.use('/pedidos', authenticateToken, orderRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;