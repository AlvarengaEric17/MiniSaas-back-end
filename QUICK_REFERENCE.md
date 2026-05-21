# 🎯 Quick Reference - MiniSaaS

## Comandos Essenciais

### Backend

```bash
# Instalação
npm install

# Desenvolvimento
npm run dev              # Inicia com hot-reload (tsx)

# Build
npm run build            # Compila TypeScript

# Produção
npm start                # Executa versão compilada

# Prisma
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate   # Executa migrações
npm run prisma:studio    # Abre interface Prisma Studio
```

### Frontend

```bash
cd frontend

# Instalação
npm install

# Desenvolvimento
npm run dev              # Inicia servidor dev (port 3000)

# Build
npm run build            # Compila Next.js

# Produção
npm start                # Executa versão compilada

# Lint
npm run lint             # Verifica código
```

## Variáveis de Ambiente

### Backend (.env)
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/minisaas_db
DIRECT_URL=postgresql://user:password@localhost:5432/minisaas_db
JWT_SECRET=sua_chave_secreta_super_longa_minimo_32_caracteres
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
```

### Frontend (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## URLs de Acesso Local

```
Homepage:           http://localhost:3000
Login:              http://localhost:3000/auth/login
Signup:             http://localhost:3000/auth/signup
Dashboard:          http://localhost:3000/dashboard
Catálogo Público:   http://localhost:3000/catalog/seu-slug
```

## Rotas da API

### Autenticação
```
POST   /company          - Criar empresa
POST   /session          - Login
GET    /me               - Dados da empresa
```

### Produtos
```
POST   /product          - Criar produto
GET    /products         - Listar produtos
PUT    /product/:id      - Atualizar produto
DELETE /product/:id      - Deletar produto
```

### Catálogo
```
GET    /catalog/:slug    - Catálogo público (SEM autenticação)
```

## Estrutura de Pastas

```
Backend:
  src/
    @types/             - Tipagem TypeScript
    config/             - Configurações (Multer, Cloudinary)
    controllers/        - Controllers (8 arquivos)
    middlewares/        - Middlewares (3 arquivos)
    services/           - Services (8 arquivos)
    schemas/            - Validação Zod (2 arquivos)
    prisma/             - Cliente Prisma
    routes.ts           - Todas as rotas
    server.ts           - Inicialização

Frontend:
  src/
    app/                - Páginas e layout
    components/         - Componentes reutilizáveis
    services/           - Serviços de API
```

## Fluxo de Dados

```
Frontend Request
    ↓
Axios + JWT Token
    ↓
Backend Route
    ↓
Middleware (validateSchema, isAuthenticated)
    ↓
Controller
    ↓
Service (lógica de negócio)
    ↓
Prisma Client
    ↓
PostgreSQL Database
    ↓
Response com dados filtrados por company_id
```

## Authentication Flow

```
1. User submits form
    ↓
2. Frontend → POST /company ou /session
    ↓
3. Backend validates e cria/autentica
    ↓
4. Backend retorna JWT token
    ↓
5. Frontend armazena em localStorage
    ↓
6. Axios interceptor adiciona em todas requisições
    ↓
7. Middleware isAuthenticated extrai company_id
    ↓
