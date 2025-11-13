# 🔱 Poseidons - Sistema de Gestão

Sistema Web completo para gerenciamento de **Clientes**, **Produtos** e **Pedidos**, desenvolvido com Node.js, Express e MySQL.

---

## 📋 Sobre o Projeto

Aplicação Web que simula funcionalidades de ERP (como TOTVS Protheus), oferecendo interface moderna e intuitiva para cadastro, visualização, atualização e exclusão de dados, além de emissão de pedidos e controle de estoque integrado.

### **✨ Funcionalidades:**
- 👥 **Gestão de Clientes** - CRUD completo com 20+ campos
- 📦 **Gestão de Produtos** - Controle de estoque, preços e categorias
- 🧾 **Gestão de Pedidos** - Cadastro com itens, validação de estoque e cálculo automático de totais
- 🧭 **Navbar de Navegação** - Troca rápida entre módulos
- 🎨 **Interface Moderna** - Design responsivo com gradientes e animações
- 🔐 **Validação de Dados** - Frontend e backend com mensagens de erro consistentes
- 📊 **Código Automático** - Geração sequencial (C00001, P00001, PED00001…)

---

## 🛠️ Tecnologias

**Backend:** Node.js, Express.js, MySQL2  
**Frontend:** HTML5, CSS3, JavaScript (ES6+)  
**Banco de Dados:** MySQL 8.0+  
**Arquitetura:** MVC + Services + Repository Pattern

---

## 🧱 Arquitetura MVC

A aplicação foi refatorada para seguir rigorosamente o padrão MVC:

- **Controllers (`src/controllers`)** – Recebem as requisições HTTP e retornam as respostas padronizadas.
- **Services (`src/services`)** – Contêm as regras de negócio, geração de códigos, validações e orquestração de transações.
- **Repositories (`src/repositories`)** – Camada exclusiva de acesso ao banco (MySQL) com consultas isoladas.
- **Config (`src/config`)** – Inicialização do pool MySQL e variáveis de ambiente.
- **Errors (`src/errors`)** – Tratamento centralizado com `AppError` e middleware `errorHandler`.
- **Routes (`src/routes`)** – Agrupamento dos módulos /clientes, /produtos e /pedidos.

Essa separação garante testabilidade, reutilização e maior segurança com tratamento consistente de exceções.

---

## 📁 Estrutura do Projeto

```
poseidons-cadastro/
├── src/
│   ├── config/            # Configurações de infraestrutura (MySQL)
│   ├── controllers/       # Camada C (Controllers MVC)
│   ├── errors/            # AppError + middleware global
│   ├── repositories/      # Consultas SQL isoladas
│   ├── routes/            # Rotas organizadas por módulo
│   ├── services/          # Regras de negócio e validações
│   ├── utils/             # Helpers (gerador de códigos sequenciais)
│   ├── app.js             # Configuração do Express
│   └── server.js          # Bootstrap do servidor
├── views/                 # Interface Web (HTML/CSS/JS puros)
├── .env                   # Variáveis de ambiente (não versionado)
├── .gitignore
├── index.js               # Alias para src/server.js
├── package.json
└── README.md
```

---

## ⚙️ Instalação

### **1. Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/poseidons-cadastro.git
cd poseidons-cadastro
```

### **2. Instale as dependências:**
```bash
npm install
```

### **3. Configure o banco de dados:**

Crie o arquivo `.env` na raiz:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=clientes_db
DB_PORT=3306
PORT=3000
```

### **4. Crie as tabelas no MySQL:**
```sql
CREATE DATABASE clientes_db;
USE clientes_db;

-- Tabela de Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    loja VARCHAR(50) NOT NULL,
    razao VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    nomefantasia VARCHAR(100) NOT NULL,
    finalidade VARCHAR(50),
    cnpj VARCHAR(20),
    cep VARCHAR(10),
    pais VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    codmunicipio VARCHAR(10),
    cidade VARCHAR(50) NOT NULL,
    endereco VARCHAR(200),
    bairro VARCHAR(50),
    ddd VARCHAR(5),
    telefone VARCHAR(20) NOT NULL,
    abertura DATE,
    contato VARCHAR(100),
    email VARCHAR(100),
    homepage VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    codigo_barras VARCHAR(50),
    descricao TEXT,
    preco_custo DECIMAL(10, 2) NOT NULL,
    preco_venda DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT DEFAULT 0,
    unidade VARCHAR(10),
    marca VARCHAR(100),
    fornecedor VARCHAR(100),
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(15) UNIQUE NOT NULL,
    cliente_codigo VARCHAR(10) NOT NULL,
    cliente_nome VARCHAR(150) NOT NULL,
    data_pedido DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    valor_total DECIMAL(12,2) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_codigo) REFERENCES clientes(codigo)
);

CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_codigo VARCHAR(15) NOT NULL,
    produto_codigo VARCHAR(10) NOT NULL,
    produto_nome VARCHAR(200) NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (pedido_codigo) REFERENCES pedidos(codigo) ON DELETE CASCADE,
    FOREIGN KEY (produto_codigo) REFERENCES produtos(codigo)
);
```

### **5. Inicie o servidor:**
```bash
npm start
```

### **6. Acesse a aplicação:**
```
http://localhost:3000
```

---

## 🚀 Uso Rápido

### **Clientes:**
- Cadastrar, atualizar, visualizar e excluir com validações frontend/backend.

### **Produtos:**
- Controle completo de estoque, preços, unidades e status ativo/inativo.

### **Pedidos:**
- Seleção do cliente, inclusão de itens, cálculo automático do valor total e baixa automática do estoque.

---

## 🔌 API Endpoints

### **Clientes:**
```
GET    /clientes           # Listar todos
GET    /clientes/:codigo   # Buscar por código
POST   /clientes           # Cadastrar novo
PUT    /clientes/:codigo   # Atualizar
DELETE /clientes/:codigo   # Excluir
```

### **Produtos:**
```
GET    /produtos           # Listar todos
GET    /produtos/:codigo   # Buscar por código
POST   /produtos           # Cadastrar novo
PUT    /produtos/:codigo   # Atualizar
DELETE /produtos/:codigo   # Excluir
```

### **Pedidos:**
```
GET    /pedidos            # Listar todos com dados do cliente
GET    /pedidos/:codigo    # Buscar pedido + itens
POST   /pedidos            # Cadastrar novo pedido (transação + validações)
PUT    /pedidos/:codigo    # Atualizar status/itens (recalcula estoques)
DELETE /pedidos/:codigo    # Excluir pedido (estoque restaurado)
```

---

## 🎨 Características

✅ **Interface Responsiva** - Desktop, tablet e mobile  
✅ **Validação em Tempo Real** - Campos obrigatórios marcados  
✅ **Modais Interativos** - Para todas as operações  
✅ **Feedback Visual** - Loading states e confirmações  
✅ **Logs Detalhados** - Console para debugging  
✅ **Design Moderno** - Gradientes e animações suaves  
✅ **Tratamento Centralizado de Erros** - Respostas JSON padronizadas com `AppError`

---

## 📦 Dependências

```json
{
  "dependencies": {
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "mysql2": "^3.15.0",
    "nodemon": "^3.1.10"
  }
}
```

---

## 👨‍💻 Desenvolvido por
Poseidons Dev Team
