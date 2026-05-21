# 🚀 MiniSaaS - Plataforma de Catálogos Web Multi-Tenant

Um sistema SaaS completo e escalável para criar catálogos web, onde múltiplas empresas utilizam o mesmo sistema com isolamento total de dados.

## 📋 Visão Geral

MiniSaaS é uma plataforma profissional que permite que múltiplas empresas gerenciem seus catálogos de produtos em um único sistema. Cada empresa possui:

- ✅ Isolamento completo de dados
- ✅ Catálogo público com URL personalizada
- ✅ Autenticação JWT segura
- ✅ Upload de imagens com Cloudinary
- ✅ Sistema de planos (Gratuito e Premium)
- ✅ Dashboard intuitivo

## 🏗️ Arquitetura

### Backend
```
Backend (Node.js + Express + TypeScript)
├── Controllers (Camada de apresentação)
├── Services (Lógica de negócio)
├── Middlewares (Autenticação, validação)
├── Schemas (Validação com Zod)
├── Prisma (ORM + PostgreSQL)
└── Routes (Rotas da API)
```

### Frontend
```
Frontend (Next.js + TypeScript + Sass)
├── App Router
├── Components (Reutilizáveis)
├── Services (Comunicação com API)
├── Styles (Módulos SCSS)
└── Pages
    ├── Homepage
    ├── Auth (Login/Signup)
    ├── Dashboard
    └── Catálogo Público
```

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **TypeScript**
- **Express.js 5.2.1** - Framework web
- **Prisma 7.8.0** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **bcryptjs** - Hash de senhas
- **Multer** - Upload de arquivos
- **Cloudinary** - Armazenamento de imagens
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Sass** - Estilização avançada
- **Axios** - Cliente HTTP
- **React 19** - UI

## 📂 Estrutura de Pastas

```
MiniSaas-back-end/
├── src/
│   ├── @types/
│   │   └── express.d.ts
│   ├── config/
│   │   ├── multer.ts
│   │   └── cloudinary.ts
│   ├── controllers/
│   │   ├── company/
│   │   ├── product/
│   │   └── catalog/
│   ├── middlewares/
│   │   ├── isAuthenticated.ts
│   │   ├── validateSchema.ts
│   │   └── errorHandler.ts
│   ├── services/
│   │   ├── company/
│   │   ├── product/
│   │   └── catalog/
│   ├── schemas/
│   │   ├── companySchema.ts
│   │   └── productSchema.ts
│   ├── prisma/
│   │   └── index.ts
│   ├── routes.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.scss
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── dashboard/
│   │   │   └── catalog/[slug]/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductCard.tsx
│   │   └── services/
│   │       ├── api.ts
│   │       ├── authService.ts
│   │       ├── productService.ts
│   │       └── catalogService.ts
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔌 Endpoints da API

### Autenticação

#### Criar Empresa
```http
POST /company
Content-Type: application/json

{
  "name": "Minha Loja",
  "email": "admin@minha-loja.com",
  "password": "senha123456",
  "slug": "minha-loja"
}

Response: 201
{
  "id": "cuid",
  "name": "Minha Loja",
  "email": "admin@minha-loja.com",
  "slug": "minha-loja",
  "premium": false,
  "maxProducts": 10,
  "createdAt": "2024-05-21T..."
}
```

#### Login
```http
POST /session
Content-Type: application/json

{
  "email": "admin@minha-loja.com",
  "password": "senha123456"
}

Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "company": {
    "id": "cuid",
    "name": "Minha Loja",
    "email": "admin@minha-loja.com",
    "slug": "minha-loja",
    "premium": false,
    "maxProducts": 10
  }
}
```

#### Obter Dados da Empresa
```http
GET /me
Authorization: Bearer {token}

Response: 200
{
  "id": "cuid",
  "name": "Minha Loja",
  "email": "admin@minha-loja.com",
  "slug": "minha-loja",
  "premium": false,
  "maxProducts": 10,
  "createdAt": "2024-05-21T...",
  "updatedAt": "2024-05-21T..."
}
```

### Produtos

#### Criar Produto
```http
POST /product
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Pizza Margherita",
  "description": "Pizza clássica com mozzarella e tomate",
  "price": "45.90",
  "active": true,
  "image": <file>
}

