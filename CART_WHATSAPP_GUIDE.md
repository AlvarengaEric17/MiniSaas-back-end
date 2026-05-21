# Sistema de Carrinho com Checkout via WhatsApp

## 📋 Resumo

Sistema completo de carrinho de compras integrado ao catálogo web, com checkout direto via WhatsApp da empresa.

---

## 🔄 Fluxo

1. **Cliente acessa catálogo** (`/catalog/:slug`)
2. **Adiciona produtos ao carrinho** (salvo em localStorage)
3. **Abre painel do carrinho** (desliza pela direita)
4. **Edita quantidades** (aumenta/diminui/remove)
5. **Clica "Finalizar via WhatsApp"**
6. **Sistema envia lista formatada** para o número da empresa
7. **Abre WhatsApp** automaticamente com a mensagem pronta

---

## 🛠️ Alterações Backend

### 1. Schema Prisma

Adicionado campo `phone` ao modelo `Company`:

```prisma
model Company {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  password     String
  slug         String    @unique
  logo         String?
  phone        String?   @db.VarChar(20)  // ← NOVO
  premium      Boolean   @default(false)
  maxProducts  Int       @default(10)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  products     Product[]
}
```

### 2. Controller: UpdateCompanyPhoneController

**Rota**: `PUT /company/phone` (autenticado)

**Request**:
```json
{
  "phone": "+5511999999999"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Phone number updated successfully",
  "data": {
    "id": "cuid123",
    "name": "Minha Loja",
    "phone": "+5511999999999"
  }
}
```

Valida e limpa o número (remove caracteres especiais exceto `+`).

### 3. Controller: CheckoutController

**Rota**: `POST /checkout` (público)

**Request**:
```json
{
  "slug": "minha-loja",
  "items": [
    {
      "id": "product1",
      "name": "Camiseta",
      "price": 49.90,
      "quantity": 2
    }
  ],
  "customerName": "João Silva",
  "customerPhone": "11999999999"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "companyName": "Minha Loja",
    "total": 99.80,
    "itemsCount": 1,
    "whatsappUrl": "https://wa.me/55...",
    "whatsappPhone": "+5511999999999"
  }
}
```

Cria mensagem formatada:
```
👋 *Novo Pedido - Minha Loja*

*Cliente:* João Silva
*Telefone:* 11999999999

📦 *Lista de Compras*

1. Camiseta
   💰 R$ 49.90 x 2 = R$ 99.80

━━━━━━━━━━━━━━━━━━━
TOTAL: R$ 99.80
━━━━━━━━━━━━━━━━━━━
```

---

## 🎨 Alterações Frontend

### 1. CartContext

**Arquivo**: `frontend/src/contexts/CartContext.tsx`

- **Gerencia estado global do carrinho**
- **Salva em localStorage** automaticamente
- **Métodos**:
  - `addItem()` - Adiciona produto (soma quantidade se já existe)
  - `removeItem()` - Remove produto
  - `updateQuantity()` - Altera quantidade
  - `clearCart()` - Limpa carrinho
  - `getTotalPrice()` - Preço total
  - `getTotalItems()` - Quantidade total

**Uso**:
```tsx
const { items, addItem, getTotalPrice } = useCart();
```

### 2. Componente Cart

**Arquivo**: `frontend/src/components/Cart.tsx`

- **Painel deslizável** pela direita
- **Lista de itens** com imagem, nome, preço
- **Botões** +/- para quantidade
- **Remover item** individual
- **Campos** de nome e telefone do cliente
- **Botão** "Finalizar via WhatsApp" em destaque
- **Responsivo** para mobile

**Props**:
```tsx
<Cart 
  slug="minha-loja"      // slug da empresa
  isOpen={cartOpen}       // visibilidade
  onClose={closeCart}     // callback ao fechar
/>
```

### 3. CheckoutService

**Arquivo**: `frontend/src/services/checkoutService.ts`

- **Faz POST** para `/checkout`
- **Retorna WhatsApp URL**
- **Abre automaticamente** no WhatsApp

