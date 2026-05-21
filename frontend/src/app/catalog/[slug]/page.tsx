"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { catalogService, Catalog } from "@/services/catalogService";
import styles from "./page.module.scss";
import Image from "next/image";

export default function CatalogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCatalog();
  }, [slug]);

  const loadCatalog = async () => {
    try {
      const data = await catalogService.getCatalog(slug);
      setCatalog(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Catálogo não encontrado");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>❌ Catálogo não encontrado</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {catalog.company.logo && (
            <img
              src={catalog.company.logo}
              alt={catalog.company.name}
              className={styles.logo}
            />
          )}
          <div>
            <h1>{catalog.company.name}</h1>
            {catalog.company.premium && (
              <span className={styles.premiumBadge}>Premium</span>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {catalog.products.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum produto disponível no momento</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {catalog.products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                {product.image && (
                  <div className={styles.imageWrapper}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  </div>
                )}
                <div className={styles.placeholder} style={{ display: product.image ? "none" : "flex" }}>
                  📦
                </div>

                <div className={styles.productContent}>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Catálogo criado com <strong>Catálogo Web</strong> - Plataforma de Catálogos Web
        </p>
      </footer>
    </div>
  );
}
