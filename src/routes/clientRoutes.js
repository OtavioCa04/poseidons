const { Router } = require('express');
const clientController = require('../controllers/clientController');
const { checkPermission } = require('../middleware/permissionMiddleware');

const router = Router();

router.get('/', checkPermission('clientes:read'), clientController.listClients);
router.get('/:codigo', checkPermission('clientes:read'), clientController.getClient);
router.post('/', checkPermission('clientes:create'), clientController.createClient);
router.put('/:codigo', checkPermission('clientes:update'), clientController.updateClient);
router.delete('/:codigo', checkPermission('clientes:delete'), clientController.deleteClient);

module.exports = router;