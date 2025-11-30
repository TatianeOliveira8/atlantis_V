# Atlantis - Gestão de Parque Aquático

Sistema para gerenciar clientes, dependentes, acomodações e hospedagens em um parque aquático. Desenvolvido com **Frontend** em React + Tailwind e **Backends** em TypeScript, comunicando-se via APIs REST.

---

## Arquitetura

```
Atlantis/
├── front/                          # Frontend SPA
├── back-clientes/                  # Backend de clientes e dependentes
└── back-hospedagem-acomodacoes/   # Backend de acomodações e hospedagens
```

Cada backend possui `.env` para configuração do MySQL e cria automaticamente as tabelas necessárias ao iniciar.

---

## Banco de Dados

* **Principais tabelas:**

  * `titulares`
  * `dependentes`
  * `hospedagens`
* **View:** `clientes` (titulares + dependentes)

---

## Endpoints Principais

**Clientes:**

* `GET /titulares`
* `GET /dependentes`
* `GET /clientes`
* `POST /clientes`
* `PUT /clientes`
* `DELETE /clientes?id={id}`

**Hospedagens/Acomodações:**

* `GET /acomodacoes`
* `GET /hospedagens`
* `POST /hospedagens`
* `PUT /hospedagens`
* `DELETE /hospedagens?id={id}`

---

## Como rodar

Instalar dependências:

```bash
npm install
```

Executar frontend:

```bash
cd front
npm run dev
```

Executar backend clientes:

```bash
cd back-clientes
npm run start:server
```

Executar backend hospedagens:

```bash
cd back-hospedagem-acomodacoes
npm run start:server
```

---

## Observações
* Banco configurável via `.env`.

Resumo das Tecnologias:
React 19.2.0
Vite 7.2.2
TypeScript 5.9.3
TailwindCSS 4.1.17
React Router DOM 7.9.6
React Icons 5.5.0

Node.js 22+
TypeScript 5.9.3
ts-node 10.9.2
MySQL2 3.15.3
dotenv 17.2.3
Banco de Dados
MySQL 8.0+
Mesmo banco (atlantis) para ambos os backends
Tabelas separadas por domínio
