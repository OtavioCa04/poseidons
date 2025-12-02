class User {
  constructor({
    id, nome, email, senha, created_at, updated_at
  }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromDatabase(row) {
    if (!row) {
      return null;
    }
    return new User({
      id: row.id,
      nome: row.nome,
      email: row.email,
      senha: row.senha,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }

  toPersistence() {
    return {
      nome: this.nome,
      email: this.email,
      senha: this.senha
    };
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;