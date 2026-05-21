"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { checkoutService } from "@/services/checkoutService";
import styles from "./Cart.module.scss";

interface CartProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ slug, isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Seu carrinho está vazio");
      return;
    }

    if (!customerName.trim()) {
      setError("Por favor, digite seu nome");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await checkoutService.sendToWhatsApp(
        slug,
        items,
        customerName,
        customerPhone
      );

      // Clear cart and redirect to WhatsApp
      clearCart();
      setCustomerName("");
      setCustomerPhone("");
      onClose();

      // Open WhatsApp
      window.open(response.data.whatsappUrl, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.cartPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>🛒 Carrinho</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Seu carrinho está vazio</p>
            <small>Adicione produtos para começar</small>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  {item.image && (
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  )}
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p className={styles.price}>R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className={styles.itemQuantity}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.btnQty}
                    >
                      −
                    </button>
                    <span className={styles.qty}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.btnQty}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    <p className={styles.total}>R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className={styles.btnRemove}
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.checkout}>
              <div className={styles.total}>
                <strong>Subtotal:</strong>
                <strong className={styles.value}>R$ {getTotalPrice().toFixed(2)}</strong>
              </div>

              <input
                type="text"
                placeholder="Seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={styles.input}
              />

              <input
                type="tel"
                placeholder="Seu telefone (opcional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={styles.input}
              />

              {error && <div className={styles.error}>{error}</div>}

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className={styles.btnCheckout}
              >
                {loading ? "Processando..." : "📱 Finalizar via WhatsApp"}
              </button>

              <button
                onClick={() => clearCart()}
                disabled={items.length === 0}
                className={styles.btnClear}
              >
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
