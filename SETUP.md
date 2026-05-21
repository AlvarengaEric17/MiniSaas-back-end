# 🚀 Setup e Deployment - MiniSaaS

## Configuração Local

### Pré-requisitos

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Conta Cloudinary** - [Criar conta](https://cloudinary.com/)

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/MiniSaas-back-end.git
cd MiniSaas-back-end
```

### 2. Configurar Backend

#### 2.1 Instalar Dependências
```bash
npm install
```

#### 2.2 Configurar PostgreSQL

Criar banco de dados:
```bash
createdb minisaas_db
```

Ou usando psql:
```bash
psql -U postgres
CREATE DATABASE minisaas_db;
\q
```

#### 2.3 Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/minisaas_db
DIRECT_URL=postgresql://usuario:senha@localhost:5432/minisaas_db

# JWT
JWT_SECRET=sua_chave_super_secreta_e_longa_aqui_123456

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

#### 2.4 Executar Migrações

```bash
npm run prisma:migrate
```

Isso criará as tabelas no banco de dados.

#### 2.5 Iniciar Backend

```bash
npm run dev
```

Backend rodando em `http://localhost:3000` ✅

### 3. Configurar Frontend

#### 3.1 Instalar Dependências

```bash
cd frontend
npm install
```

#### 3.2 Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Editar `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 3.3 Iniciar Frontend

```bash
npm run dev
```

Frontend rodando em `http://localhost:3000` ✅

## Teste Local

### 1. Acessar a Aplicação

- **Homepage**: `http://localhost:3000`
- **Criar Conta**: `http://localhost:3000/auth/signup`
- **Login**: `http://localhost:3000/auth/login`
- **Dashboard**: `http://localhost:3000/dashboard` (após autenticado)
- **Catálogo Público**: `http://localhost:3000/catalog/seu-slug`

### 2. Testar API com cURL

```bash
# Criar empresa
curl -X POST http://localhost:3000/company \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "email": "test@example.com",
    "password": "password123",
    "slug": "test-store"
  }'

# Login
curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Listar produtos (com token)
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Testar com Postman

1. Importar endpoints da documentação
2. Configurar ambiente local
3. Testar cada endpoint

## Build para Produção

### Backend

```bash
# Build
npm run build

# Start (production)
npm start
```

### Frontend

```bash
cd frontend

# Build
npm run build

# Start
npm start
```

## Deployment

### Opção 1: Heroku

#### Backend

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create seu-app-backend

# Set environment variables
heroku config:set JWT_SECRET=sua_chave_secreta
heroku config:set DATABASE_URL=postgresql://...
heroku config:set CLOUDINARY_CLOUD_NAME=seu_cloud_name
heroku config:set CLOUDINARY_API_KEY=sua_api_key
heroku config:set CLOUDINARY_API_SECRET=sua_api_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Frontend

```bash
cd frontend

# Create app
heroku create seu-app-frontend

# Set environment variable
heroku config:set NEXT_PUBLIC_API_URL=https://seu-app-backend.herokuapp.com

# Deploy
git push heroku main
```

### Opção 2: Vercel (Frontend) + Railway (Backend)

#### Frontend no Vercel

```bash
npm i -g vercel
vercel
```

Configure durante o deploy:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variable**: `NEXT_PUBLIC_API_URL=https://seu-backend.railway.app`

#### Backend no Railway

1. Conectar repositório GitHub
2. Adicionar variáveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_*`
3. Deploy automático

### Opção 3: Docker

#### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: minisaas_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/minisaas_db
      JWT_SECRET: your_secret_key
      CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Checklist de Segurança para Produção

- [ ] JWT_SECRET é uma string longa e aleatória
- [ ] DATABASE_URL não contém credenciais em texto plano
- [ ] CORS está restringido a domínios conhecidos
- [ ] Senhas são hasheadas com bcryptjs
- [ ] Validação de entrada com Zod
- [ ] Rate limiting implementado
- [ ] HTTPS ativado
- [ ] Headers de segurança configurados
- [ ] Logs são monitorizados
- [ ] Backups automáticos configurados

## Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npm install
npm run prisma:generate
```

### Erro: "Connection refused" (PostgreSQL)

Verifique se PostgreSQL está rodando:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Windows
# Verifique no Services
```

### Erro: "401 Unauthorized"

- Verifique se o token é válido
- Verifique se o token foi copiado corretamente
- Faça login novamente

### Erro: "Product limit reached"

Conta gratuita está no limite de 10 produtos. Faça upgrade para premium.

### Imagens não aparecem

- Verifique credenciais do Cloudinary
- Verifique se o arquivo é válido (JPEG, PNG, WebP, GIF)
- Verifique tamanho (máx 5MB)

## Monitoramento

### Variáveis de Ambiente Recomendadas

```env
# Logging
LOG_LEVEL=debug
ENABLE_METRICS=true

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Cache
CACHE_TTL=3600
```

## Performance

### Otimizações Implementadas

- ✅ Índices no banco de dados
- ✅ Compressão GZIP ativada
- ✅ Cache de imagens Cloudinary
- ✅ Code splitting no Next.js
- ✅ Lazy loading de imagens

## Próximas Etapas

1. Implementar rate limiting
2. Adicionar analytics
3. Configurar CI/CD com GitHub Actions
4. Implementar tests automáticos
5. Adicionar APM (Application Performance Monitoring)

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação API_DOCS.md
2. Verifique os logs
3. Abra uma issue no GitHub
