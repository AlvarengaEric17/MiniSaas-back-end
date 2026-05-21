# 📚 Documentação Detalhada - MiniSaaS API

## Autenticação

Todos os endpoints autenticados requerem um header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Fluxo de Autenticação

```
1. Usuário cria conta (POST /company)
   ↓
2. Ou faz login (POST /session)
   ↓
3. Recebe JWT token
   ↓
4. Usa token em requisições autenticadas
   ↓
5. Middleware extrai company_id do token
   ↓
6. Todas as operações são isoladas por company_id
```

## Endpoints Detalhados

### POST /company - Criar Empresa

**Descrição**: Cria uma nova conta de empresa

**Autenticação**: Não requerida

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Pizzaria do João",
  "email": "joao@pizzaria.com",
  "password": "senha_super_secreta",
  "slug": "pizzaria-joao"
}
```

**Validações**:
- `name`: Mínimo 3 caracteres
- `email`: Email válido e único no sistema
- `password`: Mínimo 6 caracteres
- `slug`: 3+ caracteres, apenas letras minúsculas, números e hífens, único

**Response 201**:
```json
{
  "id": "cuid12345",
  "name": "Pizzaria do João",
  "email": "joao@pizzaria.com",
  "slug": "pizzaria-joao",
  "logo": null,
  "premium": false,
  "maxProducts": 10,
  "createdAt": "2024-05-21T10:30:00Z"
}
```

**Error 400**:
```json
{
  "error": "Company already exists"
}
```

---

### POST /session - Login

**Descrição**: Autentica uma empresa e retorna JWT token

**Autenticação**: Não requerida

**Request Body**:
```json
{
  "email": "joao@pizzaria.com",
  "password": "senha_super_secreta"
}
```

**Response 200**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "company": {
    "id": "cuid12345",
    "name": "Pizzaria do João",
    "email": "joao@pizzaria.com",
    "slug": "pizzaria-joao",
    "logo": "https://res.cloudinary.com/...",
    "premium": false,
    "maxProducts": 10
  }
}
```

**Error 401**:
```json
{
  "error": "Invalid credentials"
}
```

---

### GET /me - Obter Dados da Empresa

**Descrição**: Retorna os dados da empresa autenticada

**Autenticação**: ✅ Requerida

**Response 200**:
```json
{
  "id": "cuid12345",
  "name": "Pizzaria do João",
  "email": "joao@pizzaria.com",
  "slug": "pizzaria-joao",
  "logo": "https://res.cloudinary.com/...",
  "premium": false,
  "maxProducts": 10,
  "createdAt": "2024-05-21T10:30:00Z",
  "updatedAt": "2024-05-21T10:30:00Z"
}
```

**Error 401**:
```json
{
  "error": "Invalid or expired token"
}
```

---

## Produtos

### POST /product - Criar Produto

**Descrição**: Cria um novo produto para a empresa autenticada

**Autenticação**: ✅ Requerida

