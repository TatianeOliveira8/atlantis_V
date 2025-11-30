# Atlantis - Gestão de Parque Aquático

Sistema acadêmico completo para gerenciar clientes, dependentes, acomodações e hospedagens em um parque aquático.

## 📋 Estrutura e Funcionalidades

O Atlantis é desenvolvido com arquitetura separada entre **Frontend** e **Backend**, utilizando APIs REST para comunicação.

### Funcionalidades Principais

- **CRUD completo de clientes (titulares)** - Criar, editar, listar e deletar titulares
- **Gestão de dependentes** - Criar dependentes com herança automática de dados do titular
- **Lista de acomodações** - Exibir 6 tipos de acomodações pré-configuradas (somente leitura)
- **Registro de hospedagens** - Vincular clientes a acomodações com datas
- **Sistema de busca** - Pesquisar titulares e dependentes por nome
- **Validação de dados** - Campos obrigatórios com mensagens de erro claras
- **Interface responsiva** - Frontend SPA com React + TailwindCSS

---

## 🏗️ Arquitetura do Projeto

```
Atlantis/
├── front/                          # Frontend - React SPA
│   ├── src/
│   │   ├── features/              # Componentes por funcionalidade
│   │   │   ├── clientes/          # Gestão de titulares e dependentes
│   │   │   ├── hospedagem/        # Gestão de hospedagens
│   │   │   ├── acomodacoes/       # Listagem de acomodações
│   │   │   └── pesquisa/          # Componentes de busca
│   │   ├── shared/                # Código compartilhado
│   │   │   └── api.ts             # Cliente HTTP (chamadas de API)
│   │   └── App.tsx                # Componente raiz
│   ├── package.json
│   └── vite.config.ts
│
├── back-clientes/                 # Backend 1 - Titulares e Dependentes
│   ├── src/ts/
│   │   ├── database/              # Configuração do banco de dados
│   │   │   └── database.ts        # Queries SQL e métodos CRUD
│   │   ├── modelos/               # Classes de domínio
│   │   ├── interfaces/            # Interfaces TypeScript
│   │   ├── enumeracoes/           # Enums
│   │   ├── abstracoes/            # Classes abstratas
│   │   ├── dominio/               # Lógica de domínio
│   │   └── simple_server.ts       # Servidor HTTP + endpoints
│   ├── .env                       # Variáveis de ambiente
│   └── package.json
│
└── back-hospedagem-acomodacoes/   # Backend 2 - Acomodações e Hospedagens
    ├── src/ts/
    │   ├── database/              # Configuração do banco de dados
    │   │   └── database.ts        # Queries SQL e métodos CRUD
    │   ├── diretores/             # Padrão Diretor (construção de acomodações)
    │   │   ├── DiretorCasalSimples.ts
    │   │   ├── DiretorFamiliaSimples.ts
    │   │   ├── DiretorFamiliaMais.ts
    │   │   ├── DiretorFamiliaSuper.ts
    │   │   ├── DiretorSolteiroSimples.ts
    │   │   └── DiretorSolteiroMais.ts
    │   ├── construtores/          # Classes Builder
    │   ├── modelos/               # Classes de domínio
    │   ├── interfaces/            # Interfaces TypeScript
    │   ├── enumeracoes/           # Enums
    │   ├── abstracoes/            # Classes abstratas
    │   ├── dominio/               # Lógica de domínio
    │   └── simple_server.ts       # Servidor HTTP + endpoints
    ├── .env                       # Variáveis de ambiente
    └── package.json
```

---

## 🚀 Rodando o Projeto

### Pré-requisitos

- **Node.js:** v22 ou superior
- **npm:** v10 ou superior
- **MySQL:** v8 ou superior (ou servidor MySQL em execução)

### 1. Clonar e Instalar Dependências

```bash
# Frontend
cd front
npm install

# Backend 1 - Clientes
cd ../back-clientes
npm install

# Backend 2 - Hospedagem e Acomodações
cd ../back-hospedagem-acomodacoes
npm install
```

### 2. Configurar Banco de Dados

#### Criar Banco de Dados MySQL

```sql
CREATE DATABASE atlantis;
USE atlantis;
```

#### Configurar Variáveis de Ambiente

**back-clientes/.env:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=atlantis
DB_USER=root
DB_PASSWORD=sua_senha
NODE_ENV=development
PORT=3001
```

**back-hospedagem-acomodacoes/.env:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=atlantis
DB_USER=root
DB_PASSWORD=sua_senha
NODE_ENV=development
PORT=3002
```

> ⚠️ **Nota:** As tabelas são criadas automaticamente quando os servidores iniciam.

### 3. Executar Ambiente de Desenvolvimento

#### Terminal 1 - Frontend
```bash
cd front
npm run dev
# Acesse: http://localhost:5173
```