8. Todas operações filtram por company_id
```

## Principais Arquivos

### Backend Essenciais
- `src/routes.ts` - Define todas as 8 rotas
- `src/server.ts` - Inicializa Express
- `prisma/schema.prisma` - Modelos de dados
- `package.json` - Dependências

### Frontend Essenciais
- `src/app/page.tsx` - Homepage
- `src/app/dashboard/page.tsx` - Dashboard principal
- `src/services/api.ts` - Cliente Axios
- `frontend/package.json` - Dependências

## Checklist de Configuração

### Antes de Começar
- [ ] PostgreSQL instalado e rodando
- [ ] Node.js 18+ instalado
- [ ] Conta Cloudinary criada
- [ ] Git configurado

### Backend Setup
- [ ] Clonar repositório
- [ ] `npm install`
- [ ] Copiar `.env.example` para `.env`
- [ ] Preencher variáveis de ambiente
- [ ] `npm run prisma:migrate`
- [ ] `npm run dev`

### Frontend Setup
- [ ] `cd frontend`
- [ ] `npm install`
- [ ] Copiar `.env.example` para `.env.local`
- [ ] `npm run dev`

### Testes Iniciais
- [ ] Acessar homepage (http://localhost:3000)
- [ ] Criar conta (signup)
- [ ] Fazer login
- [ ] Acessar dashboard
- [ ] Criar produto
- [ ] Acessar catálogo público

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Port 3000 already in use" | Mude PORT no .env ou kill processo |
| "Cannot find module" | `npm install` + `npm run prisma:generate` |
| "Database connection refused" | Verifique PostgreSQL está rodando |
| "Invalid token" | Faça login novamente |
| "Product not found" | Verifique company_id é o mesmo |
| "CORS error" | Verifique NEXT_PUBLIC_API_URL |

## Detalhes Técnicos

### Autenticação
- **Token**: JWT com expiração 30 dias
- **Campo**: `sub` contém `company_id`
- **Header**: `Authorization: Bearer {token}`
- **Storage**: localStorage (frontend)

### Multi-Tenant
- **Isolamento**: Todos queries filtram por `companyId`
- **Middleware**: `isAuthenticated` extrai `company_id`
- **Validação**: Verifica se recurso pertence à empresa

### Upload de Imagens
- **Multer**: Recebe em memória
- **Cloudinary**: Armazena permanentemente
- **Pasta**: `/minisaas/products`
- **Formatos**: JPEG, PNG, WebP, GIF
- **Máximo**: 5MB

### Validação
- **Library**: Zod
- **Quando**: Todos endpoints
- **O que**: Body, query, params
- **Response**: 400 com detalhes erro

## Performance

### Otimizações
- Índices no banco (companyId)
- Code splitting (Next.js)
- Lazy loading (imagens)
- Compressão (GZIP)
- Cache (Cloudinary)

### Limites
- Produto: 10 (gratuito) / ilimitado (premium)
- Imagem: 5MB máximo
- Request: Sem rate limiting (adicionar em produção)

## Próximas Etapas

### Curto Prazo
- [ ] Testar todos endpoints
- [ ] Fazer o deploy em staging
- [ ] Testes de performance
- [ ] Testes de segurança

### Médio Prazo
- [ ] Implementar rate limiting
- [ ] Adicionar analytics
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Testes automáticos

### Longo Prazo
- [ ] Sistema de pedidos
- [ ] Checkout integrado
- [ ] Analytics avançadas
- [ ] Mobile app (React Native)

## Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Ferramentas
- [Postman](https://www.postman.com/) - Testar API
- [Prisma Studio](https://www.prisma.io/studio) - Gerenciar dados
- [Cloudinary Console](https://cloudinary.com/console) - Gerenciar imagens

## Contatos

### Para Criar Conta Cloudinary
1. Acessar https://cloudinary.com/
2. Registrar
3. Copiar CLOUD_NAME, API_KEY e API_SECRET
4. Adicionar no `.env`

### Para Iniciar PostgreSQL
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`
- Windows: Iniciar via Services

## Dicas de Desenvolvimento

### Backend
- Use `npm run dev` para desenvolvimento com hot-reload
- Verifique logs no terminal
- Use `npm run prisma:studio` para visualizar dados
- Teste com Postman ou cURL

### Frontend
- Use React DevTools
- Verifique console do navegador
- Use Network tab para debug de API
- Use Lighthouse para performance

### Geral
- Mantenha `.env` seguro (nunca commitar)
- Use variáveis de ambiente para tudo
- Teste localmente antes de fazer push
- Escreva commits descritivos

## Segurança

### Implementado
- ✅ JWT com expiração
- ✅ Hashing de senhas (bcryptjs)
- ✅ Validação de entrada (Zod)
- ✅ CORS configurado
- ✅ Isolamento multi-tenant

### A Fazer (Produção)
- [ ] Rate limiting
- [ ] HTTPS obrigatório
- [ ] CORS restrito a domínios
- [ ] Security headers (Helmet)
- [ ] SQL injection prevention (Prisma já faz)
- [ ] XSS prevention (React faz)
- [ ] CSRF protection

---

**Projeto completo e documentado! 🎉**

Dúvidas? Consulte:
- `README.md` - Visão geral
- `API_DOCS.md` - Endpoints
- `SETUP.md` - Setup detalhado
- `TESTING.md` - Como testar
