const clientService = require('../services/clientService');

async function listClients(req, res, next) {
  try {
    const clients = await clientService.listClients();
    res.json({ clientes: clients });
  } catch (error) {
    next(error);
  }
}

async function getClient(req, res, next) {
  try {
    const client = await clientService.getClientByCode(req.params.codigo);
    res.json(client);
  } catch (error) {
    next(error);
  }
}

async function createClient(req, res, next) {
  try {
    const result = await clientService.createClient(req.body);
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', ...result });
  } catch (error) {
    next(error);
  }
}

async function updateClient(req, res, next) {
  try {
    const result = await clientService.updateClient(req.params.codigo, req.body);
    res.json({ message: 'Cliente atualizado com sucesso!', ...result });
  } catch (error) {
    next(error);
  }
}

async function deleteClient(req, res, next) {
  try {
    const result = await clientService.deleteClient(req.params.codigo);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
};
