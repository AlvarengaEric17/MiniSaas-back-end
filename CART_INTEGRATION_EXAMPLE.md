# Exemplo Prático: Integração do Carrinho

## Passo 1: Atualizar `layout.tsx`

```tsx
// frontend/src/app/layout.tsx
"use client";

import { CartProvider } from "@/contexts/CartContext";
import "./globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
```

---

## Passo 2: Atualizar página de catálogo

```tsx
// frontend/src/app/catalog/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Cart from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";
import { catalogService, Catalog } from "@/services/catalogService";
import styles from "./page.module.scss";

export default function CatalogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  
  const { addItem, getTotalItems } = useCart();

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const data = await catalogService.getCatalog(slug);
        setCatalog(data);
      } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [slug]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    
    // Mostrar notificação (opcional)
    alert(`${product.name} adicionado ao carrinho!`);
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!catalog) {
    return <div className={styles.error}>Catálogo não encontrado</div>;
  }

  return (
    <div className={styles.page}>
      {/* Header com logo e botão do carrinho */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{catalog.company.name}</h1>
          <button 
            className={styles.cartBtn}
            onClick={() => setCartOpen(true)}
          >
            🛒 Carrinho ({getTotalItems()})
          </button>
        </div>
      </header>

      {/* Grid de produtos */}
      <main className={styles.main}>
        <div className={styles.productsGrid}>
          {catalog.products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={styles.productImage}
                />
              )}
              
              <div className={styles.productInfo}>
                <h2>{product.name}</h2>
                {product.description && (
                  <p className={styles.description}>{product.description}</p>
                )}
                
                <div className={styles.productFooter}>
                  <span className={styles.price}>
                    R$ {product.price.toFixed(2)}
                  </span>
                  
                  <button
                    className={styles.addBtn}
                    onClick={() => handleAddToCart(product)}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Componente do carrinho */}
      <Cart
        slug={slug}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}
```

---

## Passo 3: Criar arquivo de estilos (opcional)

```scss
// frontend/src/app/catalog/[slug]/page.module.scss

.page {
  min-height: 100vh;
  background: #f9fafb;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.headerContent {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 2rem;
  }
}

.cartBtn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.productsGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.productCard {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
}

.productImage {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.productInfo {
  padding: 1.5rem;
}

.productInfo h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.description {
  margin: 0.5rem 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}

.productFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

.addBtn {
  flex: 1;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: #059669;
  }
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
}

.error {
  color: #dc2626;
}

@media (max-width: 768px) {
  .headerContent {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;

    h1 {
      font-size: 1.5rem;
    }
  }

  .cartBtn {
    width: 100%;
  }

  .productsGrid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .main {
    padding: 1rem;
  }
}
```

---

## Passo 4: Adicionar interface para empresa configurar WhatsApp

```tsx
// frontend/src/app/dashboard/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export default function SettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompany(data);
        setPhone(data.phone || "");
      }
    };

    loadCompany();
  }, []);

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      setMessage("Por favor, preencha o número de telefone");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/company/phone", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      if (response.ok) {
        const data = await response.json();
        setCompany(data.data);
        setMessage("✅ Número salvo com sucesso!");
      } else {
        const error = await response.json();
        setMessage(`❌ Erro: ${error.error}`);
      }
    } catch (error) {
      setMessage("❌ Erro ao salvar número");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>⚙️ Configurações</h1>

      <div className={styles.section}>
        <h2>📱 WhatsApp para Receber Pedidos</h2>
        <p>Configure seu número WhatsApp para receber os pedidos dos clientes</p>

        <div className={styles.form}>
          <label>Número WhatsApp</label>
          <input
            type="tel"
            placeholder="+55 11 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          <small>Formato: +55 11 999999999</small>

          {message && (
            <div className={message.includes("✅") ? styles.success : styles.error}>
              {message}
            </div>
          )}

          <button
            onClick={handleSavePhone}
            disabled={loading}
            className={styles.btn}
          >
            {loading ? "Salvando..." : "💾 Salvar Número"}
          </button>
        </div>

        {company?.phone && (
          <div className={styles.info}>
            <p>✅ <strong>Número cadastrado:</strong> {company.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Fluxo Completo

```
Cliente                          Sistema                      Empresa
  │                               │                              │
  ├──────────────────────────────→│ Acessa /catalog/minha-loja    │
  │                               │                              │
  │ Vê produtos                   │ Retorna catálogo com items  │
  ├──────────────────────────────→│                              │
  │                               │                              │
  │ Clica "Adicionar ao Carrinho" │ Salva em localStorage       │
  ├───────────┐                   │                              │
  │           │                   │                              │
  │ Adiciona 3 │                   │                              │
  │ produtos   │                   │                              │
  │           │                   │                              │
  │←──────────┘                   │                              │
  │                               │                              │
  │ Clica "🛒 Carrinho (3)"       │ Abre painel                 │
  ├──────────────────────────────→│                              │
  │                               │                              │
  │ Vê resumo + total             │ Mostra itens                │
  │                               │                              │
  │ Preenche nome e telefone      │ Valida dados                │
  │                               │                              │
  │ Clica "Finalizar via WhatsApp"│ Envia POST /checkout        │
  ├──────────────────────────────→│                              │
  │                               │                              │
  │                               │ Monta mensagem formatada    │
  │                               │                              │
  │                               │ Retorna WhatsApp URL       │
  │                               │                              │
  │ Abre WhatsApp automaticamente │ Gera link wa.me             │
  ├──────────────────────────────→│                              │
  │                               │                              │
  │                               │ Mostra mensagem pronta      │
  │                               │                              │
  │ Clica "Enviar"                │                              │
  ├──────────────────────────────────────────────────────────────→│
  │                               │                     Recebe no │
  │                               │                     WhatsApp │
  │                               │                              │
```

---

## Testando Localmente

```bash
# Terminal 1: Backend
cd /workspaces/MiniSaas-back-end
npm run dev

# Terminal 2: Frontend
cd /workspaces/MiniSaas-back-end/frontend
npm run dev

# Acessar
http://localhost:3000/catalog/minha-loja
```

---

## Resultado Final

✅ Cliente vê catálogo  
✅ Adiciona produtos ao carrinho  
✅ Edita quantidades  
✅ Clica "Finalizar"  
✅ **WhatsApp abre com lista pronta**  
✅ Empresa recebe o pedido  

**Sistema 100% funcional!** 🎉
