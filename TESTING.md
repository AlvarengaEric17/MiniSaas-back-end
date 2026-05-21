# 🧪 Guia de Testes - MiniSaaS

## Testes Manuais

### 1. Teste de Criação de Empresa

```bash
# Request
curl -X POST http://localhost:3000/company \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Store",
    "email": "test@store.com",
    "password": "password123",
    "slug": "test-store"
  }'

# Expected Response: 201
{
  "id": "...",
  "name": "Test Store",
  "email": "test@store.com",
  "slug": "test-store",
  "premium": false,
  "maxProducts": 10
}

# Test: Criar conta duplicada (deve falhar)
# Expected Response: 400
{
  "error": "Company already exists"
}
```

### 2. Teste de Login

```bash
# Request
curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@store.com",
    "password": "password123"
  }'

# Expected Response: 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "company": {
    "id": "...",
    "name": "Test Store",
    "email": "test@store.com",
    "slug": "test-store"
  }
}

# Test: Senha errada (deve falhar)
# Expected Response: 401
{
  "error": "Invalid credentials"
}
```

### 3. Teste de Autenticação

```bash
# Salvar token da resposta anterior em uma variável
TOKEN="seu_token_aqui"

# Request
curl -X GET http://localhost:3000/me \
  -H "Authorization: Bearer $TOKEN"

# Expected Response: 200
{
  "id": "...",
  "name": "Test Store",
  "email": "test@store.com"
}

# Test: Sem token (deve falhar)
# Expected Response: 401
{
  "error": "Missing authorization header"
}

# Test: Token inválido (deve falhar)
# Expected Response: 401
{
  "error": "Invalid or expired token"
}
```

### 4. Teste de Criar Produto

```bash
TOKEN="seu_token_aqui"

# Request
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Pizza Margherita" \
  -F "description=Pizza clássica com mozzarella" \
  -F "price=45.90" \
  -F "active=true" \
  -F "image=@pizza.jpg"

# Expected Response: 201
{
  "id": "prod_123",
  "name": "Pizza Margherita",
  "description": "Pizza clássica com mozzarella",
  "price": 45.90,
  "image": "https://res.cloudinary.com/...",
  "active": true,
  "companyId": "..."
}

# Test: Sem imagem (deve funcionar)
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Refrigerante",
    "description": "Refrigerante 2L",
    "price": 8.90,
    "active": true
  }'

# Test: Sem campos obrigatórios (deve falhar)
# Expected Response: 400
{
  "error": "Validation error",
  "details": [...]
}
```

### 5. Teste de Listar Produtos

```bash
TOKEN="seu_token_aqui"

# Request
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"

# Expected Response: 200 (array de produtos)
[
  {
    "id": "prod_123",
    "name": "Pizza Margherita",
    ...
  },
  {
    "id": "prod_456",
    "name": "Refrigerante",
    ...
  }
]

# Test: Filtrar por status
curl -X GET "http://localhost:3000/products?active=true" \
  -H "Authorization: Bearer $TOKEN"

# Test: Apenas produtos ativos (deve retornar apenas active=true)
curl -X GET "http://localhost:3000/products?active=false" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Teste de Atualizar Produto

```bash
TOKEN="seu_token_aqui"
PRODUCT_ID="prod_123"

# Request
curl -X PUT http://localhost:3000/product/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita Premium",
    "price": 55.90,
    "active": true
  }'

# Expected Response: 200
{
  "id": "prod_123",
  "name": "Pizza Margherita Premium",
  "price": 55.90,
  ...
}

# Test: Atualizar produto que não existe
# Expected Response: 404
{
  "error": "Product not found"
}
```

### 7. Teste de Deletar Produto

```bash
TOKEN="seu_token_aqui"
PRODUCT_ID="prod_123"

# Request
curl -X DELETE http://localhost:3000/product/$PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response: 200
{
  "message": "Product deleted successfully"
}

# Test: Listar produtos novamente (deve ter 1 a menos)
# Test: Deletar novamente (deve falhar 404)
```

### 8. Teste de Catálogo Público

```bash
# SEM token (rota pública)
curl -X GET http://localhost:3000/catalog/test-store

# Expected Response: 200
{
  "company": {
    "id": "...",
    "name": "Test Store",
    "slug": "test-store",
    "premium": false
  },
  "products": [
    {
      "id": "prod_456",
      "name": "Refrigerante",
      "price": 8.90,
      "active": true
    }
  ]
}

