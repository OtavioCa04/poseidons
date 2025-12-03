# 🔱 Poseidons - Sistema de Gestão

Sistema Web completo para gerenciamento de **Clientes**, **Produtos** e **Pedidos**, desenvolvido com Node.js, Express e MySQL.

---

## 📋 Sobre o Projeto

Aplicação Web que simula funcionalidades de ERP (como TOTVS Protheus), oferecendo interface moderna e intuitiva para cadastro, visualização, atualização e exclusão de dados, além de emissão de pedidos e controle de estoque integrado.

### **✨ Funcionalidades:**
- 🔐 **Sistema de Autenticação** - Login/registro com bcrypt e JWT
- 👥 **Gestão de Clientes** - CRUD completo com 20+ campos
- 📦 **Gestão de Produtos** - Controle de estoque, preços e categorias
- 🧾 **Gestão de Pedidos** - Cadastro com itens, validação de estoque e cálculo automático de totais
- 🛡️ **Sistema de Permissões** - 3 níveis (Admin, Gerente, Funcionário)
- 📊 **Regras de Negócio** - Proteção contra exclusão de dados vinculados
- 🧭 **Navbar de Navegação** - Troca rápida entre módulos
- 🎨 **Interface Moderna** - Design responsivo com gradientes e animações
- 📊 **Código Automático** - Geração sequencial (C00001, P00001, PED00001…)

---

## 🛠️ Tecnologias

**Backend:** Node.js, Express.js, MySQL2, bcryptjs, jsonwebtoken  
**Frontend:** HTML5, CSS3, JavaScript (ES6+)  
**Banco de Dados:** MySQL 8.0+  
**Arquitetura:** MVC + Services + Repository Pattern

---

## 🧱 Arquitetura MVC

A aplicação foi refatorada para seguir rigorosamente o padrão MVC:

- **Controllers (`src/controllers`)** – Recebem as requisições HTTP e retornam as respostas padronizadas.
- **Services (`src/services`)** – Contêm as regras de negócio, geração de códigos, validações e orquestração de transações.
- **Repositories (`src/repositories`)** – Camada exclusiva de acesso ao banco (MySQL) com consultas isoladas.
- **Middleware (`src/middleware`)** – Autenticação JWT e verificação de permissões.
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
│   ├── middleware/        # Autenticação e permissões
│   ├── models/            # Modelos de dados
│   ├── errors/            # AppError + middleware global
│   ├── repositories/      # Consultas SQL isoladas
│   ├── routes/            # Rotas organizadas por módulo
│   ├── services/          # Regras de negócio e validações
│   ├── utils/             # Helpers (gerador de códigos sequenciais)
│   ├── app.js             # Configuração do Express
│   └── server.js          # Bootstrap do servidor
├── views/                 # Interface Web (HTML/CSS/JS puros)
│   ├── login.html         # Página de login
│   ├── register.html      # Página de cadastro
│   ├── auth.css           # Estilos de autenticação
│   ├── auth.js            # Proteção de rotas
│   └── ...
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
JWT_SECRET=seu-secret-super-seguro-aqui-mude-em-producao
```

### **4. Crie as tabelas no MySQL:**
```sql
CREATE DATABASE clientes_db;
USE clientes_db;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'gerente', 'funcionario') DEFAULT 'funcionario',
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

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

## 🔐 Sistema de Autenticação

### **Funcionalidades de Segurança:**
- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Tokens JWT com expiração de 7 dias
- ✅ HttpOnly cookies para proteção XSS
- ✅ Middleware de autenticação em todas as rotas protegidas
- ✅ Sistema de permissões por nível de usuário

### **Níveis de Permissão:**

| Nível | Clientes | Produtos | Pedidos |
|-------|----------|----------|---------|
| **Gerente** | ✅ Todos | ✅ Todos | ✅ Todos |
| **Funcionário** | 👁️ Visualizar | 👁️ Visualizar | ✅ Criar/Editar |

### **Primeiro Acesso:**
1. Acesse `http://localhost:3000`
2. Clique em "Cadastre-se"
3. Preencha os dados (será criado como "funcionário")
4. Para promover a admin, execute no MySQL:
```sql
UPDATE usuarios SET role = 'admin' WHERE email = 'seu@email.com';
```

---

## 🛡️ Regras de Negócio

### **Proteções Implementadas:**
1. ❌ **Não é possível excluir cliente com pedidos vinculados**
2. ❌ **Não é possível excluir produto que está em pedidos**
3. ✅ **Validação de estoque ao criar/editar pedidos**
4. ✅ **Atualização automática de estoque em pedidos**
5. ✅ **Restauração de estoque ao excluir pedidos**
6. ✅ **Controle de acesso por permissões**

---

## 🚀 Uso Rápido

### **Login:**
- Acesse o sistema e faça login com suas credenciais
- Token válido por 7 dias

### **Clientes:**
- Cadastrar, atualizar, visualizar e excluir (com permissão)
- Validações frontend/backend

### **Produtos:**
- Controle completo de estoque, preços e status
- Não pode excluir produtos com pedidos vinculados

### **Pedidos:**
- Seleção do cliente e inclusão de itens
- Cálculo automático do valor total
- Baixa automática do estoque
- Validação de estoque disponível

---

## 🔌 API Endpoints

### **Autenticação:**
```
POST   /auth/register      # Criar nova conta
POST   /auth/login         # Fazer login
GET    /auth/verify        # Verificar token
GET    /auth/me            # Dados do usuário atual
POST   /auth/logout        # Fazer logout
```

### **Clientes:**
```
GET    /clientes           # Listar todos (requer permissão)
GET    /clientes/:codigo   # Buscar por código
POST   /clientes           # Cadastrar novo (gerente/admin)
PUT    /clientes/:codigo   # Atualizar (gerente/admin)
DELETE /clientes/:codigo   # Excluir (gerente/admin)
```

### **Produtos:**
```
GET    /produtos           # Listar todos
GET    /produtos/:codigo   # Buscar por código
POST   /produtos           # Cadastrar novo (gerente/admin)
PUT    /produtos/:codigo   # Atualizar (gerente/admin)
DELETE /produtos/:codigo   # Excluir (gerente/admin)
```

### **Pedidos:**
```
GET    /pedidos            # Listar todos
GET    /pedidos/:codigo    # Buscar pedido + itens
POST   /pedidos            # Cadastrar novo
PUT    /pedidos/:codigo    # Atualizar status/itens
DELETE /pedidos/:codigo    # Excluir (gerente/admin)
```

---

## 🎨 Características

✅ **Interface Responsiva** - Desktop, tablet e mobile  
✅ **Autenticação Segura** - bcrypt + JWT  
✅ **Sistema de Permissões** - 3 níveis de acesso  
✅ **Validação em Tempo Real** - Campos obrigatórios marcados  
✅ **Modais Interativos** - Para todas as operações  
✅ **Feedback Visual** - Loading states e confirmações  
✅ **Proteção de Dados** - Regras de negócio aplicadas  
✅ **Design Moderno** - Gradientes e animações suaves  
✅ **Tratamento de Erros** - Respostas JSON padronizadas

---

