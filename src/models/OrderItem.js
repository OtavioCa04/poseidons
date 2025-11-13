class OrderItem {
  constructor({
    pedido_codigo,
    produto_codigo,
    produto_nome,
    quantidade,
    preco_unitario,
    subtotal
  }) {
    this.pedido_codigo = pedido_codigo;
    this.produto_codigo = produto_codigo;
    this.produto_nome = produto_nome;
    this.quantidade = Number(quantidade);
    this.preco_unitario = Number(preco_unitario);
    this.subtotal = Number(subtotal);
  }

  static fromDatabase(row) {
    if (!row) {
      return null;
    }
    return new OrderItem({
      pedido_codigo: row.pedido_codigo,
      produto_codigo: row.produto_codigo,
      produto_nome: row.produto_nome,
      quantidade: row.quantidade,
      preco_unitario: row.preco_unitario,
      subtotal: row.subtotal
    });
  }

  toPersistence() {
    return {
      pedido_codigo: this.pedido_codigo,
      produto_codigo: this.produto_codigo,
      produto_nome: this.produto_nome,
      quantidade: this.quantidade,
      preco_unitario: this.preco_unitario,
      subtotal: this.subtotal
    };
  }

  toJSON() {
    return { ...this.toPersistence() };
  }
}

module.exports = OrderItem;