# Observação: Retorna apenas produtos com active=true

# Test: Slug inválido (deve falhar)
curl -X GET http://localhost:3000/catalog/slug-inexistente

# Expected Response: 404
{
  "error": "Company not found"
}
```

### 9. Teste de Limite de Produtos

```bash
TOKEN="seu_token_aqui"

# Criar 10 produtos (limite gratuito)
for i in {1..10}; do
  curl -X POST http://localhost:3000/product \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Produto $i\",
      \"description\": \"Descrição $i\",
      \"price\": $i,
      \"active\": true
    }"
done

# Tentar criar o 11º produto
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto 11",
    "description": "Deve falhar",
    "price": 11,
    "active": true
  }'

# Expected Response: 400
{
  "error": "Product limit reached. Upgrade to premium for more products"
}
```

### 10. Teste de Isolamento Multi-Tenant

```bash
# Criar duas empresas
curl -X POST http://localhost:3000/company \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company A",
    "email": "a@company.com",
    "password": "pass123",
    "slug": "company-a"
  }'

curl -X POST http://localhost:3000/company \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Company B",
    "email": "b@company.com",
    "password": "pass123",
    "slug": "company-b"
  }'

# Fazer login em Company A
COMPANY_A_TOKEN=$(curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{"email": "a@company.com", "password": "pass123"}' | jq -r '.token')

# Fazer login em Company B
COMPANY_B_TOKEN=$(curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{"email": "b@company.com", "password": "pass123"}' | jq -r '.token')

# Criar produtos em Company A
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer $COMPANY_A_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto A",
    "description": "De A",
    "price": 100,
    "active": true
  }'

# Criar produtos em Company B
curl -X POST http://localhost:3000/product \
  -H "Authorization: Bearer $COMPANY_B_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto B",
    "description": "De B",
    "price": 200,
    "active": true
  }'

# Company A listar produtos (deve ver apenas Produto A)
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $COMPANY_A_TOKEN"

# Expected: Apenas 1 produto (Produto A)

# Company B listar produtos (deve ver apenas Produto B)
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $COMPANY_B_TOKEN"

# Expected: Apenas 1 produto (Produto B)

# ✅ ISOLAMENTO CONFIRMADO!
```

## Testes no Frontend

### 1. Homepage
- [ ] Página carrega corretamente
- [ ] Botões "Criar Conta" e "Entrar" funcionam
- [ ] Links para páginas corretas
- [ ] Design responsivo em mobile

### 2. Signup
- [ ] Formulário valida campos obrigatórios
- [ ] Valida slug (apenas letras, números, hífens)
- [ ] Valida email válido
- [ ] Valida senhas iguais
- [ ] Cria conta e redireciona para dashboard
- [ ] Erro ao criar conta duplicada
- [ ] Link para login funciona

### 3. Login
- [ ] Formulário funciona
- [ ] Login com credenciais corretas
- [ ] Erro com credenciais incorretas
- [ ] Link para signup funciona

### 4. Dashboard
- [ ] Mostra dados da empresa
- [ ] Exibe URL do catálogo
- [ ] Lista produtos
- [ ] Botão "Novo Produto" funciona
- [ ] Formulário de criar produto
- [ ] Upload de imagem funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Logout redireciona para home

### 5. Catálogo Público
- [ ] Acessa via URL /catalog/slug
- [ ] Mostra dados da empresa
- [ ] Mostra apenas produtos ativos
- [ ] Imagens carregam corretamente
- [ ] Responsivo em mobile
- [ ] URL inválida mostra erro

## Teste de Performance

```bash
# Teste de carga com Apache Bench
ab -n 1000 -c 100 http://localhost:3000/

# Teste de produtos com cURL
for i in {1..100}; do
  curl -X GET http://localhost:3000/products \
    -H "Authorization: Bearer $TOKEN" &
done
wait
```

## Checklist de Testes

- [ ] Endpoints retornam status correto
- [ ] Validação de dados funciona
- [ ] Autenticação protege rotas
- [ ] Isolamento multi-tenant funciona
- [ ] Imagens são uploadadas
- [ ] Frontend comunica com API
- [ ] Design responsivo
- [ ] Performance aceitável
- [ ] Erros são tratados
- [ ] Documentação está correta

---

**Todos os testes devem passar antes de deploy!**
