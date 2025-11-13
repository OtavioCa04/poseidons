const AppError = require('../errors/AppError');
const productRepository = require('../repositories/productRepository');
const { generateSequentialCode } = require('../utils/codeGenerator');
const Product = require('../models/Product');

const PRODUCT_PREFIX = 'P';
const PRODUCT_CODE_SIZE = 5;

function validateProductPayload(payload) {
  const requiredFields = [
    'nome', 'categoria', 'preco_custo', 'preco_venda', 'estoque',
    'estoque_minimo', 'unidade', 'marca', 'fornecedor'
  ];

  const missingFields = requiredFields.filter((field) =>
    payload[field] === undefined || payload[field] === null || payload[field] === ''
  );

  if (missingFields.length) {
    throw new AppError(
      `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`,
      400
    );
  }
}

async function listProducts() {
  const products = await productRepository.findAll();
  return products.map((product) => product.toJSON());
}

async function getProductByCode(codigo) {
  const product = await productRepository.findByCode(codigo);
  if (!product) {
    throw new AppError('Produto não encontrado', 404);
  }
  return product.toJSON();
}

async function createProduct(payload) {
  validateProductPayload(payload);
  const lastCode = await productRepository.findLastCode();
  const codigo = generateSequentialCode(PRODUCT_PREFIX, lastCode, PRODUCT_CODE_SIZE);

  const product = new Product({
    ...payload,
    codigo,
    status: payload.status || 'ativo'
  });

  await productRepository.create(product);

  return { codigo };
}

async function updateProduct(codigo, payload) {
  validateProductPayload(payload);
  const existingProduct = await productRepository.findByCode(codigo);
  if (!existingProduct) {
    throw new AppError('Produto não encontrado', 404);
  }

  const product = new Product({
    ...payload,
    codigo,
    status: payload.status ?? existingProduct.status
  });

  const affectedRows = await productRepository.update(product);
  return { codigo, linhasAfetadas: affectedRows };
}

async function deleteProduct(codigo) {
  const affectedRows = await productRepository.remove(codigo);
  if (!affectedRows) {
    throw new AppError('Produto não encontrado', 404);
  }
  return { message: 'Produto excluído com sucesso!' };
}

module.exports = {
  listProducts,
  getProductByCode,
  createProduct,
  updateProduct,
  deleteProduct
};
