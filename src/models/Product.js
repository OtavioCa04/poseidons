class Product {
  constructor({
    codigo, nome, categoria, codigo_barras, descricao, preco_custo, preco_venda,
    estoque, estoque_minimo, unidade, marca, fornecedor, status = 'ativo'
  }) {
    this.codigo = codigo;
    this.nome = nome;
    this.categoria = categoria;
    this.codigo_barras = codigo_barras;
    this.descricao = descricao;
    this.preco_custo = Number(preco_custo);
    this.preco_venda = Number(preco_venda);
    this.estoque = Number(estoque);
    this.estoque_minimo = Number(estoque_minimo);
    this.unidade = unidade;
    this.marca = marca;
    this.fornecedor = fornecedor;
    this.status = status || 'ativo';
  }

  static fromDatabase(row) {
    if (!row) {
      return null;
    }
    return new Product({
      codigo: row.codigo,
      nome: row.nome,
      categoria: row.categoria,
      codigo_barras: row.codigo_barras,
      descricao: row.descricao,
      preco_custo: row.preco_custo,
      preco_venda: row.preco_venda,
      estoque: row.estoque,
      estoque_minimo: row.estoque_minimo,
      unidade: row.unidade,
      marca: row.marca,
      fornecedor: row.fornecedor,
      status: row.status
    });
  }

  toPersistence() {
    return {
      codigo: this.codigo,
      nome: this.nome,
      categoria: this.categoria,
      codigo_barras: this.codigo_barras,
      descricao: this.descricao,
      preco_custo: this.preco_custo,
      preco_venda: this.preco_venda,
      estoque: this.estoque,
      estoque_minimo: this.estoque_minimo,
      unidade: this.unidade,
      marca: this.marca,
      fornecedor: this.fornecedor,
      status: this.status
    };
  }

  toJSON() {
    return { ...this.toPersistence() };
  }
}

module.exports = Product;
