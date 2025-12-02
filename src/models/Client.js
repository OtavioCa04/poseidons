class Client {
  constructor({
    codigo, loja, razao, tipo, nomefantasia, finalidade, cnpj, cep, pais, estado, codmunicipio, cidade,
    endereco, bairro, ddd, telefone, abertura, contato, email, homepage = null
  }) {
    this.codigo = codigo;
    this.loja = loja;
    this.razao = razao;
    this.tipo = tipo;
    this.nomefantasia = nomefantasia;
    this.finalidade = finalidade;
    this.cnpj = cnpj;
    this.cep = cep;
    this.pais = pais;
    this.estado = estado;
    this.codmunicipio = codmunicipio;
    this.cidade = cidade;
    this.endereco = endereco;
    this.bairro = bairro;
    this.ddd = ddd;
    this.telefone = telefone;
    this.abertura = abertura;
    this.contato = contato;
    this.email = email;
    this.homepage = homepage ?? null;
  }

  static fromDatabase(row) {
    if (!row) {
      return null;
    }
    return new Client({
      codigo: row.codigo,
      loja: row.loja,
      razao: row.razao,
      tipo: row.tipo,
      nomefantasia: row.nomefantasia,
      finalidade: row.finalidade,
      cnpj: row.cnpj,
      cep: row.cep,
      pais: row.pais,
      estado: row.estado,
      codmunicipio: row.codmunicipio,
      cidade: row.cidade,
      endereco: row.endereco,
      bairro: row.bairro,
      ddd: row.ddd,
      telefone: row.telefone,
      abertura: row.abertura,
      contato: row.contato,
      email: row.email,
      homepage: row.homepage
    });
  }

  toPersistence() {
    return {
      codigo: this.codigo,
      loja: this.loja,
      razao: this.razao,
      tipo: this.tipo,
      nomefantasia: this.nomefantasia,
      finalidade: this.finalidade,
      cnpj: this.cnpj,
      cep: this.cep,
      pais: this.pais,
      estado: this.estado,
      codmunicipio: this.codmunicipio,
      cidade: this.cidade,
      endereco: this.endereco,
      bairro: this.bairro,
      ddd: this.ddd,
      telefone: this.telefone,
      abertura: this.abertura,
      contato: this.contato,
      email: this.email,
      homepage: this.homepage ?? null
    };
  }

  toJSON() {
    return { ...this.toPersistence() };
  }
}

module.exports = Client;