Response: 201
{
  "id": "cuid",
  "name": "Pizza Margherita",
  "description": "Pizza clássica com mozzarella e tomate",
  "price": 45.90,
  "image": "https://res.cloudinary.com/...",
  "active": true,
  "companyId": "cuid",
  "createdAt": "2024-05-21T...",
  "updatedAt": "2024-05-21T..."
}
```

#### Listar Produtos
```http
GET /products?active=true
Authorization: Bearer {token}

Response: 200
[
  {
    "id": "cuid",
    "name": "Pizza Margherita",
    "description": "...",
    "price": 45.90,
    "image": "...",
    "active": true,
    "createdAt": "2024-05-21T...",
    "updatedAt": "2024-05-21T..."
  }
]
```

#### Atualizar Produto
```http
PUT /product/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Pizza Margherita Premium",
  "description": "...",
  "price": "55.90",
  "active": true,
  "image": <file> (opcional)
}

Response: 200
{ ... }
```

#### Deletar Produto
```http
DELETE /product/:id
Authorization: Bearer {token}

Response: 200
{
  "message": "Product deleted successfully"
}
```

### Catálogo Público

#### Obter Catálogo
```http
GET /catalog/minha-loja

Response: 200
{
  "company": {
    "id": "cuid",
    "name": "Minha Loja",
    "slug": "minha-loja",
    "logo": "...",
    "premium": false
  },
  "products": [
    {
      "id": "cuid",
      "name": "Pizza Margherita",
      "description": "...",
      "price": 45.90,
      "image": "...",
      "createdAt": "2024-05-21T..."
    }
  ]
}
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Conta Cloudinary (para upload de imagens)

### Backend

1. **Clone o repositório**
```bash
git clone <repo-url>
cd MiniSaas-back-end
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

4. **Configure as variáveis de ambiente**
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/minisaas
JWT_SECRET=sua_chave_secreta_super_longa
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

5. **Execute as migrações do Prisma**
```bash
npm run prisma:migrate
```

6. **Inicie o servidor**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend

1. **Navegue para a pasta frontend**
```bash
cd frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🔐 Sistema Multi-Tenant

O sistema implementa isolamento de dados por empresa usando:

1. **JWT com Company ID**: O token JWT contém o `company_id` no campo `sub`
2. **Middleware de Autenticação**: Extrai o `company_id` e o adiciona ao objeto `req.company_id`
3. **Queries Filtradas**: Todas as operações no banco filtram por `companyId`

Exemplo:
```typescript
// Qualquer GET/POST filtra automaticamente por companyId
where: {
  companyId: req.company_id
}
```

## 📊 Modelo de Dados

### Company
- `id`: UUID
- `name`: String
- `email`: String único
- `password`: Hash bcrypt
- `slug`: String único (URL do catálogo)
- `logo`: String (URL Cloudinary)
- `premium`: Boolean
- `maxProducts`: Int (10 para gratuito, ilimitado para premium)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Product
- `id`: UUID
- `name`: String
- `description`: String
- `price`: Float
- `image`: String (URL Cloudinary)
- `active`: Boolean
- `companyId`: Foreign Key (Company)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🔒 Segurança

- ✅ Senhas com hash bcryptjs
- ✅ Autenticação JWT com expiração
- ✅ Validação de dados com Zod
- ✅ CORS configurado
- ✅ Isolamento de dados multi-tenant
- ✅ Tratamento de erros global
- ✅ Middlewares de autenticação e autorização

## 🎨 Design Responsivo

Todas as páginas foram desenvolvidas com design responsivo:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 📈 Funcionalidades Futuras

- [ ] Sistema de pedidos online
- [ ] Análise e relatórios
- [ ] Domínio próprio por empresa
- [ ] Checkout integrado
- [ ] Sistema de avaliações
- [ ] Chat com clientes
- [ ] Integração com WhatsApp

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ para pequenas empresas

---

**🌐 Documentação Adicional**: Consulte `Contexto.md` para detalhes arquiteturais do projeto anterior.