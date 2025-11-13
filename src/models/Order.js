const OrderItem = require('./OrderItem');

class Order {
  constructor({
    codigo,
    cliente_codigo,
    cliente_nome,
    data_pedido,
    status = 'pendente',
    valor_total = 0,
    observacoes = null,
    cliente_razao = null,
    cidade = null,
    estado = null,
    itens = []
  }) {
    this.codigo = codigo;
    this.cliente_codigo = cliente_codigo;
    this.cliente_nome = cliente_nome;
    this.data_pedido = data_pedido;
    this.status = status || 'pendente';
    this.valor_total = Number(valor_total);
    this.observacoes = observacoes ?? null;
    this.cliente_razao = cliente_razao ?? null;
    this.cidade = cidade ?? null;
    this.estado = estado ?? null;
    this.itens = itens.map((item) =>
      item instanceof OrderItem ? item : new OrderItem(item)
    );
  }

  static fromDatabase(row) {
    if (!row) {
      return null;
    }
    return new Order({
      codigo: row.codigo,
      cliente_codigo: row.cliente_codigo,
      cliente_nome: row.cliente_nome,
      data_pedido: row.data_pedido,
      status: row.status,
      valor_total: row.valor_total,
      observacoes: row.observacoes,
      cliente_razao: row.cliente_razao,
      cidade: row.cidade,
      estado: row.estado
    });
  }

  toPersistence() {
    return {
      codigo: this.codigo,
      cliente_codigo: this.cliente_codigo,
      cliente_nome: this.cliente_nome,
      data_pedido: this.data_pedido,
      status: this.status,
      valor_total: this.valor_total,
      observacoes: this.observacoes
    };
  }

  toJSON() {
    return {
      ...this.toPersistence(),
      cliente_razao: this.cliente_razao,
      cidade: this.cidade,
      estado: this.estado,
      itens: this.itens.map((item) => item.toJSON())
    };
  }

  withItems(itens) {
    return new Order({
      ...this.toJSON(),
      itens
    });
  }

  cloneWith(updates) {
    return new Order({
      ...this.toJSON(),
      ...updates
    });
  }
}

module.exports = Order;
