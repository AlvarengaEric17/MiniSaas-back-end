# Troubleshooting - Admin Dashboard

## ❌ Problemas Comuns e Soluções

### 1. "Access denied. Admin only." - Erro 403

**Problema**: Recebe erro 403 ao tentar acessar a página admin

**Causas**:
- Email de admin não configurado em `.env`
- Email digitado incorretamente
- Diferença entre maiúsculas/minúsculas

**Solução**:
1. Verifique `.env`:
   ```bash
   grep ADMIN_EMAIL .env
   ```
2. Confirme que está usando exatamente o mesmo email
3. Lembre-se que é case-sensitive (maiúsculas e minúsculas importam)

---

### 2. "NEXT_PUBLIC_API_URL não definido"

**Problema**: A página não consegue se conectar com a API

**Causas**:
- `NEXT_PUBLIC_API_URL` não está em `.env`
- URL está incorreta
- Backend não está rodando na porta especificada

**Solução**:
1. Adicione ao `.env` do frontend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3333
   ```
2. Verifique se o backend está rodando:
   ```bash
   curl http://localhost:3333/admin/companies
   ```
3. Reinicie o frontend após alterar `.env`

---

### 3. "Failed to fetch companies" na página de login

**Problema**: Aparecer mensagem de erro ao tentar fazer login

**Causas**:
- Backend não está iniciado
- Porta do backend está ocupada
- CORS bloqueando requisições

**Solução**:
```bash
# 1. Verifique se backend está rodando
ps aux | grep "npm run dev"

# 2. Se não estiver, inicie:
npm run dev

# 3. Teste a conexão:
curl -H "x-admin-email: admin@example.com" \
  http://localhost:3333/admin/companies
```

---

### 4. Tabela vazia após login

**Problema**: Consegue fazer login mas nenhuma empresa aparece

**Causas**:
- Banco de dados vazio
- Erro ao buscar dados

**Solução**:
1. Verifique se há empresas no banco:
   ```sql
   SELECT COUNT(*) FROM companies;
   ```
2. Veja logs do backend
3. Abra DevTools (F12) e veja o Network tab

---

### 5. "Premium" não está sendo atualizado

**Problema**: Clica no botão mas o status não muda

**Causas**:
- Erro na API
- Problema com permissão no banco
- Sessão expirada

**Solução**:
1. Verifique logs do backend
2. Tente fazer logout e login novamente
3. Teste via curl:
   ```bash
   curl -X PUT http://localhost:3333/admin/company/ID/premium \
     -H "x-admin-email: admin@example.com" \
     -H "Content-Type: application/json" \
     -d '{"premium": true}'
   ```

---

### 6. Estilos não carregando (página sem design)

**Problema**: Página renderiza mas sem estilos

**Causas**:
- Arquivo SCSS com problemas
- Cache do Next.js

**Solução**:
```bash
# 1. Limpe o cache
rm -rf .next

# 2. Reinicie o frontend
npm run dev
```

---

### 7. Erro: "Admin email not configured"

**Problema**: Erro 500 quando tenta acessar endpoints

**Causas**:
- `ADMIN_EMAIL` não está definido em `.env` do backend
- Backend não foi reiniciado após alterar `.env`

**Solução**:
1. Verifique `.env`:
   ```bash
   grep ADMIN_EMAIL .env
   ```
2. Se vazio, adicione:
   ```env
   ADMIN_EMAIL=admin@seudominio.com
   ```
3. Reinicie backend:
   ```bash
   npm run dev
   ```

---

### 8. TypeScript errors ao compilar

**Problema**: Erros de tipo durante build

**Solução**:
- Se relacionados a `admin/`, verifique imports
- Se pre-existentes (em `catalog/` ou `product/`), ignore

---

### 9. Comportamento estranho no localStorage

**Problema**: Continua logado após fechar navegador ou não consegue fazer logout

**Solução**:
1. Limpe o localStorage:
   ```javascript
   // No DevTools console
   localStorage.clear()
   ```
2. Recarregue a página
3. Faça login novamente

---

### 10. Company/Empresa não encontrada (erro 404)

**Problema**: Erro ao tentar atualizar status premium

**Causas**:
- ID da empresa incorreto
- Empresa foi deletada

**Solução**:
1. Recarregue a página
2. Verifique ID no banco:
   ```sql
   SELECT id, name FROM companies LIMIT 5;
   ```

---

## 🔍 Debugging

### Verificar saúde da API

```bash
# Listar empresas
curl -H "x-admin-email: admin@example.com" \
  http://localhost:3333/admin/companies

# Ver estatísticas
curl -H "x-admin-email: admin@example.com" \
  http://localhost:3333/admin/stats

# Atualizar premium (substitua ID)
curl -X PUT http://localhost:3333/admin/company/SEU_ID/premium \
  -H "x-admin-email: admin@example.com" \
  -H "Content-Type: application/json" \
  -d '{"premium": true}'
```

### Verificar logs

**Backend**:
```bash
npm run dev 2>&1 | grep -i error
```

**Frontend** (DevTools):
- Abra F12
- Vá em Console
- Procure por erros vermelhos

### Verificar banco de dados

```sql
-- Conexão com PostgreSQL
psql $DATABASE_URL

-- Ver empresas
SELECT id, name, email, premium, maxProducts FROM companies LIMIT 10;

-- Ver contagem
SELECT COUNT(*) as total, COUNT(CASE WHEN premium=true THEN 1 END) as premium FROM companies;
```

---

## ✅ Verificação Completa

Siga esta lista para garantir que tudo está funcionando:

- [ ] `.env` tem `ADMIN_EMAIL` definido
- [ ] Backend rodando em `http://localhost:3333`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Consegue acessar `http://localhost:3000/admin`
- [ ] Consegue fazer login com email correto
- [ ] Lista de empresas carrega
- [ ] Estatísticas aparecem
- [ ] Consegue clicar em "Add/Remove Premium"
- [ ] Status muda após clicar
- [ ] Logout funciona
- [ ] DevTools console sem erros vermelhos

---

## 📞 Suporte Adicional

Se o problema persistir:

1. Verifique o arquivo `ADMIN_SETUP.md`
2. Revise `ADMIN_API_EXAMPLES.md` para exemplos de requisições
3. Verifique `ADMIN_IMPLEMENTATION.md` para detalhes técnicos
4. Revise logs do backend e frontend
5. Considere criar uma issue no repositório

---

## Arquivo de Log Útil

Para salvar saída de erro:

```bash
# Backend
npm run dev 2>&1 | tee backend.log

# Frontend (outro terminal)
cd frontend && npm run dev 2>&1 | tee frontend.log
```

Isso criará arquivos `backend.log` e `frontend.log` com toda saída para análise.