**Uso**:
```tsx
const response = await checkoutService.sendToWhatsApp(
  "minha-loja",
  cartItems,
  "João Silva",
  "11999999999"
);

window.open(response.data.whatsappUrl, "_blank");
```

---

## 🚀 Como Integrar na Página de Catálogo

### 1. Wrappear aplicação com CartProvider

Em `frontend/src/app/layout.tsx`:

```tsx
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
```

### 2. Adicionar carrinho na página de catálogo

Em `frontend/src/app/catalog/[slug]/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import Cart from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";

export default function CatalogPage() {
  const [cartOpen, setCartOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <div>
      {/* Botão flutuante do carrinho */}
      <button 
        onClick={() => setCartOpen(true)}
        className="cartButton"
      >
        🛒 Carrinho ({getTotalItems()})
      </button>

      {/* Painel do carrinho */}
      <Cart 
        slug={params.slug}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {/* Resto da página de catálogo */}
    </div>
  );
}
```

### 3. Adicionar produto ao carrinho

```tsx
import { useCart } from "@/contexts/CartContext";

function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>R$ {product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>
        Adicionar ao Carrinho
      </button>
    </div>
  );
}
```

---

## 📱 Como Configurar WhatsApp na Empresa

### 1. Empresa faz login em seu painel

2. **Edita perfil** e adiciona seu **número WhatsApp** (com +55)

3. **Salva** - número fica armazenado no banco

4. **Cliente** faz checkout → mensagem vai para esse número

---

## 📝 Endpoints Resumidos

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| PUT | `/company/phone` | Atualizar número WhatsApp | Necessária |
| POST | `/checkout` | Processar carrinho e gerar URL | Pública |
| GET | `/catalog/:slug` | Listar produtos (já existia) | Pública |

---

## 🔒 Segurança

- ✅ Número armazenado no banco
- ✅ Apenas empresa autenticada pode alterar
- ✅ Checkout não requer autenticação (público)
- ✅ Validação de quantidade mínima (telefone)
- ✅ Mensagens formatadas no backend

---

## 💾 Dados Persistidos

- **localStorage**: Carrinho (JSON)
- **PostgreSQL**: Número WhatsApp da empresa

---

## 🎯 Próximos Passos (Opcionais)

1. ✅ Coupon/desconto no checkout
2. ✅ Histórico de pedidos
3. ✅ Confirmação de recebimento (webhook WhatsApp)
4. ✅ Integração com Stripe/PagSeguro para pagamento online
5. ✅ QR Code para compartilhar catálogo
6. ✅ Analytics de vendas

---

## 📞 Exemplo Prático

**Cliente**:
1. Acessa `https://seu-site.com/catalog/minha-loja`
2. Clica "Adicionar ao Carrinho" em 2 produtos
3. Clica botão "🛒 Carrinho (2)"
4. Vê resumo: 2 itens, R$ 89,90
5. Digita "Maria Silva"
6. Clica "📱 Finalizar via WhatsApp"
7. **WhatsApp abre** com mensagem:

```
👋 *Novo Pedido - Loja X*

*Cliente:* Maria Silva

📦 *Lista de Compras*

1. Camiseta Branca
   💰 R$ 49.90 x 1 = R$ 49.90

2. Calça Azul
   💰 R$ 40.00 x 1 = R$ 40.00

━━━━━━━━━━━━━━━━━━━
TOTAL: R$ 89.90
━━━━━━━━━━━━━━━━━━━
```

8. Cliente envia a mensagem
9. Loja recebe no WhatsApp Business

---

## ✅ Checklist de Implementação

- [x] Schema Prisma com campo phone
- [x] Controller para atualizar telefone
- [x] Controller para checkout
- [x] Rotas backend
- [x] CartContext (gerenciamento de estado)
- [x] Componente Cart (UI)
- [x] Serviço de checkout
- [x] Estilos responsivos
- [ ] Integração na página de catálogo (você faz)
- [ ] Testar com número real
- [ ] Adicionar botão "Add to Cart" nos produtos (você faz)

---

**Tudo pronto para usar!** 🎉
