const AppError = require('../errors/AppError');
const clientRepository = require('../repositories/clientRepository');
const { generateSequentialCode } = require('../utils/codeGenerator');
const Client = require('../models/Client');

const CLIENT_PREFIX = 'C';
const CLIENT_CODE_SIZE = 5;

function validateClientPayload(payload) {
  const requiredFields = [
    'loja', 'razao', 'tipo', 'nomefantasia', 'finalidade',
    'cnpj', 'cep', 'pais', 'estado', 'codmunicipio', 'cidade',
    'endereco', 'bairro', 'ddd', 'telefone', 'abertura',
    'contato', 'email'
  ];

  const missingFields = requiredFields.filter((field) => !payload[field]);
  if (missingFields.length) {
    throw new AppError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`,
      400
    );
  }
}

async function listClients() {
  const clients = await clientRepository.findAll();
  return clients.map((client) => client.toJSON());
}

async function getClientByCode(codigo) {
  const client = await clientRepository.findByCode(codigo);
  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }
  return client.toJSON();
}

async function createClient(payload) {
  validateClientPayload(payload);
  const lastCode = await clientRepository.findLastCode();
  const codigo = generateSequentialCode(CLIENT_PREFIX, lastCode, CLIENT_CODE_SIZE);

  const client = new Client({ ...payload, codigo });
  await clientRepository.create(client);
  return { codigo };
}

async function updateClient(codigo, payload) {
  validateClientPayload(payload);
  const client = new Client({ ...payload, codigo });
  const affectedRows = await clientRepository.update(client);
  if (!affectedRows) {
    throw new AppError('Cliente não encontrado', 404);
  }
  return { codigo, linhasAfetadas: affectedRows };
}

async function deleteClient(codigo) {
  const affectedRows = await clientRepository.remove(codigo);
  if (!affectedRows) {
    throw new AppError('Cliente não encontrado', 404);
  }
  return { message: 'Cliente excluído com sucesso!' };
}

module.exports = {
  listClients,
  getClientByCode,
  createClient,
  updateClient,
  deleteClient
};