#### Terminal 2 - Backend Clientes
```bash
cd back-clientes
npm run start:server
# Servidor rodando em: http://localhost:3001
```

#### Terminal 3 - Backend Hospedagem
```bash
cd back-hospedagem-acomodacoes
npm run start:server
# Servidor rodando em: http://localhost:3002
```

---

## 🗄️ Banco de Dados

### Tipo de Banco

- **Sistema:** MySQL 8.0+
- **Gerenciador:** mysql2/promise (pool de conexões)
- **Configuração:** Via arquivo `.env` em cada backend

### Tabelas Principais

#### Backend Clientes (back-clientes)

**Tabela: `titulares`**
```sql
CREATE TABLE titulares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nomeSocial VARCHAR(255),
    dataNascimento VARCHAR(20) NOT NULL,
    dataCadastro VARCHAR(20),
    telefones TEXT,      -- JSON: Array de telefones
    endereco TEXT,       -- JSON: Objeto com endereço
    documentos TEXT      -- JSON: Array de documentos (CPF, RG, passaporte)
);
```

**Tabela: `dependentes`**
```sql
CREATE TABLE dependentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titular_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nomeSocial VARCHAR(255),
    dataNascimento VARCHAR(20) NOT NULL,
    dataCadastro VARCHAR(20),
    telefones TEXT,      -- JSON: Herdado do titular
    endereco TEXT,       -- JSON: Clonado do titular (editável)
    documentos TEXT,     -- JSON: Herdado do titular
    FOREIGN KEY (titular_id) REFERENCES titulares(id) ON DELETE CASCADE
);
```

**View: `clientes`**
```sql
CREATE VIEW clientes AS
SELECT id, nome, nomeSocial, dataNascimento, dataCadastro, 
       telefones, endereco, documentos, NULL as titular_id
FROM titulares
UNION ALL
SELECT id, nome, nomeSocial, dataNascimento, dataCadastro, 
       telefones, endereco, documentos, titular_id
FROM dependentes;
```

#### Backend Hospedagem (back-hospedagem-acomodacoes)

**Tabela: `hospedagens`**
```sql
CREATE TABLE hospedagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titularId INT NOT NULL,
    dataCheckIn VARCHAR(20) NOT NULL,
    dataCheckOut VARCHAR(20) NOT NULL,
    acomodacaoId INT,
    statusHospedagem VARCHAR(50),
    dataCadastro VARCHAR(20)
);
```

### Localização do Banco

O banco está instalado localmente no servidor MySQL configurado em `.env`:

```
Endereço: localhost:3306
Banco: atlantis
Usuário: Configurável via .env
Senha: Configurável via .env
```

### Inicialização Automática

Quando cada backend inicia, ele:
1. Conecta ao banco de dados MySQL
2. Verifica se as tabelas existem
3. Cria as tabelas se não existirem
4. Cria a view `clientes` se não existir
5. Exibe mensagem de sucesso no console

---

## 🔌 Endpoints da API

### Backend Clientes (http://localhost:3001)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/titulares` | Listar todos os titulares |
| GET | `/dependentes` | Listar todos os dependentes |
| GET | `/clientes` | Listar todos (titulares + dependentes) |
| POST | `/clientes` | Criar novo titular ou dependente |
| PUT | `/clientes` | Editar titular ou dependente |
| DELETE | `/clientes?id={id}` | Deletar titular ou dependente |

**Exemplo de Requisição - Criar Titular:**
```json
POST /clientes
{
  "nome": "João Silva",
  "nomeSocial": "João",
  "dataNascimento": "1990-01-15",
  "telefones": [
    { "ddd": "11", "numero": "98765-4321" }
  ],
  "endereco": {
    "rua": "Rua A",
    "numero": "100",
    "cidade": "São Paulo"
  },
  "documentos": [
    { "tipo": "CPF", "numero": "123.456.789-00" }
  ]
}
```

**Exemplo de Requisição - Criar Dependente:**
```json
POST /clientes
{
  "titular_id": 1,
  "nome": "Maria Silva",
  "nomeSocial": "Maria",
  "dataNascimento": "2015-05-20"
}
```
> Nota: Telefones, endereço e documentos são herdados automaticamente do titular.

### Backend Hospedagem (http://localhost:3002)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/acomodacoes` | Listar 6 acomodações pré-configuradas |
| GET | `/hospedagens` | Listar todas as hospedagens |
| POST | `/hospedagens` | Criar nova hospedagem |
| PUT | `/hospedagens` | Editar hospedagem |
| DELETE | `/hospedagens?id={id}` | Deletar hospedagem |

**Exemplo de Requisição - Criar Hospedagem:**
```json
POST /hospedagens
{
  "titularId": 1,
  "dataCheckIn": "2024-01-15",
  "dataCheckOut": "2024-01-20",
  "acomodacaoId": 3,
  "statusHospedagem": "Ativa"
}
```

