const { Router } = require('express');
const clientController = require('../controllers/clientController');

const router = Router();

router.get('/', clientController.listClients);
router.get('/:codigo', clientController.getClient);
router.post('/', clientController.createClient);
router.put('/:codigo', clientController.updateClient);
router.delete('/:codigo', clientController.deleteClient);

module.exports = router;
