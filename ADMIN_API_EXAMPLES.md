# Admin API - Exemplos de Requisições

## Base URL
```
http://localhost:3333
```

## Headers Necessários
```
x-admin-email: admin@seudominio.com
Content-Type: application/json
```

---

## 1. Listar Todas as Empresas

### Requisição
```bash
curl -X GET "http://localhost:3333/admin/companies" \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json"
```

### Resposta (Exemplo)
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid123abc",
      "name": "Empresa A",
      "email": "admin@empresaa.com",
      "slug": "empresa-a",
      "premium": true,
      "maxProducts": 100,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "_count": {
        "products": 25
      }
    },
    {
      "id": "cuid456def",
      "name": "Empresa B",
      "email": "admin@empresab.com",
      "slug": "empresa-b",
      "premium": false,
      "maxProducts": 10,
      "createdAt": "2024-02-20T14:45:00.000Z",
      "_count": {
        "products": 5
      }
    }
  ]
}
```

---

## 2. Obter Estatísticas do Sistema

### Requisição
```bash
curl -X GET "http://localhost:3333/admin/stats" \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json"
```

### Resposta (Exemplo)
```json
{
  "success": true,
  "data": {
    "totalCompanies": 42,
    "premiumCompanies": 15,
    "freeCompanies": 27,
    "totalProducts": 350,
    "premiumPercentage": "35.71%"
  }
}
```

---

## 3. Atualizar Status Premium de uma Empresa

### Requisição - Ativar Premium
```bash
curl -X PUT "http://localhost:3333/admin/company/cuid456def/premium" \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json" \
  -d '{
    "premium": true,
    "maxProducts": 50
  }'
```

### Requisição - Desativar Premium
```bash
curl -X PUT "http://localhost:3333/admin/company/cuid456def/premium" \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json" \
  -d '{
    "premium": false,
    "maxProducts": 10
  }'
```

### Resposta (Exemplo)
```json
{
  "success": true,
  "message": "Company enabled as premium",
  "data": {
    "id": "cuid456def",
    "name": "Empresa B",
    "email": "admin@empresab.com",
    "slug": "empresa-b",
    "premium": true,
    "maxProducts": 50,
    "createdAt": "2024-02-20T14:45:00.000Z",
    "_count": {
      "products": 5
    }
  }
}
```

---

## Códigos de Status HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Requisição bem sucedida |
| 400 | Bad Request - Erro nos parâmetros |
| 403 | Forbidden - Acesso negado (email admin inválido) |
| 404 | Not Found - Empresa não encontrada |
| 500 | Internal Server Error - Erro do servidor |

---

## Tratamento de Erros

### Exemplo - Email de Admin Inválido
```bash
curl -X GET "http://localhost:3333/admin/companies" \
  -H "x-admin-email: usuario-invalido@email.com"
```

**Resposta:**
```json
{
  "error": "Access denied. Admin only."
}
```

### Exemplo - Empresa Não Encontrada
```bash
curl -X PUT "http://localhost:3333/admin/company/id-invalido/premium" \
  -H "x-admin-email: admin@seudominio.com" \
  -H "Content-Type: application/json" \
  -d '{"premium": true}'
```

**Resposta:**
```json
{
  "error": "Company not found"
}
```

---

## Integração com Frontend

A página admin em `http://localhost:3000/admin` já integra automaticamente esses endpoints.

**Fluxo da Aplicação:**
1. Usuário faz login com email de admin
2. Page.tsx chama `adminService.getCompanies()`
3. Serviço envia requisição com header `x-admin-email`
4. Backend valida e retorna lista de empresas
5. Frontend renderiza tabela com dados
6. Usuário clica em "Add/Remove Premium"
7. Page.tsx chama `adminService.updateCompanyPremium()`
8. Tabela e estatísticas são atualizadas

---

## Postman Collection

Se está usando Postman, pode importar essa collection:

```json
{
  "info": {
    "name": "Admin API",
    "description": "Collection de endpoints da página admin"
  },
  "item": [
    {
      "name": "List Companies",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-admin-email",
            "value": "admin@seudominio.com"
          }
        ],
        "url": {
          "raw": "http://localhost:3333/admin/companies",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3333",
          "path": ["admin", "companies"]
        }
      }
    },
    {
      "name": "Get Stats",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "x-admin-email",
            "value": "admin@seudominio.com"
          }
        ],
        "url": {
          "raw": "http://localhost:3333/admin/stats",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3333",
          "path": ["admin", "stats"]
        }
      }
    },
    {
      "name": "Update Company Premium",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "x-admin-email",
            "value": "admin@seudominio.com"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"premium\": true, \"maxProducts\": 100}"
        },
        "url": {
          "raw": "http://localhost:3333/admin/company/:id/premium",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3333",
          "path": ["admin", "company", ":id", "premium"]
        }
      }
    }
  ]
}
```

---

## Dicas e Boas Práticas

1. **Sempre incluir o header `x-admin-email`** - Sem ele, a requisição será rejeitada
2. **Verificar o email configurado em `.env`** - Deve ser exatamente igual ao header
3. **Usar Content-Type corretamente** - application/json para PUT/POST
4. **Tratar erros no frontend** - Sempre mostrar mensagens de erro ao usuário
5. **Não expor emails de admin no código** - Usar variáveis de ambiente