---

## 📦 Principais Dependências

### Frontend

| Dependência | Versão | Uso |
|-------------|--------|-----|
| React | 19.2.0 | Framework UI |
| React DOM | 19.2.0 | Renderização DOM |
| React Router Dom | 7.9.6 | Roteamento SPA |
| TailwindCSS | 4.1.17 | Estilos CSS |
| React Icons | 5.5.0 | Ícones |
| TypeScript | ~5.9.3 | Tipagem estática |
| Vite | 7.2.2 | Build tool |

### Backend

| Dependência | Versão | Uso |
|-------------|--------|-----|
| mysql2 | Última | Driver MySQL |
| TypeScript | ~5.9.3 | Tipagem estática |
| ts-node | Última | Executar TypeScript |
| dotenv | Última | Variáveis de ambiente |
| Node.js | 22 | Runtime JavaScript |

---

## 🧪 Ambiente de Teste

- **Node.js:** v22
- **React:** 19
- **TailwindCSS:** 4
- **Vite:** 7
- **TypeScript:** ~5.9.3
- **MySQL:** 8.0+
- **Navegador:** Chrome/Firefox/Safari (últimas versões)

---

## ✨ Funcionalidades Específicas

### Herança de Dados (Titular → Dependente)

Quando um dependente é criado:
- ✅ **Herda:** telefones, documentos, endereço do titular
- ✅ **Clone profundo** do endereço do titular (pode ser editado independentemente)
- ✅ **Dados únicos:** nome, nome social, data de nascimento
- ✅ Se titular mudar endereço, dependente mantém seu endereço

**Exemplo:**
```
Titular: João Silva
├─ Telefone: (11) 98765-4321
├─ Endereço: Rua A, 100, São Paulo
└─ CPF: 123.456.789-00

Dependente: Maria Silva (filha de João)
├─ Telefone: (11) 98765-4321  ← Herdado
├─ Endereço: Rua A, 100, São Paulo  ← Clonado (editável)
└─ CPF: 123.456.789-00  ← Herdado
```

### Acomodações

- **6 acomodações pré-configuradas** nos Diretores
- Carregadas dinamicamente via **padrão Builder**
- **Somente leitura** (sem criar/editar/deletar no sistema)
- **Tipos disponíveis:**
  1. Casal Simples
  2. Família Simples
  3. Família+
  4. Família Super
  5. Solteiro Simples
  6. Solteiro+

### Validações

Campos obrigatórios com validação em camadas:
- ✅ **Frontend:** desabilita botão, mostra asterisco (*) vermelho
- ✅ **Backend:** valida antes de salvar, retorna erro HTTP 400
- **Campos obrigatórios:** nome, nome social, data de nascimento

---

## 🐛 Troubleshooting

### Erro: "Conexão recusada (ECONNREFUSED)"

**Solução:** Verifique se o MySQL está rodando e as credenciais em `.env` estão corretas.

```bash
# Verificar se MySQL está rodando (Windows)
Get-Service MySQL*

# Iniciar MySQL (Windows)
Start-Service MySQL80
```

### Erro: "Table already exists"

**Solução:** Ignorado automaticamente. Sistema detecta e pula criação se tabelas já existem.

### Buscas não funcionando

**Solução:** Verifique se há dados no banco:
```bash
curl http://localhost:3001/titulares
```
Se retornar `[]`, crie um titular primeiro pela interface.

### Frontend não conecta ao backend

**Solução:** Verifique se ambos os servidores estão rodando nas portas corretas:
```bash
# Verificar porta 3001 (back-clientes)
curl http://localhost:3001/titulares

# Verificar porta 3002 (back-hospedagem)
curl http://localhost:3002/acomodacoes
```

### Erro: "Cannot find module"

**Solução:** Reinstale as dependências:
```bash
cd back-clientes
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Scripts Disponíveis

### Frontend
```bash
npm run dev      # Inicia modo desenvolvimento (Vite)
npm run build    # Cria build otimizado
npm run preview  # Preview da build
npm run lint     # Lint do código
```

### Backend
```bash
npm run start:server  # Inicia servidor com ts-node
npm run dev           # Inicia servidor com nodemon (auto-reload)
```

---

## 🎨 Padrões de Projeto Utilizados

- **Builder Pattern:** Construção de acomodações (diretores)
- **Repository Pattern:** Acesso ao banco de dados (DatabaseManager)
- **MVC Pattern:** Separação de responsabilidades (Model-View-Controller)
- **REST API:** Comunicação entre frontend e backend

---

## 📄 Licença

Projeto acadêmico - Sem licença específica

---

## 👥 Autores

Desenvolvido como projeto acadêmico para sistema de gestão de parque aquático.

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato com os desenvolvedores.
