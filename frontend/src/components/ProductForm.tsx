"use client";

import { useState } from "react";
import { productService, Product } from "@/services/productService";
import styles from "./ProductForm.module.scss";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess: (product: Product) => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    active: product?.active ?? true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: any = {
        ...formData,
        price: parseFloat(formData.price as any),
      };

      if (image) {
        data.image = image;
      }

      let result: Product;
      if (product) {
        result = await productService.updateProduct(product.id, data);
      } else {
        result = await productService.createProduct(data);
      }

      onSuccess(result);
      setFormData({ name: "", description: "", price: "", active: true });
      setImage(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{product ? "Editar Produto" : "Novo Produto"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o produto"
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Preço *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="active">
                <input
                  id="active"
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                Ativo
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Imagem {product && "(deixe em branco para manter)"}</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {image && <p className={styles.fileName}>{image.name}</p>}
            {product?.image && !image && (
              <img src={product.image} alt={product.name} className={styles.preview} />
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
