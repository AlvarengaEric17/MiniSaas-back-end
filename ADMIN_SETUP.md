# Admin Dashboard - Setup Guide

## Overview
A página de admin foi criada para gerenciar o status premium das empresas no SaaS. O admin pode:
- Ver lista de todas as empresas
- Ver estatísticas gerais
- Ativar/desativar status premium
- Visualizar quantidade de produtos por empresa

## Setup

### 1. Configure a variável de ambiente

Adicione o seguinte ao seu arquivo `.env`:

```env
ADMIN_EMAIL=admin@seudominio.com
NEXT_PUBLIC_API_URL=http://localhost:3333
```

**Importante**: O email de admin que você colocar aqui será usado para autenticar o acesso à página de admin.

### 2. Endpoints Backend

Os seguintes endpoints foram criados em `/src/routes.ts`:

#### GET `/admin/companies`
- **Descrição**: Lista todas as empresas com seus detalhes
- **Headers**: `x-admin-email: seu-email@admin.com`
- **Resposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid123",
      "name": "Empresa X",
      "email": "empresa@example.com",
      "slug": "empresa-x",
      "premium": false,
      "maxProducts": 10,
      "createdAt": "2024-01-01T00:00:00Z",
      "_count": {
        "products": 5
      }
    }
  ]
}
```

#### GET `/admin/stats`
- **Descrição**: Retorna estatísticas do sistema
- **Headers**: `x-admin-email: seu-email@admin.com`
- **Resposta**:
```json
{
  "success": true,
  "data": {
    "totalCompanies": 25,
    "premiumCompanies": 10,
    "freeCompanies": 15,
    "totalProducts": 150,
    "premiumPercentage": "40.00%"
  }
}
```

#### PUT `/admin/company/:id/premium`
- **Descrição**: Atualiza o status premium de uma empresa
- **Headers**: `x-admin-email: seu-email@admin.com`, `Content-Type: application/json`
- **Body**:
```json
{
  "premium": true,
  "maxProducts": 50
}
```
- **Resposta**: Retorna os dados atualizados da empresa

### 3. Arquivos Criados

#### Backend
- `src/controllers/admin/ListCompaniesController.ts` - Lista empresas
- `src/controllers/admin/UpdateCompanyPremiumController.ts` - Atualiza status premium
- `src/controllers/admin/AdminStatsController.ts` - Retorna estatísticas
- `src/middlewares/adminAuth.ts` - Middleware de autenticação

#### Frontend
- `frontend/src/app/admin/page.tsx` - Página principal do admin
- `frontend/src/app/admin/page.module.scss` - Estilos
- `frontend/src/services/adminService.ts` - Serviço API

### 4. Como Acessar

1. Inicie o backend: `npm run dev` (na raiz do projeto)
2. Inicie o frontend: `npm run dev` (na pasta `frontend`)
3. Acesse: `http://localhost:3000/admin`
4. Faça login com o email de admin configurado em `.env`

### 5. Recursos da Página Admin

**Dashboard**:
- 4 cards com estatísticas (Total de empresas, Premium, Livres, Total de produtos)

**Tabela de Empresas**:
- Nome da empresa
- Email
- Slug
- Quantidade de produtos
- Limite máximo de produtos
- Status premium
- Data de criação
- Botão para toggle do status premium

**Autenticação**:
- Login com email de admin
- Token armazenado no localStorage
- Logout disponível no header

### 6. Segurança

- O acesso é validado através do header `x-admin-email`
- Apenas o email configurado em `ADMIN_EMAIL` pode acessar
- No frontend, o email é armazenado no localStorage
- Adicione JWT authentication posterior se necessário

### 7. Próximos Passos Recomendados

1. **Adicionar múltiplos admins**: Criar tabela de admins no banco
2. **Melhorar autenticação**: Implementar JWT ou OAuth
3. **Adicionar logs**: Registrar quem fez mudanças e quando
4. **Adicionar filtros**: Filtrar por premium, data de criação, etc
5. **Adicionar busca**: Buscar por nome ou email
6. **Adicionar paginação**: Para suportar muitas empresas
7. **Adicionar exportação**: Exportar dados em CSV/Excel

## Exemplo de Uso

### No terminal (para testar):

```bash
# Listar empresas
curl -H "x-admin-email: admin@seudominio.com" \
  http://localhost:3333/admin/companies

# Ver estatísticas
curl -H "x-admin-email: admin@seudominio.com" \
  http://localhost:3333/admin/stats

# Ativar premium para uma empresa
curl -X PUT \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json" \
  -d '{"premium": true, "maxProducts": 100}' \
  http://localhost:3333/admin/company/cuid123/premium
```
