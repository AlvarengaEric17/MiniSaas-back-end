"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import styles from "./Header.module.scss";

interface Company {
  id: string;
  name: string;
  email: string;
  slug: string;
}

export function Header() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService
        .getMe()
        .then(setCompany)
        .catch(() => {
          authService.clearToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authService.clearToken();
    router.push("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🚀 MiniSaaS
        </Link>

        <nav className={styles.nav}>
          {!isLoading && company ? (
            <>
              <span className={styles.company}>{company.name}</span>
              <Link href="/dashboard" className={styles.link}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className={styles.logout}>
                Sair
              </button>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/auth/login" className={styles.link}>
                Entrar
              </Link>
              <Link href="/auth/signup" className={`${styles.link} ${styles.primary}`}>
                Criar Conta
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