**Headers**:
```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

**Request Body** (form-data):
- `name`: String (obrigatório)
- `description`: String (obrigatório)
- `price`: Number (obrigatório)
- `active`: Boolean (opcional, padrão: true)
- `image`: File (opcional, máx 5MB)

**Response 201**:
```json
{
  "id": "prod_12345",
  "name": "Pizza Margherita",
  "description": "Pizza clássica com mozzarella e tomate",
  "price": 45.90,
  "image": "https://res.cloudinary.com/minisaas/image/upload/v1234567890/minisaas/products/abc123.jpg",
  "active": true,
  "companyId": "cuid12345",
  "createdAt": "2024-05-21T10:30:00Z",
  "updatedAt": "2024-05-21T10:30:00Z"
}
```

**Error 400** (Limite de produtos atingido):
```json
{
  "error": "Product limit reached. Upgrade to premium for more products"
}
```

---

### GET /products - Listar Produtos

**Descrição**: Lista todos os produtos da empresa autenticada

**Autenticação**: ✅ Requerida

**Query Parameters**:
- `active`: String ("true" ou "false") - opcional

**Exemplos**:
```
GET /products
GET /products?active=true
GET /products?active=false
```

**Response 200**:
```json
[
  {
    "id": "prod_12345",
    "name": "Pizza Margherita",
    "description": "Pizza clássica com mozzarella e tomate",
    "price": 45.90,
    "image": "https://res.cloudinary.com/...",
    "active": true,
    "companyId": "cuid12345",
    "createdAt": "2024-05-21T10:30:00Z",
    "updatedAt": "2024-05-21T10:30:00Z"
  },
  {
    "id": "prod_67890",
    "name": "Pizza 4 Queijos",
    "description": "Pizza com 4 tipos de queijo",
    "price": 55.90,
    "image": "https://res.cloudinary.com/...",
    "active": true,
    "companyId": "cuid12345",
    "createdAt": "2024-05-21T11:00:00Z",
    "updatedAt": "2024-05-21T11:00:00Z"
  }
]
```

---

### PUT /product/:id - Atualizar Produto

**Descrição**: Atualiza um produto existente

**Autenticação**: ✅ Requerida

**URL Parameters**:
- `id`: String (ID do produto)

**Request Body** (form-data, todos opcionais):
- `name`: String
- `description`: String
- `price`: Number
- `active`: Boolean
- `image`: File

**Response 200**:
```json
{
  "id": "prod_12345",
  "name": "Pizza Margherita Premium",
  "description": "Pizza clássica premium com mozzarella de bufala",
  "price": 55.90,
  "image": "https://res.cloudinary.com/...",
  "active": true,
  "companyId": "cuid12345",
  "createdAt": "2024-05-21T10:30:00Z",
  "updatedAt": "2024-05-21T12:00:00Z"
}
```

**Error 404**:
```json
{
  "error": "Product not found"
}
```

---

### DELETE /product/:id - Deletar Produto

**Descrição**: Deleta um produto

**Autenticação**: ✅ Requerida

**URL Parameters**:
- `id`: String (ID do produto)

**Response 200**:
```json
{
  "message": "Product deleted successfully"
}
```

**Error 404**:
```json
{
  "error": "Product not found"
}
```

---

## Catálogo Público

### GET /catalog/:slug - Obter Catálogo Público

**Descrição**: Obtém o catálogo público de uma empresa

**Autenticação**: ❌ Não requerida

**URL Parameters**:
- `slug`: String (slug da empresa, ex: "pizzaria-joao")

**Response 200**:
```json
{
  "company": {
    "id": "cuid12345",
    "name": "Pizzaria do João",
    "email": "joao@pizzaria.com",
    "slug": "pizzaria-joao",
    "logo": "https://res.cloudinary.com/...",
    "premium": false
  },
  "products": [
    {
      "id": "prod_12345",
      "name": "Pizza Margherita",
      "description": "Pizza clássica com mozzarella e tomate",
      "price": 45.90,
      "image": "https://res.cloudinary.com/...",
      "createdAt": "2024-05-21T10:30:00Z"
    },
    {
      "id": "prod_67890",
      "name": "Pizza 4 Queijos",
      "description": "Pizza com 4 tipos de queijo",
      "price": 55.90,
      "image": "https://res.cloudinary.com/...",
      "createdAt": "2024-05-21T11:00:00Z"
    }
  ]
}
```

**Observações**:
- Retorna apenas produtos com `active: true`
- Não requer autenticação
- Disponível em URL pública: `https://seusite.com/catalog/pizzaria-joao`

**Error 404**:
```json
{
  "error": "Company not found"
}
```

---

## Códigos de Erro HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Erro na validação de dados |
| 401 | Unauthorized - Token inválido ou ausente |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Middleware de Validação

Todos os endpoints validam automaticamente os dados usando Zod. Se houver erro:

**Response 400**:
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 3,
      "type": "string",
      "path": ["body", "name"],
      "message": "String must contain at least 3 character(s)"
    }
  ]
}
```

---

## Limite de Produtos

- **Plano Gratuito**: 10 produtos
- **Plano Premium**: Ilimitado

O backend verifica automaticamente e retorna erro 400 se o limite for atingido em conta gratuita.

---

## Upload de Imagens

### Configuração Cloudinary

As imagens são armazenadas automaticamente no Cloudinary:
- Pasta: `/minisaas/products`
- Formatos aceitos: JPEG, PNG, WebP, GIF
- Tamanho máximo: 5MB
- URL segura: `https://res.cloudinary.com/`

### Como Funciona

1. Arquivo é recebido em memória via Multer
2. Enviado ao Cloudinary
3. URL segura retornada
4. URL armazenada no banco de dados
5. Frontend exibe imagem

---

## Exemplo de Fluxo Completo

### 1. Criar Empresa
```bash
curl -X POST http://localhost:3000/company \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizzaria do João",
    "email": "joao@pizzaria.com",
    "password": "senha123456",
    "slug": "pizzaria-joao"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@pizzaria.com",
    "password": "senha123456"
  }'
```

### 3. Criar Produto
```bash
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer {TOKEN}" \
  -F "name=Pizza Margherita" \
  -F "description=Pizza clássica com mozzarella e tomate" \
  -F "price=45.90" \
  -F "image=@pizza.jpg"
```

### 4. Acessar Catálogo Público
```
https://frontend.com/catalog/pizzaria-joao
```

---

## Rate Limiting

Não implementado na versão 1.0, mas recomenda-se adicionar em produção.

## CORS

Configurado para aceitar requisições de qualquer origem (pode ser restringido em produção).
