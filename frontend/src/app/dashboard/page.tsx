"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { authService } from "@/services/authService";
import { productService, Product } from "@/services/productService";
import styles from "./page.module.scss";
import { ProductForm } from "@/components/ProductForm";
import { ProductCard } from "@/components/ProductCard";

interface Company {
  id: string;
  name: string;
  slug: string;
  premium: boolean;
  maxProducts: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const companyData = await authService.getMe();
      setCompany(companyData);
      
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      authService.clearToken();
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleProductCreated = async (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    setShowForm(false);
  };

  const handleProductUpdated = async (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
    setEditingProduct(null);
  };

  const handleProductDeleted = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const catalogUrl = company
    ? `${window.location.origin}/catalog/${company.slug}`
    : "";

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loading}>Carregando...</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.companyInfo}>
            <h2>{company?.name}</h2>
            <p>{company?.slug}</p>
            <div className={styles.stats}>
              <div>
                <span className={styles.label}>Produtos</span>
                <span className={styles.value}>{products.length}</span>
              </div>
              <div>
                <span className={styles.label}>Limite</span>
                <span className={styles.value}>{company?.maxProducts}</span>
              </div>
            </div>

            <div className={styles.catalogSection}>
              <p className={styles.sectionTitle}>Seu Catálogo Público</p>
              <input
                type="text"
                value={catalogUrl}
                readOnly
                className={styles.catalogUrl}
              />
              <button
                className={styles.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(catalogUrl);
                  alert("URL copiada!");
                }}
              >
                Copiar URL
              </button>
            </div>

            {!company?.premium && (
              <div className={styles.premiumBanner}>
                <p>Faça upgrade para Premium</p>
                <small>Produtos ilimitados e mais recursos</small>
              </div>
            )}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.header}>
            <h1>Produtos</h1>
            {products.length < (company?.maxProducts || 10) && (
              <button
                className={styles.newProductButton}
                onClick={() => setShowForm(true)}
              >
                + Novo Produto
              </button>
            )}
          </div>

          {showForm && (
            <ProductForm
              onClose={() => setShowForm(false)}
              onSuccess={handleProductCreated}
            />
          )}

          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onClose={() => setEditingProduct(null)}
              onSuccess={handleProductUpdated}
            />
          )}

          {products.length === 0 ? (
            <div className={styles.empty}>
              <p>Nenhum produto ainda</p>
              <button
                className={styles.createButton}
                onClick={() => setShowForm(true)}
              >
                Criar primeiro produto
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => setEditingProduct(product)}
                  onDelete={handleProductDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
