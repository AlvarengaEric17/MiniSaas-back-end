"use client";

import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🚀 Catálogo Web</h1>
        <p>Catálogo Web para Pequenas Empresas</p>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h2>Seu catálogo online em minutos</h2>
          <p>
            Crie um catálogo profissional para sua empresa com isolamento total de dados.
            Cada empresa tem seus próprios produtos, sem compartilhar informações.
          </p>

          <div className={styles.buttons}>
            <Link href="/auth/signup" className={`${styles.button} ${styles.primary}`}>
              Criar Conta
            </Link>
            <Link href="/auth/login" className={`${styles.button} ${styles.secondary}`}>
              Entrar
            </Link>
          </div>
        </section>

        <section className={styles.features}>
          <h3>Recursos</h3>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h4>🔐 Segurança Total</h4>
              <p>Seus dados são isolados. Cada empresa vê apenas seus próprios produtos.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>📱 Responsivo</h4>
              <p>Funciona perfeitamente em celulares, tablets e desktops.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>🖼️ Upload de Imagens</h4>
              <p>Adicione imagens dos seus produtos com Cloudinary.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>⚡ Rápido</h4>
              <p>Arquitetura moderna e escalável para crescer com você.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>🎨 Catálogo Público</h4>
              <p>Seu catálogo fica disponível com um URL único e personalizado.</p>
            </div>
            <div className={styles.featureCard}>
              <h4>💰 Plano Gratuito</h4>
              <p>Comece grátis com 10 produtos. Upgrade quando precisar.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 MiniSaaS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
