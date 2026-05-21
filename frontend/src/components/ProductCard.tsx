"use client";

import { Product, productService } from "@/services/productService";
import styles from "./ProductCard.module.scss";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      setDeleting(true);
      try {
        await productService.deleteProduct(product.id);
        onDelete(product.id);
      } catch (error) {
        alert("Erro ao deletar produto");
        setDeleting(false);
      }
    }
  };

  return (
    <div className={styles.card}>
      {product.image && (
        <img src={product.image} alt={product.name} className={styles.image} />
      )}
      <div className={styles.placeholder} style={{ display: product.image ? "none" : "block" }}>
        📷
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3>{product.name}</h3>
          {!product.active && <span className={styles.badge}>Inativo</span>}
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={onEdit}
              disabled={deleting}
            >
              ✏️ Editar
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "..." : "🗑️ Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
